"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // 1. ADDED CATEGORY STATE
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();

  // 1. ROBUST UPLOAD FUNCTION (Same as Edit Page)
  async function uploadImages(ev: any) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      data.append('file', files[0]);

      try {
        const res = await axios.post('/api/upload', data);
        
        // Safety Check: Ensure links exist before using them
        if (res.data && res.data.links && res.data.links.length > 0) {
          setImage(res.data.links[0]);
        } else {
          console.error("Upload failed: No links returned", res.data);
          alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image.");
      } finally {
        setIsUploading(false);
      }
    }
  }

  // 2. SAVE FUNCTION (Creates new product)
  async function saveProduct(ev: React.FormEvent) {
    ev.preventDefault();
    const data = { 
        name, 
        description,
        category, // 2. ADDED CATEGORY TO DATA
        price: Number(price), 
        stock: Number(stock), 
        image 
    };
    
    try {
        await axios.post("/api/products", data);
        router.push("/products");
    } catch (error) {
        console.error("Error creating product:", error);
        alert("Failed to create product.");
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">New Product</h1>
        
        <form onSubmit={saveProduct} className="flex flex-col gap-4">
            
            {/* Name */}
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Product Name</label>
                <input 
                    type="text" 
                    placeholder="Product Name"
                    value={name} 
                    onChange={ev => setName(ev.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                />
            </div>

            {/* Category - 3. ADDED CATEGORY INPUT FIELD */}
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Category</label>
                <input 
                    type="text" 
                    placeholder="e.g. Electronics, Office, Home"
                    value={category} 
                    onChange={ev => setCategory(ev.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                />
            </div>

            {/* Photos Upload */}
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Photos</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    
                    {/* Image Preview */}
                    {image && (
                        <div className="h-24 bg-white p-2 shadow-sm rounded border border-gray-200">
                            <img src={image} alt="" className="h-full rounded-lg" />
                        </div>
                    )}
                    
                    {/* Spinner */}
                    {isUploading && (
                        <div className="h-24 flex items-center justify-center p-4 bg-gray-800 rounded">
                            <div className="text-blue-400 text-sm font-bold animate-pulse">Uploading...</div>
                        </div>
                    )}

                    {/* Upload Button */}
                    <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>Upload</div>
                        <input type="file" onChange={uploadImages} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea 
                    placeholder="Description"
                    value={description} 
                    onChange={ev => setDescription(ev.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 h-24"
                />
            </div>

            {/* Price & Stock */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-gray-400 text-sm mb-1 block">Price ($)</label>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        value={price} 
                        onChange={ev => setPrice(ev.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-gray-400 text-sm mb-1 block">Stock</label>
                    <input 
                        type="number" 
                        placeholder="0"
                        value={stock} 
                        onChange={ev => setStock(ev.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold">
                    Save
                </button>
                <button 
                    type="button" 
                    onClick={() => router.push('/products')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold"
                >
                    Cancel
                </button>
            </div>

        </form>
    </div>
  );
}