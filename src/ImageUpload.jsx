import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Adjust the path if necessary
import {
  sendEmbeddingsToPinecone,
  searchSimilarImages,
} from "../pinecone/pinecone.js"; // Import the Pinecone module
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!image) {
      console.log("No image selected.");
      return;
    }

    try {
      setUploading(true);
      const workerUrl = import.meta.env.VITE_APP_WORKER_URL;
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(workerUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = response.data.semanticData;
      console.log("result is", result);

      const storageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytesResumable(storageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      setDownloadURL(url);
      await sendEmbeddingsToPinecone(
        result.embeddings,
        result.classification,
        url
      );
    } catch (error) {
      console.error("Operation failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!image) {
      console.log("No image selected.");
      return;
    }

    try {
      setSearching(true);
      const workerUrl = import.meta.env.VITE_APP_WORKER_URL;
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(workerUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = response.data.semanticData;
      const searchResults = await searchSimilarImages(
        result.embeddings.data.flat()
      );
      setSearchResults(searchResults.matches); // Adjust according to the actual response format
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setUploading(false);
    setDownloadURL(null);
    setSearchResults([]);
    setSearching(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upload and Search for Images
      </h2>
      <form onSubmit={handleUpload} className="flex flex-col items-center">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Flex container for buttons */}
        <div className="flex space-x-4 mb-4">
          <button
            type="submit"
            className={`py-2 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              uploading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className={`py-2 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              searching
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={searching}
          >
            {searching ? "Searching..." : "Search Similar Images"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="py-2 px-4 font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear
          </button>
        </div>
      </form>

      {downloadURL && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-green-500">
            Upload Successful!
          </p>
          <a
            href={downloadURL}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Uploaded Image
          </a>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Similar Images:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map((result, index) => (
              <div key={index} className="text-center">
                <img
                  src={result.metadata.url} // Adjust to match the actual structure
                  alt={`Similar ${index}`}
                  className="w-48 h-auto mx-auto rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
