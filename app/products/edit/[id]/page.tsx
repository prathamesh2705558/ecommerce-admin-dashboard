"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation"; 

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // 1. ADDED CATEGORY STATE
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    if (!id) return;
    axios.get("/api/products/" + id).then(response => {
       const product = response.data;
       setName(product.name || product.title || "");
       setDescription(product.description || "");
       setCategory(product.category || ""); // 2. LOAD EXISTING CATEGORY
       setPrice(product.price);
       setStock(product.stock);
       setImage(product.image || "");
       setIsLoading(false);
    });
  }, [id]);

  // 2. THE FIXED UPLOAD FUNCTION
  async function uploadImages(ev: any) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      data.append('file', files[0]); // Take the first file

      try {
          const res = await axios.post('/api/upload', data);
          
          // FIX: Check if links exist before reading [0]
          if (res.data && res.data.links && res.data.links.length > 0) {
            setImage(res.data.links[0]);
          } else {
             console.error("Upload API returned unexpected format:", res.data);
             alert("Upload successful but image link was missing.");
          }
      } catch (error) {
          console.error("Upload failed:", error);
          alert("Image upload failed. Check your internet or file size.");
      } finally {
          setIsUploading(false);
      }
    }
  }

  // 3. Save Function
  async function saveProduct(ev: React.FormEvent) {
    ev.preventDefault();
    const data = { 
        name, 
        description, 
        category, // 3. INCLUDE CATEGORY IN SAVE
        price: Number(price), 
        stock: Number(stock), 
        image 
    };
    
    await axios.put("/api/products/" + id, data);
    router.push("/products");
  }

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Product</h1>
      
      <form onSubmit={saveProduct} className="flex flex-col gap-4">
        
        {/* Name */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={ev => setName(ev.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
        </div>

        {/* Category - 4. ADDED CATEGORY INPUT (Exact same design) */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Electronics"
              value={category} 
              onChange={ev => setCategory(ev.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
        </div>

        {/* Photos */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">Photos</label>
            <div className="flex flex-wrap gap-2 mb-2">
                
                {image && (
                  <div className="h-24 bg-white p-2 shadow-sm rounded border border-gray-200">
                    <img src={image} alt="" className="h-full rounded-lg" />
                  </div>
                )}
                
                {isUploading && (
                  <div className="h-24 flex items-center justify-center p-4 bg-gray-800 rounded">
                     <div className="text-blue-400 text-sm font-bold animate-pulse">Uploading...</div>
                  </div>
                )}

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
                  value={price} 
                  onChange={ev => setPrice(ev.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                />
            </div>
            <div className="flex-1">
                <label className="text-gray-400 text-sm mb-1 block">Stock</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={ev => setStock(ev.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                />
            </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold">
                Save Product
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