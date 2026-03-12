import React, { useState, useEffect } from 'react';

interface Keyword {
  id: string;
  name: string;
  volume: number;
  trend: string;
  potential: number;
  region: string;
  type: string; 
  category: 'Coches' | 'Motos';
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedRegion, setSelectedRegion] = useState('Valladolid');
  const [selectedType, setSelectedType] = useState('Todos los tipos');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Coches' | 'Motos'>('Todos');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // Base de datos integrada con Alquiler y todas las regiones
  const allData: Keyword[] = [
    { id: "1", name: "omoda 5 valladolid", volume: 2400, trend: "+150%", potential: 98, region: "Valladolid", type: "Compra", category: "Coches" },
    { id: "2", name: "alquiler furgonetas valladolid", volume: 1800, trend: "+45%", potential: 90, region: "Valladolid", type: "Alquiler", category: "Coches" },
    { id: "3", name: "renting jaecoo leon", volume: 1100, trend: "+80%", potential: 92, region: "Castilla y León", type: "Renting", category: "Coches" },
    { id: "4", name: "alquiler motos salamanca", volume: 500, trend: "+20%", potential: 85, region: "Castilla y León", type: "Alquiler", category: "Motos" },
    { id: "5", name: "precios motos burgos", volume: 850, trend: "+12%", potential: 85, region: "Castilla y León", type: "Precios", category: "Motos" },
    { id: "6", name: "mejores suv españa", volume: 15000, trend: "+25%", potential: 94, region: "España", type: "Comparativas", category: "Coches" },
    { id: "7", name: "alquiler coches lujo españa", volume: 3200, trend: "+60%", potential: 96, region: "España", type: "Alquiler", category: "Coches" },
  ];

  useEffect(() => {
    let filtered = allData;
    if (selectedRegion !== 'España') filtered = filtered.filter(k => k.region === selectedRegion);
    if (selectedType !== 'Todos los tipos') filtered = filtered.filter(k => k.type === selectedType);
    if (selectedCategory !== 'Todos') filtered = filtered.filter(k => k.category === selectedCategory);
    
    setKeywords(filtered);
    if (filtered.length > 0) setSelectedKeyword(filtered[0]);
    else setSelectedKeyword(null);
  }, [selectedRegion, selectedType, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl italic shadow-lg">V</div>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Intelligence</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊' },
            { id: 'Landings', icon: '📄' },
            { id: 'ROI', icon: '📈' },
            { id: 'Alertas', icon: '🔔' },
            { id: 'Campañas', icon: '🎯' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
               <span className="text-lg">{item.icon}</span> {item.id === 'ROI' ? 'ROI & Leads' : item.id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Filtros activos: {selectedRegion} / {selectedType}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Live Data
          </div>
        </header>

        {/* MÉTRICAS SUPERIORES */}
        <div className="grid grid-cols-4 gap-6 mb-10 text-center">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Resultados</p>
            <p className="text-5xl font-black text-indigo-600 tracking-tighter">{keywords.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Tendencia</p>
            <p className="text-5xl font-black text-emerald-500 tracking-tighter">+240%</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Leads Est.</p>
            <p className="text-5xl font-black text-rose-500 tracking-tighter">142</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Oportunidades</p>
            <p className="text-5xl font-black text-amber-500 tracking-tighter">8</p>
          </div>
        </div>

        {/* --- PANEL DE CONTROL DE FILTROS --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic tracking-tight text-slate-900">Ranking de Tendencias</h3>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {cat === 'Coches' ? '🚗 Coches' : cat === 'Motos' ? '🏍️ Motos' : 'Ver Todos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {/* UBICACIÓN */}
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400">📍</span>
                <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-transparent font-black text-xs text-slate-600 outline-none uppercase tracking-widest">
                  <option value="España">Toda España</option>
                  <option value="Castilla y León">Castilla y León</option>
                  <option value="Valladolid">Valladolid</option>
                </select>
              </div>

              {/* TIPO (INCLUYENDO ALQUILER) */}
              <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400">🔍</span>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-transparent font-black text-xs text-slate-600 outline-none uppercase tracking-widest">
                  <option value="Todos los tipos">Todos los tipos</option>
                  <option value="Compra">Compra</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Precios">Precios</option>
                  <option value="Financiación">Financiación</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Renting">Renting</option>
                  <option value="Comparativas">Comparativas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
                <tr>
                  <th className="pb-4">Keyword</th>
                  <th className="pb-4 text-center">Intención</th>
                  <th className="pb-4 text-center">Volumen</th>
                  <th className="pb-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {keywords.map((kw) => (
                  <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer group transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-6 font-bold text-slate-700 text-sm uppercase italic tracking-tighter">{kw.name}</td>
                    <td className="py-6 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{kw.type}</span>
                    </td>
                    <td className="py-6 text-center font-black text-slate-400">{kw.volume}</td>
                    <td className="py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {keywords.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-300 font-black text-xl italic uppercase">Sin resultados en {selectedRegion} para {selectedType}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
