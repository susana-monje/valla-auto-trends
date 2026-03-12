import React, { useState, useEffect } from 'react';

interface Keyword {
  id: string;
  name: string;
  volume: number;
  trend: number; // Ahora es número para poder sumar
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

  const allData: Keyword[] = [
    { id: "1", name: "COCHES ELÉCTRICOS VALLADOLID", volume: 1200, trend: 18, potential: 92, region: "Valladolid", type: "Compra", category: "Coches" },
    { id: "2", name: "MOTOS OCASIÓN LEÓN", volume: 850, trend: 12, potential: 85, region: "Castilla y León", type: "Compra", category: "Motos" },
    { id: "3", name: "CONCESIONARIO OFICIAL OMODA VALLADOLID", volume: 2400, trend: 150, potential: 98, region: "Valladolid", type: "Compra", category: "Coches" },
    { id: "4", name: "MEJORES SUV HÍBRIDOS ESPAÑA", volume: 15000, trend: 25, potential: 94, region: "España", type: "Comparativas", category: "Coches" },
    { id: "5", name: "RENTING PARTICULARES VALLADOLID", volume: 950, trend: 8, potential: 88, region: "Valladolid", type: "Renting", category: "Coches" },
    { id: "6", name: "ALQUILER FURGONETAS VALLADOLID", volume: 1800, trend: 45, potential: 90, region: "Valladolid", type: "Alquiler", category: "Coches" },
    { id: "7", name: "ALQUILER MOTOS MADRID", volume: 2100, trend: 30, potential: 82, region: "España", type: "Alquiler", category: "Motos" },
  ];

  useEffect(() => {
    let filtered = allData;
    if (selectedRegion !== 'Toda España' && selectedRegion !== 'España') {
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
    else setSelectedKeyword(null);
  }, [selectedRegion, selectedType, selectedCategory]);

  // --- CÁLCULOS DINÁMICOS PARA LA CABECERA ---
  const totalKeywords = keywords.length;
  const avgTrend = keywords.length > 0 
    ? Math.round(keywords.reduce((acc, k) => acc + k.trend, 0) / keywords.length) 
    : 0;
  const totalLeads = keywords.reduce((acc, k) => acc + Math.floor(k.volume * 0.05), 0);
  const opportunities = keywords.filter(k => k.potential > 90).length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl italic shadow-indigo-200 shadow-lg">V</div>
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Intelligence</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landing Pages', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI & Leads', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas IA', icon: '🔔', label: 'Alertas IA' },
            { id: 'Campañas', icon: '🎯', label: 'Campañas' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight italic">
              {activeTab === 'Dashboard' ? `Mercado: ${selectedRegion}` : activeTab}
            </h2>
            <p className="text-slate-400 font-medium italic mt-1 uppercase text-[10px] tracking-widest">Sincronización Regional Activa</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#DCFCE7]">
            Live Data Connect
          </div>
        </header>

        {/* --- MÉTRICAS DINÁMICAS (¡AQUÍ ESTÁ EL CAMBIO!) --- */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Keywords Activas</p>
            <p className="text-5xl font-black text-[#4F46E5] tracking-tighter animate-in fade-in duration-300">{totalKeywords}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Tendencia Media</p>
            <p className="text-5xl font-black text-[#10B981] tracking-tighter">+{avgTrend}%</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Leads Proyectados</p>
            <p className="text-5xl font-black text-[#F43F5E] tracking-tighter">{totalLeads}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Oportunidades SEO</p>
            <p className="text-5xl font-black text-[#F59E0B] tracking-tighter">{opportunities}</p>
          </div>
        </div>

        {/* DASHBOARD CON FILTROS */}
        {activeTab === 'Dashboard' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-8">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic">Ranking de Tendencias</h3>
              <div className="flex bg-[#F1F5F9] p-1.5 rounded-2xl">
                {['Todos', 'Coches', 'Motos'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedCategory === cat ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-xl font-bold text-sm outline-none">
                <option value="Toda España">Toda España</option>
                <option value="Valladolid">Valladolid</option>
                <option value="Castilla y León">Castilla y León</option>
                <option value="España">España</option>
              </select>

              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-xl font-bold text-sm outline-none">
                <option value="Todos los tipos">Todos los tipos</option>
                <option value="Compra">Compra</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Renting">Renting</option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-b border-slate-50">
                <tr>
                  <th className="pb-4">Keyword</th>
                  <th className="pb-4 text-center">Búsquedas</th>
                  <th className="pb-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {keywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 font-bold text-sm uppercase italic tracking-tighter">{kw.name}</td>
                    <td className="py-6 text-center font-black text-slate-400">{kw.volume}</td>
                    <td className="py-6 text-right font-black text-[#10B981]">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
