import React, { useState, useEffect } from 'react';

// 1. DATOS REALES DE TUS FOTOS
const DATA_MASTER = [
  { id: 1, name: "OMODA 5 VALLADOLID", volume: 3200, trend: 185, type: "Compra", region: "Valladolid", category: "Coches", leads: 42 },
  { id: 2, name: "JAECOO 7 PRECIO ESPAÑA", volume: 2400, trend: 210, type: "Precios", region: "España", category: "Coches", leads: 28 },
  { id: 3, name: "ALQUILER FURGONETAS VALLADOLID", volume: 1800, trend: 45, type: "Alquiler", region: "Valladolid", category: "Coches", leads: 15 },
  { id: 4, name: "MOTOS OCASIÓN LEÓN", volume: 850, trend: 12, type: "Compra", region: "Castilla y León", category: "Motos", leads: 6 },
  { id: 5, name: "CONCESIONARIO OMODA VALLADOLID", volume: 1900, trend: 320, type: "Compra", region: "Valladolid", category: "Coches", leads: 31 },
  { id: 6, name: "RENTING PARTICULARES VALLADOLID", volume: 1100, trend: 28, type: "Renting", region: "Valladolid", category: "Coches", leads: 12 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [region, setRegion] = useState('Valladolid');
  const [type, setType] = useState('Todos los tipos');
  const [category, setCategory] = useState('Todos');
  const [filteredData, setFilteredData] = useState(DATA_MASTER);

  // FILTRADO REAL
  useEffect(() => {
    const result = DATA_MASTER.filter(k => {
      const matchRegion = region === 'Toda España' || region === 'España' || k.region === region;
      const matchType = type === 'Todos los tipos' || k.type === type;
      const matchCat = category === 'Todos' || k.category === category;
      return matchRegion && matchType && matchCat;
    });
    setFilteredData(result);
  }, [region, type, category]);

  // MÉTRICAS DINÁMICAS (image_0e9389.png)
  const stats = {
    results: filteredData.length,
    trend: filteredData.length > 0 ? `+${Math.max(...filteredData.map(d => d.trend))}%` : '0%',
    leads: filteredData.reduce((acc, curr) => acc + curr.leads, 0),
    opts: filteredData.filter(d => d.trend > 100).length
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR (image_0e8121.png) */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg italic">V</div>
          <h1 className="text-xl font-black italic tracking-tighter">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊' }, { id: 'Landings', icon: '📄' }, 
            { id: 'ROI & Leads', icon: '📈' }, { id: 'Alertas', icon: '🔔' }, { id: 'Campañas', icon: '🎯' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}>
              <span className="text-lg">{item.icon}</span> {item.id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Análisis en tiempo real {region}</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] tracking-widest uppercase">Live Data Connect</div>
        </header>

        {/* MÉTRICAS (image_0e9389.png) */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest text-center">Keywords Activas</p>
            <p className="text-5xl font-black text-[#4F46E5] text-center tracking-tighter">{stats.results}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest text-center">Tendencia Alza</p>
            <p className="text-5xl font-black text-[#10B981] text-center tracking-tighter">{stats.trend}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest text-center">Leads Proyectados</p>
            <p className="text-5xl font-black text-[#F43F5E] text-center tracking-tighter">{stats.leads}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest text-center">Oportunidades</p>
            <p className="text-5xl font-black text-[#F59E0B] text-center tracking-tighter">{stats.opts}</p>
          </div>
        </div>

        {/* --- CONTENIDO DASHBOARD (image_0e7903.png y image_0e8c49.png) --- */}
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#0F172A]">Ranking de Búsqueda Real</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(c => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${category === c ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400'}`}>
                    {c === 'Coches' ? '🚗 Coches' : c === 'Motos' ? '🏍️ Motos' : 'Ver Todos'}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTROS (image_0e8be7.png y image_0e8c06.png) */}
            <div className="flex gap-4 mb-10">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl font-black text-xs uppercase cursor-pointer outline-none">
                <option value="Valladolid">📍 Valladolid</option>
                <option value="Castilla y León">📍 Castilla y León</option>
                <option value="Toda España">📍 Toda España</option>
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl font-black text-xs uppercase cursor-pointer outline-none">
                <option value="Todos los tipos">🔍 Todos los tipos</option>
                <option value="Compra">Compra</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Precios">Precios</option>
                <option value="Renting">Renting</option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
                <tr><th className="pb-6">Palabra Clave</th><th className="pb-6 text-center">Intención</th><th className="pb-6 text-center">Búsquedas</th><th className="pb-6 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold italic">
                {filteredData.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 text-sm uppercase tracking-tighter text-slate-700">{kw.name}</td>
                    <td className="py-6 text-center"><span className="px-3 py-1 bg-slate-100 text-[9px] font-black rounded-full uppercase text-slate-500">{kw.type}</span></td>
                    <td className="py-6 text-center text-slate-400 font-black text-lg">{kw.volume}</td>
                    <td className="py-6 text-right text-[#10B981] font-black text-lg">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA ROI (image_049303.png) --- */}
        {activeTab === 'ROI & Leads' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black">306€</p>
              <p className="text-[10px] font-black text-slate-300 uppercase mt-4">Inversión Estimada</p>
            </div>
            <div className="bg-[#4F46E5] p-12 rounded-[3rem] text-white shadow-xl text-center">
              <p className="text-5xl font-black">{stats.leads}</p>
              <p className="text-[10px] font-black opacity-60 uppercase mt-4">Leads Reales</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black text-[#10B981]">3600€</p>
              <p className="text-[10px] font-black text-slate-300 uppercase mt-4">Retorno Bruto</p>
            </div>
          </div>
        )}

        {/* --- VISTA LANDINGS (image_0ef1f9.png) --- */}
        {activeTab === 'Landings' && (
          <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 italic shadow-sm">
             <h3 className="text-slate-300 font-black text-2xl uppercase tracking-[0.2em]">Sincronizado con Google Search Console...</h3>
          </div>
        )}

        {/* --- VISTA ALERTAS (image_049058.png) --- */}
        {activeTab === 'Alertas' && (
          <div className="bg-white p-10 rounded-[3rem] border-l-[12px] border-rose-500 shadow-sm flex items-center gap-6">
            <span className="text-4xl animate-pulse">🔥</span>
            <div>
              <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest">Alerta Crítica</p>
              <p className="font-bold italic text-xl">OMODA subiendo un 150% en Valladolid. ¡Actuar ahora!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
