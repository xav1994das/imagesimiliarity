// api/upsertEmbeddings.js

import { Pinecone } from "@pinecone-database/pinecone";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { embeddings, classification, url } = req.body;
      const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const index = client.Index("my-image-embeddings");
      const payload = [
        {
          id: (Date.now() + Math.floor(Math.random() * 1e9)).toString(36), // Use the generated UUID as the vector ID
          values: embeddings.data.flat(),
          metadata: {
            classification: classification, // Add any metadata if necessary
            url: url,
          },
        },
      ];
      console.log("payload", payload.metadata);
      await index.upsert(payload);

      res.status(200).json({ message: "Embeddings upserted successfully" });
    } catch (error) {
      console.error("Error storing embeddings in Pinecone:", error);
      res.status(500).json({ error: "Failed to store embeddings in Pinecone" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
