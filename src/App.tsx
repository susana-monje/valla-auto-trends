import React, { useState, useEffect } from 'react';

interface Keyword {
  id: string;
  name: string;
  volume: number;
  trend: string;
  potential: number;
  region: string;
  type: string; // Compra, Precios, Renting, etc.
  category: 'Coches' | 'Motos';
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedRegion, setSelectedRegion] = useState('Valladolid');
  const [selectedType, setSelectedType] = useState('Todos los tipos');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Coches' | 'Motos'>('Todos');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // Base de datos extendida con tus filtros
  const allData: Keyword[] = [
    { id: "1", name: "omoda 5 valladolid", volume: 2400, trend: "+150%", potential: 98, region: "Valladolid", type: "Compra", category: "Coches" },
    { id: "2", name: "renting jaecoo leon", volume: 1100, trend: "+80%", potential: 92, region: "Castilla y León", type: "Renting", category: "Coches" },
    { id: "3", name: "precios motos burgos", volume: 850, trend: "+12%", potential: 85, region: "Castilla y León", type: "Precios", category: "Motos" },
    { id: "4", name: "mejores suv españa", volume: 15000, trend: "+25%", potential: 94, region: "España", type: "Comparativas", category: "Coches" },
    { id: "5", name: "mantenimiento coche oficial", volume: 600, trend: "+5%", potential: 70, region: "Valladolid", type: "Mantenimiento", category: "Coches" },
    { id: "6", name: "financiacion moto cyl", volume: 450, trend: "+110%", potential: 88, region: "Castilla y León", type: "Financiación", category: "Motos" },
  ];

  // Lógica de filtrado combinada (Ubicación + Tipo + Categoría)
  useEffect(() => {
    let filtered = allData;

    if (selectedRegion !== 'España' && selectedRegion !== 'Toda España') {
      filtered = filtered.filter(k => k.region === selectedRegion);
    }
    if (selectedType !== 'Todos los tipos') {
      filtered = filtered.filter(k => k.type === selectedType);
    }
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(k => k.category === selectedCategory);
    }

    setKeywords(filtered);
    if (filtered.length > 0) setSelectedKeyword(filtered[0]);
  }, [selectedRegion, selectedType, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR ORIGINAL */}
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
          {['Dashboard', 'Landings', 'ROI', 'Alertas', 'Campañas'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
               <span>{id === 'Dashboard' ? '📊' : id === 'Landings' ? '📄' : id === 'ROI' ? '📈' : id === 'Campañas' ? '🎯' : '🔔'}</span> {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-end">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Análisis Real de {selectedRegion}</h2>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Data Connect</div>
        </header>

        {/* METRICAS SUPERIORES */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Keywords Activas</p>
            <p className="text-5xl font-black text-indigo-600">{keywords.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Tendencias Alza</p>
            <p className="text-5xl font-black text-emerald-500">+240%</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Leads Proyectados</p>
            <p className="text-5xl font-black text-rose-500">142</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Oportunidades</p>
            <p className="text-5xl font-black text-amber-500">8</p>
          </div>
        </div>

        {/* --- SECCIÓN DE FILTROS (COMO EN TU CAPTURA) --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm mb-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic">Ranking de Tendencias</h3>
              {/* Filtro Categoría: Coches / Motos */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                    {cat === 'Coches' ? '🚗 Coches' : cat === 'Motos' ? '🏍️ Motos' : 'Todos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {/* Filtro Ubicación */}
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-lg">📍</span>
                <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer">
                  <option value="España">Toda España</option>
                  <option value="Castilla y León">Castilla y León</option>
                  <option value="Valladolid">Valladolid</option>
                </select>
              </div>

              {/* Filtro Intención */}
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-lg">🔍</span>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer">
                  <option value="Todos los tipos">Todos los tipos</option>
                  <option value="Compra">Compra</option>
                  <option value="Precios">Precios</option>
                  <option value="Financiación">Financiación</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Renting">Renting</option>
                  <option value="Seguros">Seguros</option>
                  <option value="Comparativas">Comparativas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
                <tr>
                  <th className="pb-4">Palabra Clave</th>
                  <th className="pb-4">Ubicación</th>
                  <th className="pb-4 text-center">Volumen</th>
                  <th className="pb-4 text-right">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {keywords.map((kw) => (
                  <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer group transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="py-6 font-bold text-slate-700 text-sm uppercase italic tracking-tighter">{kw.name}</td>
                    <td className="py-6 text-xs font-black text-indigo-300 uppercase">{kw.region}</td>
                    <td className="py-6 text-center font-black text-slate-400">{kw.volume}</td>
                    <td className="py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {keywords.length === 0 && <p className="p-10 text-center font-bold text-slate-300 italic">No hay resultados para esta combinación de filtros.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
