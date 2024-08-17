export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const imageFile = formData.get("image");

        if (!imageFile) {
          return new Response("Image file is missing", { status: 400 });
        }

        const imageBuffer = await imageFile.arrayBuffer();

        // Create the input object with the image data
        const input = {
          image: Array.from(new Uint8Array(imageBuffer)), // Convert Uint8Array to a regular array
        };

        // Call the ResNet50 model using the env.AI.run method
        const classification = await env.AI.run(
          "@cf/microsoft/resnet-50",
          input
        );
        const tags = classification
          .map((embedding) => embedding.label)
          .join(" ");
        //        console.log(tags);
        const embeddings = await env.AI.run("@cf/baai/bge-small-en-v1.5", {
          text: tags,
        });

        const semanticData = {
          embeddings: embeddings,
          classification: tags,
        };
        console.log(semanticData);
        console.log(embeddings);
        return new Response(JSON.stringify({ semanticData }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        console.error("Model invocation error:", err);
        return new Response("Error invoking the model", {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
