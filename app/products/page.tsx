"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DollarSign, Package, ShoppingCart, ArrowLeft } from "lucide-react";

interface Product {
  _id: string;
  name?: string;
  title?: string;
  price: number;
  stock: number;
  sold?: number;
  image?: string;
  createdAt?: string;
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Redirect
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  // Fetch Data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchProducts();
  }, [status]);

  // Actions
  const markAsSold = async (product: Product) => {
    if (product.stock <= 0) return;
    try {
      // 1. Decrease Stock & Increase Sold Count
      await axios.put(`/api/products/${product._id}`, {
        stock: product.stock - 1,
        sold: (product.sold || 0) + 1
      });

      // 2. Record the Sale (Crucial for Dashboard Graph)
      await axios.post('/api/sales', {
        productName: product.name || product.title,
        price: product.price
      });

      // 3. Refresh List
      fetchProducts(); 
    } catch (error) { console.error("Error selling product", error); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) { console.error("Error", error); }
  };

  // Stats Logic
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalSalesValue = products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0);

  if (status === "loading" || loading) return <div className="bg-gray-900 min-h-screen text-white p-8">Loading...</div>;

  if (session) {
    return (
      <div className="bg-gray-900 min-h-screen p-8 text-white">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <Link href="/" className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold">Inventory Management</h1>
            </div>
            <Link href="/products/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold shadow-lg">
                + Add Product
            </Link>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md flex items-center justify-between">
                <div>
                    <h2 className="text-gray-400 text-xs font-bold uppercase">Total Inventory</h2>
                    <p className="text-2xl font-bold text-green-400 mt-1">${totalInventoryValue.toLocaleString()}</p>
                </div>
                <DollarSign className="text-green-500 opacity-50"/>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md flex items-center justify-between">
                <div>
                    <h2 className="text-gray-400 text-xs font-bold uppercase">Total Sales</h2>
                    <p className="text-2xl font-bold text-blue-400 mt-1">${totalSalesValue.toLocaleString()}</p>
                </div>
                <ShoppingCart className="text-blue-500 opacity-50"/>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md flex items-center justify-between">
                <div>
                    <h2 className="text-gray-400 text-xs font-bold uppercase">Total Products</h2>
                    <p className="text-2xl font-bold text-white mt-1">{products.length}</p>
                </div>
                <Package className="text-gray-400 opacity-50"/>
            </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <table className="w-full text-left text-gray-400">
            <thead className="bg-gray-900 text-gray-200 uppercase text-xs tracking-wider">
                <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Date Added</th>
                    <th className="p-4">Sold</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-700/50 transition">
                    <td className="p-4 flex items-center gap-3">
                        {product.image ? (
                            <img src={product.image} alt="Img" className="w-10 h-10 object-cover rounded border border-gray-600" />
                        ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs">No Img</div>
                        )}
                        <span className="text-white font-bold">{product.name || product.title}</span>
                    </td>
                    <td className="p-4 text-green-400 font-mono">${product.price}</td>
                    <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
                    </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-gray-300">{product.sold || 0}</td>
                    <td className="p-4 flex gap-2 justify-end">
                    <button 
                        onClick={() => markAsSold(product)}
                        disabled={product.stock <= 0}
                        className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 transition"
                    >
                        Sell
                    </button>
                    <Link href={'/products/edit/' + product._id} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition">
                        Edit
                    </Link>
                    <button 
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1 rounded text-sm transition"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {products.length === 0 && !loading && (
                <div className="p-10 text-center text-gray-500">No products found.</div>
            )}
        </div>
      </div>
    );
  }
  return null;
}