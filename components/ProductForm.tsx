"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Upload } from "lucide-react";

interface ProductFormProps {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  category?: string; // Added category to props
}

export default function ProductForm({
  _id,
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  stock: existingStock,
  image: existingImage,
  category: existingCategory,
}: ProductFormProps) {
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(existingCategory || ""); // Added category state
  const [price, setPrice] = useState(existingPrice || "");
  const [stock, setStock] = useState(existingStock || "");
  const [image, setImage] = useState(existingImage || "");
  const router = useRouter();

  async function saveProduct(ev: React.FormEvent) {
    ev.preventDefault();
    const data = { 
      name, 
      description, 
      category, // Include category in data
      price, 
      stock, 
      image 
    };

    if (_id) {
      // Update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Create
      await axios.post("/api/products", data);
    }
    router.push("/products");
    router.refresh();
  }

  return (
    <form onSubmit={saveProduct} className="space-y-4">
      
      {/* Name */}
      <div>
        <label className="block text-gray-400 text-sm font-bold mb-1">Product Name</label>
        <input
          type="text"
          placeholder="e.g. iPhone 15 Pro"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Category - ADDED HERE */}
      <div>
        <label className="block text-gray-400 text-sm font-bold mb-1">Category</label>
        <input
          type="text"
          placeholder="e.g. Electronics, Clothing, Office"
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Row for Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm font-bold mb-1">Price (USD)</label>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-bold mb-1">Stock Quantity</label>
          <input
            type="number"
            placeholder="0"
            value={stock}
            onChange={(ev) => setStock(ev.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-gray-400 text-sm font-bold mb-1">Image URL</label>
        <div className="flex gap-2">
            <input
            type="text"
            placeholder="https://..."
            value={image}
            onChange={(ev) => setImage(ev.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 focus:border-blue-500 focus:outline-none"
            />
            {image && (
                <img src={image} alt="Preview" className="h-10 w-10 rounded border border-gray-600 object-cover" />
            )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-400 text-sm font-bold mb-1">Description</label>
        <textarea
          placeholder="Product details..."
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 h-24 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-2">
        <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition"
        >
            <Save size={18} />
            Save Product
        </button>
        <button 
            type="button" 
            onClick={() => router.push('/products')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold transition"
        >
            Cancel
        </button>
      </div>
    </form>
  );
}