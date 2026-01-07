"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // HARDCODED CREDENTIALS
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true"); // Save login state
      router.push("/"); // Go to dashboard
    } else {
      alert("Wrong credentials! Try 'admin' and '1234'");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        
        <label className="block text-gray-400 text-sm mb-2">Username</label>
        <input 
          type="text" value={username} onChange={e => setUsername(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600"
        />

        <label className="block text-gray-400 text-sm mb-2">Password</label>
        <input 
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-6 bg-gray-700 text-white rounded border border-gray-600"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500">
          Login
        </button>
      </form>
    </div>
  );
}