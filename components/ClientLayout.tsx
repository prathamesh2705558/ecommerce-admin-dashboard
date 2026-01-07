"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // 1. Loading state
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  // 2. If NOT logged in, show Login Screen
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-10 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-blue-400">Inventory Login</h1>
          <button 
            onClick={() => signIn('google')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 3. If Logged in -> Show Dashboard
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col fixed h-full md:relative z-10">
        
        {/* --- NEW PROFILE HEADER --- */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-1">
            {/* Show Google Profile Image if it exists */}
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
            )}
            {/* Show Google Name instead of "MyPanel" */}
            <span className="text-lg font-bold text-white truncate">
              {session.user?.name || "Admin"}
            </span>
          </div>
          <div className="text-xs text-gray-500 pl-1">
            {session.user?.email}
          </div>
        </div>
        {/* ------------------------- */}
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={`block p-3 rounded transition ${pathname === '/' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            📊 Dashboard
          </Link>
          <Link href="/products" className={`block p-3 rounded transition ${pathname.includes('/products') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            📦 Products
          </Link>
          <Link href="/products/new" className={`block p-3 rounded transition ${pathname === '/products/new' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            ➕ Add Product
          </Link>
           {/* New Settings Link */}
          <Link href="/settings" className={`block p-3 rounded transition ${pathname === '/settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
            ⚙️ Settings
          </Link>
        </nav>

        <button 
          onClick={() => signOut()}
          className="p-4 text-left text-red-400 hover:bg-gray-700 border-t border-gray-700 transition w-full"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}