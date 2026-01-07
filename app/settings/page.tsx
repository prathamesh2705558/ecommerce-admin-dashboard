"use client";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>

      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Profile Information</h2>
        
        <div className="flex items-center gap-6 mb-8">
          {session?.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
          )}
          
          <div>
            <p className="text-2xl font-bold text-white">
              {session?.user?.name || "Admin User"}
            </p>
            <p className="text-gray-400">
              {session?.user?.email}
            </p>
            <span className="inline-block mt-2 bg-green-900 text-green-300 text-xs px-2 py-1 rounded">
              Active Session
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3">Account Actions</h3>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}