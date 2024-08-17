import axios from "axios";
export const sendEmbeddingsToPinecone = async (
  embeddings,
  classification,
  url
) => {
  try {
    const vercelUrl = import.meta.env.VITE_APP_UPSERT_EMBEDDINGS; // URL of your Vercel function

    const response = await axios.post(
      vercelUrl,
      {
        embeddings,
        classification,
        url,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to store embeddings in Pinecone");
    }
    return response.data;
  } catch (error) {
    console.error("Error storing embeddings in Pinecone:", error);
    throw error;
  }
};

export const searchSimilarImages = async (queryEmbedding) => {
  try {
    const vercelUrl = import.meta.env.VITE_APP_SEARCH_SIMILAR_IMAGES; // URL of your Vercel function

    const response = await axios.post(
      vercelUrl,
      {
        queryEmbedding,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to search similar images in Pinecone");
    }
    console.log("pinecone resyukt", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching for similar images in Pinecone:", error);
    throw error;
  }
};
