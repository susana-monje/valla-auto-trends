import React, { useState, useEffect } from 'react';

interface Keyword {
  id: string;
  name: string;
  volume: number;
  trend: string;
  potential: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/metadata.json')
      .then(res => res.json())
      .then(data => {
        setKeywords(data);
        if (data.length > 0) setSelectedKeyword(data[0]);
        setLoading(false);
      })
      .catch(() => {
        const backup = [
          { id: "1", name: "concesionario omoda valladolid", volume: 2400, trend: "+150%", potential: 98 },
          { id: "2", name: "coches ocasion valladolid", volume: 5100, trend: "+12%", potential: 85 },
          { id: "3", name: "jaecoo 7 precio", volume: 1800, trend: "+200%", potential: 95 }
        ];
        setKeywords(backup);
        setSelectedKeyword(backup[0]);
        setLoading(false);
      });
  }, []);

  // Lógica para los cálculos de ROI
  const stats = selectedKeyword ? {
    inversion: Math.floor(selectedKeyword.volume * 0.15 * 0.85),
    leads: Math.floor(selectedKeyword.volume * 0.15 * 0.04),
    retorno: Math.floor(selectedKeyword.volume * 0.15 * 0.04 * 0.10 * 2500)
  } : { inversion: 0, leads: 0, retorno: 0 };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600 uppercase">Cargando VallaAuto...</div>;

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
            { id: 'Alertas', icon: '🔔' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span> {item.id === 'ROI' ? 'ROI & Leads' : item.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
              {activeTab === 'ROI' ? 'ROI & Leads' : activeTab}
            </h2>
            <p className="text-slate-400 font-medium italic">Inteligencia de mercado en tiempo real</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            Sistema Conectado
          </div>
        </header>

        {/* --- VISTA: DASHBOARD --- */}
        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50"><h3 className="font-black text-xl italic text-slate-900">Ranking de Búsqueda</h3></div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                  <tr><th className="px-8 py-4">Keyword</th><th className="px-8 py-4 text-center">Búsquedas</th><th className="px-8 py-4 text-right">Crecimiento</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {keywords.map((kw) => (
                    <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                      <td className="px-8 py-6 font-bold text-slate-700 text-xs uppercase italic tracking-tighter">{kw.name}</td>
                      <td className="px-8 py-6 text-center font-black text-slate-400">{kw.volume}</td>
                      <td className="px-8 py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
                <h3 className="font-black text-lg text-slate-900 mb-6 italic">Potencial IA</h3>
                <div className="bg-indigo-50/50 py-10 rounded-3xl">
                  <p className="text-7xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VISTA: LANDINGS --- */}
        {activeTab === 'Landings' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-[10px] font-black uppercase">
                <tr><th className="px-10 py-6">URL de la Landing</th><th className="px-10 py-6 text-center">Visitas</th><th className="px-10 py-6 text-right">Leads</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50"><td className="px-10 py-8 font-bold text-indigo-600 italic">/concesionario-omoda-valladolid</td><td className="px-10 py-8 text-center font-black">2.450</td><td className="px-10 py-8 text-right font-black">102</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-10 py-8 font-bold text-indigo-600 italic">/jaecoo-7-ofertas</td><td className="px-10 py-8 text-center font-black">1.820</td><td className="px-10 py-8 text-right font-black">74</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA: ROI --- */}
        {activeTab === 'ROI' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Coste Ads</p>
              <p className="text-5xl font-black">{stats.inversion}€</p>
            </div>
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-xl">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Leads</p>
              <p className="text-5xl font-black">{stats.leads}</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Retorno Est.</p>
              <p className="text-5xl font-black text-emerald-500">{stats.retorno}€</p>
            </div>
          </div>
        )}

        {/* --- VISTA: ALERTAS --- */}
        {activeTab === 'Alertas' && (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-rose-500 shadow-sm flex items-center gap-6">
              <div className="text-3xl">🚨</div>
              <div><p className="text-[10px] font-black text-rose-500 uppercase">Prioridad Alta</p><p className="font-bold text-slate-800 italic">Subida repentina en búsquedas "Omoda" en Valladolid.</p></div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border-l-[12px] border-indigo-500 shadow-sm flex items-center gap-6">
              <div className="text-3xl">✨</div>
              <div><p className="text-[10px] font-black text-indigo-500 uppercase">Oportunidad</p><p className="font-bold text-slate-800 italic">CPC un 20% más bajo hoy para "Coches de ocasión".</p></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
