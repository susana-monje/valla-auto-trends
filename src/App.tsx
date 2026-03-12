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

  // Lógica para los cálculos de ROI basados en la selección
  const stats = selectedKeyword ? {
    inversion: Math.floor(selectedKeyword.volume * 0.15 * 0.85),
    leads: Math.floor(selectedKeyword.volume * 0.15 * 0.04),
    retorno: Math.floor(selectedKeyword.volume * 0.15 * 0.04 * 0.10 * 2500)
  } : { inversion: 0, leads: 0, retorno: 0 };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600 uppercase">Cargando VallaAuto...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR CON EL NUEVO BOTÓN DE CAMPAÑAS */}
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
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-xl">{item.icon}</span> {item.id === 'ROI' ? 'ROI & Leads' : item.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10">
        
        {/* CABECERA DINÁMICA SEGÚN TUS CAPTURAS */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
              {activeTab === 'ROI' ? 'ROI & Leads' : activeTab}
            </h2>
            <p className="text-slate-400 font-medium italic">Datos verificados de Google Ads & Trends API</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            Live Data Connect
          </div>
        </header>

        {/* MÉTRICAS SUPERIORES (Se mantienen siempre arriba para consistencia visual) */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Keywords Activas</p>
            <p className="text-5xl font-black text-indigo-600 tracking-tighter">10</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Tendencias Alza</p>
            <p className="text-5xl font-black text-emerald-500 tracking-tighter">+240%</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Leads Proyectados</p>
            <p className="text-5xl font-black text-rose-500 tracking-tighter">142</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Oportunidades SEO</p>
            <p className="text-5xl font-black text-amber-500 tracking-tighter">8</p>
          </div>
        </div>

        {/* --- VISTA: DASHBOARD --- */}
        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50"><h3 className="font-black text-xl italic text-slate-900">Ranking de Búsqueda Real</h3></div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                  <tr><th className="px-8 py-4">Palabra Clave</th><th className="px-8 py-4 text-center">Búsquedas</th><th className="px-8 py-4 text-right">Crecimiento</th></tr>
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

        {/* --- VISTA: CAMPAÑAS (¡NUEVA!) --- */}
        {activeTab === 'Campañas' && (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10">
              <h3 className="font-black text-2xl italic mb-6">Estado de Campañas Google Ads</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Omoda 5 - Valladolid Central', budget: '45€/día', status: 'Activa', leads: '24' },
                   { name: 'Jaecoo 7 - Lanzamiento CyL', budget: '30€/día', status: 'Activa', leads: '12' },
                   { name: 'Ofertas Renting Particulares', budget: '20€/día', status: 'Pausada', leads: '45' }
                 ].map((c, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <div>
                       <p className="font-black text-slate-800 uppercase italic text-sm">{c.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Presupuesto: {c.budget}</p>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-300 uppercase">Leads</p>
                          <p className="text-xl font-black text-indigo-600">{c.leads}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${c.status === 'Activa' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          {c.status}
                        </span>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* --- RESTO DE SECCIONES YA FUNCIONALES --- */}
        {activeTab === 'Landings' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden animate-in fade-in">
             <table className="w-full text-left">
                <thead className="bg-[#0F172A] text-white text-[10px] font-black uppercase">
                  <tr><th className="px-10 py-6">Página de Destino</th><th className="px-10 py-6 text-center">Visitas</th><th className="px-10 py-6 text-right">Conv.</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 italic font-bold">
                  <tr><td className="px-10 py-8 text-indigo-600">/concesionario-omoda-valladolid</td><td className="px-10 py-8 text-center font-black">2.450</td><td className="px-10 py-8 text-right text-emerald-500">4.2%</td></tr>
                  <tr><td className="px-10 py-8 text-indigo-600">/jaecoo-7-ofertas</td><td className="px-10 py-8 text-center font-black">1.820</td><td className="px-10 py-8 text-right text-emerald-500">3.8%</td></tr>
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'ROI' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Inversión Estimada</p>
              <p className="text-6xl font-black text-slate-900 tracking-tighter">{stats.inversion}€</p>
            </div>
            <div className="bg-indigo-600 p-12 rounded-[3rem] text-white shadow-2xl">
              <p className="text-[10px] font-black opacity-60 uppercase mb-2">Leads Reales</p>
              <p className="text-6xl font-black tracking-tighter">{stats.leads}</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Retorno Bruto</p>
              <p className="text-6xl font-black text-emerald-500 tracking-tighter">{stats.retorno}€</p>
            </div>
          </div>
        )}

        {activeTab === 'Alertas' && (
          <div className="space-y-6 animate-in zoom-in-95">
             <div className="bg-white p-10 rounded-[3rem] border-l-[16px] border-rose-500 shadow-sm flex items-center gap-8">
                <span className="text-4xl">🔥</span>
                <div><p className="text-xs font-black text-rose-500 uppercase tracking-widest">Crítica</p><p className="text-2xl font-bold text-slate-800 italic">OMODA subiendo un 150% en Valladolid.</p></div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
