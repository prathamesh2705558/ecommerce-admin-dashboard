'use client'; // This is required for interactivity

import { useState } from 'react';

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) return alert("Please select a file first");
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send file to our backend API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        setImageUrl(data.url);
        alert("Upload Successful!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed, check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg max-w-sm">
      <h3 className="mb-4 text-lg font-bold">Upload Product Image</h3>
      
      {/* File Input */}
      <input 
        type="file" 
        onChange={onFileChange} 
        className="mb-4 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Preview */}
      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded shadow-md" />
          <p className="text-xs text-gray-400 mt-2 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}