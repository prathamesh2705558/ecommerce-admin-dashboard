"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend
} from "recharts";
import { AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

// --- TYPES ---
interface Product {
  _id: string;
  name?: string;
  title?: string;
  price: number;
  stock: number;
  sold?: number;
  category?: string;
}

interface SaleData {
  date: string;
  price: number;
}

// --- CONSTANTS & HELPERS ---
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const getLastNDays = (days: number) => {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    arr.push({ date: dateStr, sales: 0 });
  }
  return arr;
};

// Helper for the Pie Chart Active Shape
const renderActiveShape = (props: any) => { 
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#fff" className="text-base font-bold font-sans">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={16} textAnchor="middle" fill="#9CA3AF" className="text-xs font-sans">
        {`${value} Items (${(percent * 100).toFixed(0)}%)`}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function Home() {
  const { data: session, status } = useSession();
  
  // -- STATE --
  const [products, setProducts] = useState<Product[]>([]);
  const [salesRawData, setSalesRawData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Toggle for 7 vs 30 days
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // -- FETCH DATA --
  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      Promise.all([
        axios.get("/api/products"),
        axios.get("/api/sales")
      ]).then(([prodRes, salesRes]) => {
        setProducts(prodRes.data);
        setSalesRawData(salesRes.data);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
    }
  }, [status]);

  // -- MEMOIZED DATA PROCESSING --

  // 1. Process Sales Revenue
  const salesGraphData = useMemo(() => {
    const daysCount = timeRange === '7d' ? 7 : 30;
    const templateDays = getLastNDays(daysCount); 
    const salesMap: Record<string, number> = {};

    salesRawData.forEach(sale => {
      const d = new Date(sale.date);
      if (!isNaN(d.getTime())) {
        const saleDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        salesMap[saleDate] = (salesMap[saleDate] || 0) + sale.price;
      }
    });

    return templateDays.map(day => ({
      date: day.date,
      sales: salesMap[day.date] || 0
    }));
  }, [salesRawData, timeRange]);

  // 2. Process Stock vs Sold Data
  const stockVsSoldData = useMemo(() => {
    return products.map(p => ({
      name: p.name || p.title || 'Unknown',
      InStock: p.stock,
      Sold: p.sold || 0,
    }));
  }, [products]);

  // 3. Process Categories
  const pieData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    const data = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));
    return data.length ? data : [{ name: 'No Data', value: 1 }];
  }, [products]);


  // -- RENDER --
  if (status === "loading") return <div className="bg-gray-900 h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;

  if (!session) {
    return (
      <div className="bg-gray-900 w-screen h-screen flex items-center justify-center">
        <div className="text-center w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <h1 className="text-white text-3xl mb-6 font-bold">Admin Panel</h1>
          <button onClick={() => signIn('google')} className="w-full bg-white text-black p-4 rounded-lg font-bold hover:bg-gray-200 transition">Sign in with Google</button>
        </div>
      </div>
    );
  }

  // Basic Stats Calculation
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalProducts = products.length;
  const totalSoldUnits = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock < 5);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-4">
            <Link href="/products" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold transition">Manage Inventory</Link>
            <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-bold transition">Logout</button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-xs uppercase mb-2 font-semibold">Total Value</p>
            <h3 className="text-3xl font-black text-green-400">${totalInventoryValue.toLocaleString()}</h3>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-xs uppercase mb-2 font-semibold">Total Products</p>
            <h3 className="text-3xl font-black text-blue-400">{totalProducts}</h3>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-xs uppercase mb-2 font-semibold">Units Sold</p>
            <h3 className="text-3xl font-black text-purple-400">{totalSoldUnits}</h3>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-xs uppercase mb-2 font-semibold">Low Stock</p>
            <h3 className="text-3xl font-black text-red-500">{lowStockItems.length}</h3>
          </div>
      </div>

      {/* --- SALES REVENUE GRAPH --- */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <TrendingUp size={20} />
                </div>
                <h3 className="text-lg font-bold">Sales Revenue</h3>
            </div>
            
            {/* TOGGLE BUTTONS */}
            <div className="bg-gray-900 p-1 rounded-lg border border-gray-700 flex text-sm font-bold">
                <button 
                    onClick={() => setTimeRange('7d')}
                    className={`px-4 py-1 rounded transition ${timeRange === '7d' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    7 Days
                </button>
                <button 
                    onClick={() => setTimeRange('30d')}
                    className={`px-4 py-1 rounded transition ${timeRange === '30d' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    30 Days
                </button>
            </div>
        </div>
        
        <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesGraphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.5}/>
                <XAxis dataKey="date" stroke="#9CA3AF" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                    cursor={{ stroke: '#10B981', strokeWidth: 1 }}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} 
                />
                <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    name="Revenue"
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* --- STOCK VS SOLD & PIE CHART --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* STOCK vs SOLD GRAPH */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <DollarSign size={20} />
                </div>
                <h3 className="text-lg font-bold">Stock vs Sold</h3>
            </div>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockVsSoldData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false}/>
                    <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: '#374151', opacity: 0.5}} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="InStock" name="In Stock" fill="#3B82F6" radius={[4, 4, 0, 0]}/>
                    <Bar dataKey="Sold" name="Sold Units" fill="#F59E0B" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Categories</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    activeIndex={activeIndex as any} // FIX: Cast to 'any' to fix TS error
                    activeShape={renderActiveShape} 
                    onMouseEnter={(_, index) => setActiveIndex(index)} 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={75} 
                    outerRadius={100} 
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      {/* LOW STOCK TABLE */}
      {lowStockItems.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20}/>
                <h3 className="text-lg font-bold text-white">Low Stock Watch</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                    <tr><th className="p-4">Product Name</th><th className="p-4">Stock Left</th><th className="p-4 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-sm">
                    {lowStockItems.map(item => (
                        <tr key={item._id} className="hover:bg-gray-700/30">
                            <td className="p-4 font-semibold text-gray-200">{item.name || item.title}</td>
                            <td className="p-4 text-red-400 font-bold">{item.stock}</td>
                            <td className="p-4 text-right"><span className="bg-red-900/30 text-red-300 border border-red-800 px-3 py-1 rounded-full text-xs font-bold">Critical</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}