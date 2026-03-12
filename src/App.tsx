import React, { useState, useEffect } from 'react';

// 1. BASE DE DATOS EXACTA DE TUS CAPTURAS
const DATA_MASTER = [
  { id: 1, name: "OMODA 5 VALLADOLID", volume: 3200, trend: 185, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 2, name: "JAECOO 7 PRECIO ESPAÑA", volume: 2400, trend: 210, type: "Precios", region: "España", category: "Coches" },
  { id: 3, name: "COCHES OCASION VALLADOLID PARTICULARES", volume: 5400, trend: 12, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 4, name: "CONCESIONARIO OMODA VALLADOLID", volume: 1900, trend: 320, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 5, name: "COCHES SEGUNDA MANO VALLADOLID BARATOS", volume: 4200, trend: 8, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 6, name: "RENTING PARTICULARES VALLADOLID", volume: 1100, trend: 28, type: "Renting", region: "Valladolid", category: "Coches" },
  { id: 7, name: "COMPRAR COCHE HIBRIDO VALLADOLID", volume: 1300, trend: 45, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 8, name: "OFERTAS KM 0 VALLADOLID", volume: 2100, trend: 15, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 9, name: "SUV SEGUNDA MANO VALLADOLID", volume: 1800, trend: 22, type: "Compra", region: "Valladolid", category: "Coches" },
  { id: 10, name: "ALQUILER FURGONETAS VALLADOLID", volume: 1800, trend: 45, type: "Alquiler", region: "Valladolid", category: "Coches" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [region, setRegion] = useState('Valladolid');
  const [type, setType] = useState('Todos los tipos');
  const [category, setCategory] = useState('Todos');
  const [filteredData, setFilteredData] = useState(DATA_MASTER);

  // Lógica de filtrado que SÍ funciona
  useEffect(() => {
    let result = DATA_MASTER.filter(k => {
      const matchRegion = region === 'Toda España' || region === 'España' || k.region === region;
      const matchType = type === 'Todos los tipos' || k.type === type;
      const matchCat = category === 'Todos' || k.category === category;
      return matchRegion && matchType && matchCat;
    });
    setFilteredData(result);
  }, [region, type, category]);

  // Métricas calculadas dinámicamente según el filtro
  const metrics = {
    results: filteredData.length,
    trend: filteredData.length > 0 ? `+${Math.max(...filteredData.map(k => k.trend))}%` : '0%',
    leads: filteredData.reduce((acc, k) => acc + Math.floor(k.volume * 0.04), 0),
    opts: filteredData.filter(k => k.trend > 100).length
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR - Captura image_0e8121.png */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100 italic">V</div>
          <h1 className="text-xl font-black text-[#0F172A]">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊' },
            { id: 'Landings', icon: '📄' },
            { id: 'ROI & Leads', icon: '📈' },
            { id: 'Alertas', icon: '🔔' },
            { id: 'Campañas', icon: '🎯' }
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
            <p className="text-slate-400 font-medium italic">Filtros activos: {region} / {type}</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] tracking-widest">LIVE DATA</div>
        </header>

        {/* MÉTRICAS CABECERA - Captura image_0eed9c.png */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'RESULTADOS', val: metrics.results, color: 'text-[#4F46E5]' },
            { label: 'TENDENCIA MAX', val: metrics.trend, color: 'text-[#10B981]' },
            { label: 'LEADS EST.', val: metrics.leads, color: 'text-[#F43F5E]' },
            { label: 'OPORTUNIDADES', val: metrics.opts, color: 'text-[#F59E0B]' }
          ].map((m, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">{m.label}</p>
              <p className={`text-5xl font-black ${m.color} tracking-tighter`}>{m.val}</p>
            </div>
          ))}
        </div>

        {/* CONTENIDO PRINCIPAL - Captura image_0e7903.png y image_0e7cff.png */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Ranking de Búsqueda Real</h3>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {['Todos', 'Coches', 'Motos'].map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${category === c ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400'}`}>
                   {c === 'Coches' ? '🚗 Coches' : c === 'Motos' ? '🏍️ Motos' : 'Ver Todos'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-10">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl font-black text-xs uppercase cursor-pointer">
              <option value="Toda España">📍 Toda España</option>
              <option value="Valladolid">📍 Valladolid</option>
              <option value="Castilla y León">📍 Castilla y León</option>
              <option value="España">📍 España</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl font-black text-xs uppercase cursor-pointer">
              <option value="Todos los tipos">🔍 Todos los tipos</option>
              <option value="Compra">Compra</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Precios">Precios</option>
              <option value="Renting">Renting</option>
            </select>
          </div>

          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="pb-6">PALABRA CLAVE</th>
                <th className="pb-6 text-center">BÚSQUEDAS/MES</th>
                <th className="pb-6 text-right">CRECIMIENTO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold italic">
              {filteredData.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50 transition-all group">
                  <td className="py-6 text-sm uppercase tracking-tighter text-slate-700">{kw.name}</td>
                  <td className="py-6 text-center text-slate-400 font-black text-lg">{kw.volume}</td>
                  <td className="py-6 text-right text-[#10B981] font-black text-lg">+{kw.trend}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="py-20 text-center text-slate-200 font-black text-2xl italic uppercase">Sin datos para este filtro</div>
          )}
        </div>
      </main>
    </div>
  );
}
