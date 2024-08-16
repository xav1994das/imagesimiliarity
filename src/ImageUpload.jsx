import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Adjust the path if necessary

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      console.log("No image selected.");
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);

    try {
      setUploading(true);

      // Upload the file
      const snapshot = await uploadBytesResumable(storageRef, image);

      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);

      setDownloadURL(url);
      console.log("File available at", url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upload an Image
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {preview && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium">Image Preview:</p>
          <img
            src={preview}
            alt="Selected"
            className="mt-4 w-48 h-auto mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

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
    </div>
  );
}

export default ImageUploader;
