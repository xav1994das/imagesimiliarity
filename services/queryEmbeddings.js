// api/getEmbeddings.js

import { Pinecone } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { queryEmbedding } = req.body;
      const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const index = client.Index("my-image-embeddings");

      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK: 10,
        includeValues: true,
        includeMetadata: true,
      });

      res.status(200).json(queryResponse);
    } catch (error) {
      console.error("Error querying embeddings from Pinecone:", error);
      res
        .status(500)
        .json({ error: "Failed to query embeddings from Pinecone" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
