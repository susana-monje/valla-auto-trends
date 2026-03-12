import React, { useState, useEffect } from 'react';

// 1. DEFINICIÓN DE DATOS (Basado en tus capturas reales)
interface Keyword {
  id: string;
  name: string;
  volume: number;
  trend: number;
  potential: number;
  region: string;
  type: string;
  category: 'Coches' | 'Motos';
}

const DATA_MASTER: Keyword[] = [
  { id: "1", name: "OMODA 5 VALLADOLID", volume: 2400, trend: 150, potential: 98, region: "Valladolid", type: "Compra", category: "Coches" },
  { id: "2", name: "ALQUILER FURGONETAS VALLADOLID", volume: 1800, trend: 45, potential: 90, region: "Valladolid", type: "Alquiler", category: "Coches" },
  { id: "3", name: "MOTOS OCASIÓN LEÓN", volume: 850, trend: 12, potential: 85, region: "Castilla y León", type: "Compra", category: "Motos" },
  { id: "4", name: "COCHES ELÉCTRICOS VALLADOLID", volume: 1200, trend: 18, potential: 92, region: "Valladolid", type: "Compra", category: "Coches" },
  { id: "5", name: "MEJORES SUV HÍBRIDOS 2026", volume: 3200, trend: 25, potential: 94, region: "España", type: "Comparativas", category: "Coches" },
  { id: "6", name: "RENTING PARTICULARES VALLADOLID", volume: 950, trend: 8, potential: 88, region: "Valladolid", type: "Renting", category: "Coches" },
  { id: "7", name: "ALQUILER MOTOS MADRID", volume: 2100, trend: 30, potential: 82, region: "España", type: "Alquiler", category: "Motos" },
  { id: "8", name: "PRECIOS MANTENIMIENTO JAECOO", volume: 550, trend: 200, potential: 95, region: "Castilla y León", type: "Mantenimiento", category: "Coches" },
];

export default function App() {
  // ESTADOS DE NAVEGACIÓN Y FILTROS
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [region, setRegion] = useState('Valladolid');
  const [type, setType] = useState('Todos los tipos');
  const [category, setCategory] = useState<'Todos' | 'Coches' | 'Motos'>('Todos');
  const [filteredData, setFilteredData] = useState<Keyword[]>(DATA_MASTER);

  // LÓGICA DE FILTRADO ÚNICA
  useEffect(() => {
    let result = DATA_MASTER;
    if (region !== 'Toda España' && region !== 'España') result = result.filter(k => k.region === region);
    if (type !== 'Todos los tipos') result = result.filter(k => k.type === type);
    if (category !== 'Todos') result = result.filter(k => k.category === category);
    setFilteredData(result);
  }, [region, type, category]);

  // CÁLCULO DE MÉTRICAS DINÁMICAS (image_0e9389.png)
  const stats = {
    count: filteredData.length,
    trend: filteredData.length > 0 ? Math.round(filteredData.reduce((acc, k) => acc + k.trend, 0) / filteredData.length) : 0,
    leads: filteredData.reduce((acc, k) => acc + Math.floor(k.volume * 0.04), 0),
    opts: filteredData.filter(k => k.potential > 90).length
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR (image_0e8121.png) */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">V</div>
          <div><h1 className="text-xl font-black leading-none">VallaAuto</h1><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Intelligence</p></div>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊' }, { id: 'Landing Pages', icon: '📄' }, 
            { id: 'ROI & Leads', icon: '📈' }, { id: 'Alertas IA', icon: '🔔' }, { id: 'Campañas', icon: '🎯' }
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === t.id ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <span>{t.icon}</span> {t.id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight italic uppercase">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Filtros activos: {region} / {type}</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7]">LIVE DATA</div>
        </header>

        {/* MÉTRICAS CABECERA (image_0e9389.png) */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Resultados</p>
            <p className="text-5xl font-black text-[#4F46E5]">{stats.count}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Tendencia</p>
            <p className="text-5xl font-black text-[#10B981]">+{stats.trend}%</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Leads Est.</p>
            <p className="text-5xl font-black text-[#F43F5E]">{stats.leads}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Oportunidades</p>
            <p className="text-5xl font-black text-[#F59E0B]">{stats.opts}</p>
          </div>
        </div>

        {/* CONTENIDO SEGÚN PESTAÑA */}
        {activeTab === 'Dashboard' || activeTab === 'Campañas' ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic">Ranking de Tendencias</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(c => (
                  <button key={c} onClick={() => setCategory(c as any)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${category === c ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400'}`}>
                    {c === 'Coches' ? '🚗 Coches' : c === 'Motos' ? '🏍️ Motos' : 'Ver Todos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl font-black text-xs uppercase cursor-pointer">
                <option value="Toda España">📍 Toda España</option>
                <option value="Valladolid">📍 Valladolid</option>
                <option value="Castilla y León">📍 Castilla y León</option>
                <option value="España">📍 España</option>
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl font-black text-xs uppercase cursor-pointer">
                <option value="Todos los tipos">🔍 Todos los tipos</option>
                <option value="Compra">Compra</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Precios">Precios</option>
                <option value="Renting">Renting</option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
                <tr><th className="pb-4">Keyword</th><th className="pb-4 text-center">Intención</th><th className="pb-4 text-center">Volumen</th><th className="pb-4 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 font-bold text-sm italic">{kw.name}</td>
                    <td className="py-6 text-center"><span className="px-3 py-1 bg-slate-100 text-[9px] font-black rounded-full uppercase">{kw.type}</span></td>
                    <td className="py-6 text-center font-black text-slate-400">{kw.volume}</td>
                    <td className="py-6 text-right font-black text-[#10B981]">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'Landing Pages' ? (
          <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 italic shadow-sm">
            <h3 className="text-slate-300 font-black text-2xl uppercase tracking-widest">Sincronizado con Google Search Console...</h3>
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-50 font-black text-slate-200 italic text-3xl">SECCIÓN EN DESARROLLO...</div>
        )}
      </main>
    </div>
  );
}
