import React, { useState, useEffect } from 'react';

// 1. BASE DE DATOS UNIFICADA
const DATA_KEYWORDS = [
  { id: 1, name: "OMODA 5 VALLADOLID", volume: 3200, trend: 185, type: "Compra", region: "Valladolid", category: "Coches", leads: 42 },
  { id: 2, name: "JAECOO 7 PRECIO ESPAÑA", volume: 2400, trend: 210, type: "Precios", region: "España", category: "Coches", leads: 28 },
  { id: 3, name: "ALQUILER FURGONETAS VALLADOLID", volume: 1800, trend: 45, type: "Alquiler", region: "Valladolid", category: "Coches", leads: 15 },
  { id: 4, name: "CONCESIONARIO OMODA VALLADOLID", volume: 1900, trend: 320, type: "Compra", region: "Valladolid", category: "Coches", leads: 31 },
  { id: 5, name: "COCHES OCASION VALLADOLID", volume: 5400, trend: 12, type: "Compra", region: "Valladolid", category: "Coches", leads: 50 },
  { id: 6, name: "MOTOS OCASIÓN LEÓN", volume: 850, trend: 12, type: "Compra", region: "Castilla y León", category: "Motos", leads: 6 }
];

const DATA_LANDINGS = [
  { url: "/concesionario-omoda-valladolid", clicks: 1240, impressions: 15600, ctr: "7.9%", status: "Optimizado" },
  { url: "/alquiler-furgonetas-valladolid", clicks: 890, impressions: 12000, ctr: "7.4%", status: "Revisar SEO" },
  { url: "/ofertas-jaecoo-7", clicks: 450, impressions: 8900, ctr: "5.1%", status: "En Progreso" }
];

export default function App() {
  // ESTADOS GLOBALES
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [region, setRegion] = useState('Valladolid');
  const [type, setType] = useState('Todos los tipos');
  const [category, setCategory] = useState('Todos');
  const [filteredData, setFilteredData] = useState(DATA_KEYWORDS);

  // Lógica de filtrado para que el Dashboard y las métricas siempre funcionen
  useEffect(() => {
    const result = DATA_KEYWORDS.filter(k => {
      const matchRegion = region === 'Toda España' || k.region === region;
      const matchType = type === 'Todos los tipos' || k.type === type;
      const matchCat = category === 'Todos' || k.category === category;
      return matchRegion && matchType && matchCat;
    });
    setFilteredData(result);
  }, [region, type, category]);

  // Cálculos dinámicos para la cabecera
  const stats = {
    results: filteredData.length,
    trend: filteredData.length > 0 ? `+${Math.max(...filteredData.map(d => d.trend))}%` : '0%',
    leads: filteredData.reduce((acc, c) => acc + c.leads, 0),
    opts: filteredData.filter(d => d.trend > 100).length
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR - Navegación fija */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg italic">V</div>
          <h1 className="text-xl font-black italic tracking-tighter">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊' }, 
            { id: 'Landings', icon: '📄' }, 
            { id: 'ROI & Leads', icon: '📈' }, 
            { id: 'Alertas', icon: '🔔' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{item.icon}</span> {item.id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {/* CABECERA COMÚN */}
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Análisis Inteligente: {region}</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] tracking-widest uppercase">Live Data</div>
        </header>

        {/* MÉTRICAS SUPERIORES DINÁMICAS */}
        <div className="grid grid-cols-4 gap-6 mb-10 text-center">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2">RESULTADOS</p><p className="text-5xl font-black text-[#4F46E5]">{stats.results}</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2">TREND MAX</p><p className="text-5xl font-black text-[#10B981]">{stats.trend}</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2">LEADS EST.</p><p className="text-5xl font-black text-[#F43F5E]">{stats.leads}</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2">OPORTUNIDADES</p><p className="text-5xl font-black text-[#F59E0B]">{stats.opts}</p></div>
        </div>

        {/* --- CONTENIDO SEGÚN LA PÁGINA SELECCIONADA --- */}
        
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm animate-in fade-in">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Ranking de Búsqueda</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(c => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${category === c ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mb-10">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-black text-xs uppercase outline-none cursor-pointer">
                <option value="Valladolid">📍 Valladolid</option>
                <option value="Toda España">📍 Toda España</option>
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-black text-xs uppercase outline-none cursor-pointer">
                <option value="Todos los tipos">🔍 Todos los tipos</option>
                <option value="Compra">Compra</option>
                <option value="Alquiler">Alquiler</option>
              </select>
            </div>
            <table className="w-full text-left font-bold italic">
              <thead className="text-[10px] text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <tr><th className="pb-6">Keyword</th><th className="pb-6 text-center">Búsquedas</th><th className="pb-6 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map(kw => (
                  <tr key={kw.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 text-sm uppercase tracking-tighter text-slate-700">{kw.name}</td>
                    <td className="py-6 text-center text-slate-400 text-lg font-black">{kw.volume}</td>
                    <td className="py-6 text-right text-[#10B981] text-lg font-black">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Landings' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm animate-in fade-in">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10">Rendimiento de URLs</h3>
            <table className="w-full text-left font-bold italic">
              <thead className="text-[10px] text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <tr><th>URL</th><th className="text-center">Clics</th><th className="text-center">Impresiones</th><th className="text-right">Estado</th></tr>
              </thead>
              <tbody className
