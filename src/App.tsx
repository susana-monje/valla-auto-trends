import React, { useState, useEffect } from 'react';

// ==========================================
// 1. TU ENLACE DE GOOGLE SHEETS (CSV)
// ==========================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?output=csv";

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros (image_0e8be7.png)
  const [filterRegion, setFilterRegion] = useState('Valladolid');
  const [filterType, setFilterType] = useState('Todos los tipos');
  const [filterCategory, setFilterCategory] = useState('Todos');

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          const val = values[i]?.trim();
          obj[h] = isNaN(Number(val)) ? val : Number(val);
        });
        return obj;
      }).filter(item => item.name);

      setData(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Error cargando datos");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // LÓGICA DE FILTRADO REAL
  const filteredData = data.filter(item => {
    const matchRegion = filterRegion === 'Toda España' || item.region === filterRegion;
    const matchType = filterType === 'Todos los tipos' || item.type === filterType;
    const matchCat = filterCategory === 'Todos' || item.category === filterCategory;
    return matchRegion && matchType && matchCat;
  });

  const stats = {
    keywords: filteredData.length,
    trend: filteredData.length > 0 ? Math.max(...filteredData.map(d => d.trend || 0)) : 0,
    leads: filteredData.reduce((acc, c) => acc + (c.leads || 0), 0),
    alertas: filteredData.filter(d => d.trend > 100).length
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white font-black italic text-[#4F46E5] animate-pulse uppercase tracking-widest">
      Sincronizando VallaAuto Intelligence...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR (image_0e8121.png) */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg italic">V</div>
          <h1 className="text-xl font-black italic">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {['Dashboard', 'Landings', 'ROI & Leads', 'Alertas'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Análisis en tiempo real: {filterRegion}</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] tracking-widest uppercase">Live Data Connect</div>
        </header>

        {/* MÉTRICAS (image_049343.png) */}
        <div className="grid grid-cols-4 gap-6 mb-10 text-center">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Keywords</p><p className="text-5xl font-black text-[#4F46E5]">{stats.keywords}</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Trend Max</p><p className="text-5xl font-black text-[#10B981]">+{stats.trend}%</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Leads Totales</p><p className="text-5xl font-black text-[#F43F5E]">{stats.leads}</p></div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm"><p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Alertas</p><p className="text-5xl font-black text-[#F59E0B]">{stats.alertas}</p></div>
        </div>

        {/* CONTENIDO PRINCIPAL SEGÚN TAB */}
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
            {/* FILTROS DE CATEGORÍA (image_0e7cff.png) */}
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Ranking de Búsqueda</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(c => (
                  <button key={c} onClick={() => setFilterCategory(c)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filterCategory === c ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400'}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* SELECTORES (image_0e8be7.png) */}
            <div className="flex gap-4 mb-10">
              <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-black text-xs uppercase cursor-pointer outline-none">
                <option value="Valladolid">📍 Valladolid</option>
                <option value="Toda España">📍 Toda España</option>
                <option value="Castilla y León">📍 Castilla y León</option>
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-black text-xs uppercase cursor-pointer outline-none">
                <option value="Todos los tipos">🔍 Todos los tipos</option>
                <option value="Compra">Compra</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Renting">Renting</option>
              </select>
            </div>

            <table className="w-full text-left font-bold italic">
              <thead className="text-[10px] text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <tr><th className="pb-6">Palabra Clave</th><th className="pb-6 text-center">Búsquedas</th><th className="pb-6 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 text-sm uppercase tracking-tighter text-slate-700">{kw.name}</td>
                    <td className="py-6 text-center text-slate-400 font-black text-lg">{kw.volume}</td>
                    <td className="py-6 text-right text-[#10B981] font-black text-lg">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ROI & LEADS (image_049303.png) */}
        {activeTab === 'ROI & Leads' && (
          <div className="grid grid-cols-3 gap-8 animate-in zoom-in">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black">306€</p><p className="text-[10px] font-black text-slate-300 uppercase mt-4">Inversión Estimada</p>
            </div>
            <div className="bg-[#4F46E5] p-12 rounded-[3rem] text-white shadow-xl text-center">
              <p className="text-5xl font-black">{stats.leads}</p><p className="text-[10px] font-black opacity-60 uppercase mt-4">Leads Reales</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black text-[#10B981]">3.600€</p><p className="text-[10px] font-black text-slate-300 uppercase mt-4">Retorno Bruto</p>
            </div>
          </div>
        )}

        {/* ALERTAS (image_049058.png) */}
        {activeTab === 'Alertas' && (
          <div className="bg-white p-10 rounded-[3rem] border-l-[12px] border-rose-500 shadow-sm flex items-center gap-6 animate-in slide-in-from-left">
            <span className="text-4xl animate-bounce">🔥</span>
            <div>
              <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest text-left">Alerta Crítica</p>
              <p className="font-bold italic text-xl">Detección de tendencias alza {filterRegion}. ¡Actuar ahora!</p>
            </div>
          </div>
        )}

        {/* LANDINGS (image_0ef1f9.png) */}
        {activeTab === 'Landings' && (
           <div className="bg-white p-32 rounded-[3rem] border border-slate-50 shadow-sm text-center italic">
              <p className="text-slate-300 font-black text-xl uppercase tracking-[0.2em]">Escaneando URLs de Search Console...</p>
           </div>
        )}
      </main>
    </div>
  );
}
