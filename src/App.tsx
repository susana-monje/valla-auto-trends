import React, { useState, useEffect } from 'react';

// Tipado para consistencia de datos
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

  // Carga de datos desde metadata.json
  useEffect(() => {
    fetch('/metadata.json')
      .then(res => res.json())
      .then(data => {
        setKeywords(data);
        if (data.length > 0) setSelectedKeyword(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- LÓGICA DE CÁLCULO ROI ---
  const stats = selectedKeyword ? {
    inversion: Math.floor(selectedKeyword.volume * 0.15 * 0.85), // 15% CTR, 0.85€ CPC
    leads: Math.floor(selectedKeyword.volume * 0.15 * 0.04),    // 4% Conv.
    ventas: Math.max(1, Math.floor(selectedKeyword.volume * 0.15 * 0.04 * 0.10)), // 10% Cierre
    ingresos: Math.max(1, Math.floor(selectedKeyword.volume * 0.15 * 0.04 * 0.10)) * 2200 // 2200€ margen
  } : { inversion: 0, leads: 0, ventas: 0, ingresos: 0 };

  const roiNeto = stats.inversion > 0 ? (((stats.ingresos - stats.inversion) / stats.inversion) * 100).toFixed(0) : 0;

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600 animate-pulse text-2xl">CARGANDO INTELIGENCIA DE MERCADO...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR FIJA */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100 italic">V</div>
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Intelligence</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas IA' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-x-2' : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'}`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-8 mt-auto border-t border-slate-50">
          <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sistema Activo: Valladolid</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        
        {/* VISTA: DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Dashboard de Mercado</h2>
              <p className="text-slate-500 font-medium text-lg italic mt-2">Análisis en tiempo real de tendencias locales en Valladolid</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[11px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                    <tr><th className="px-10 py-6">Keyword</th><th className="px-10 py-6 text-center">Búsquedas</th><th className="px-10 py-6 text-right">Tendencia</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {keywords.map((kw) => (
                      <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer hover:bg-indigo-50/40 transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}>
                        <td className="px-10 py-7 font-bold text-slate-800 text-sm uppercase italic tracking-tighter">{kw.name}</td>
                        <td className="px-10 py-7 text-center font-black text-slate-500 text-lg">{kw.volume}</td>
                        <td className="px-10 py-7 text-right font-black text-emerald-500 text-lg">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                  <h3 className="font-black text-2xl text-slate-900 mb-8 italic">Potencial IA</h3>
                  <div className="bg-indigo-50 py-12 rounded-[2.5rem] relative overflow-hidden">
                    <p className="text-8xl font-black text-indigo-600 tracking-tighter relative z-10">{selectedKeyword?.potential}%</p>
                    <div className="absolute inset-0 bg-indigo-100/50 scale-x-50 origin-left transition-transform duration-1000" style={{ transform: `scaleX(${selectedKeyword?.potential || 0 / 100})` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: LANDINGS (¡FUNCIONANDO!) */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black italic tracking-tight">Rendimiento de Páginas</h2>
              <p className="text-slate-500 font-medium italic mt-2">Métricas de conversión por URL específica en Valladolid</p>
            </header>
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest">
                  <tr><th className="px-12 py-7">Ruta de Destino</th><th className="px-12 py-7 text-center">Visitas</th><th className="px-12 py-7 text-center">Leads</th><th className="px-12 py-7 text-right">Ratio Conv.</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { url: "/concesionario-omoda-valladolid", v: "3.120", l: "124", c: "3.9%" },
                    { url: "/ofertas-jaecoo-7-cyl", v: "2.450", l: "98", c: "4.0%" },
                    { url: "/coches-ocasion-baratos", v: "5.890", l: "112", c: "1.9%" },
                    { url: "/taller-especializado-vll", v: "980", l: "82", c: "8.3%" }
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-12 py-8 font-bold text-indigo-600 italic text-lg">{item.url}</td>
                      <td className="px-12 py-8 text-center font-black text-slate-700 text-lg">{item.v}</td>
                      <td className="px-12 py-8 text-center font-black text-slate-900 text-lg">{item.l}</td>
                      <td className="px-12 py-8 text-right font-black text-emerald-600 text-lg">{item.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA: ROI & LEADS (¡FUNCIONANDO!) */}
        {activeTab === 'ROI' && (
          <div className="animate-in slide-in-from-right-8 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black italic tracking-tight tracking-tight">Análisis de Retorno (ROI)</h2>
              <p className="text-slate-500 font-medium italic mt-2 tracking-widest uppercase text-xs">Simulación basada en: {selectedKeyword?.name}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Inversión Ads</p>
                <p className="text-6xl font-black text-slate-900 tracking-tighter">{stats.inversion.toLocaleString()}€</p>
              </div>
              <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100">
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3">Ingresos Est.</p>
                <p className="text-6xl font-black tracking-tighter">{stats.ingresos.toLocaleString()}€</p>
              </div>
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">ROI Neto</p>
                <p className="text-6xl font-black text-emerald-500 tracking-tighter">+{roiNeto}%</p>
              </div>
            </div>
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-2xl">
              <div>
                <p className="text-4xl font-black italic mb-2">Previsión de Leads</p>
                <p className="text-slate-400 font-bold italic">Tu concesionario recibirá aproximadamente <span className="text-emerald-400">{stats.leads}</span> leads este mes con esta keyword.</p>
              </div>
              <div className="text-7xl font-black text-indigo-400 italic">#{stats.ventas} <span className="text-sm uppercase tracking-widest text-white/30 not-italic">Ventas</span></div>
            </div>
          </div>
        )}

        {/* VISTA: ALERTAS (¡FUNCIONANDO!) */}
        {activeTab === 'Alertas' && (
          <div className="animate-in zoom-in-95 duration-700 max-w-4xl">
            <header className="mb-12 text-5xl font-black italic tracking-tight">Alertas Inteligentes IA</header>
            <div className="space-y-6">
              {[
                { type: 'CRÍTICA', msg: `Subida masiva del 150% en búsquedas para OMODA en Valladolid.`, color: 'rose', icon: '🔥' },
                { type: 'OPORTUNIDAD', msg: `La competencia ha abandonado la puja en "Coches eléctricos Valladolid". CPC un 30% más bajo.`, color: 'indigo', icon: '✨' },
                { type: 'SUCCESS', msg: `Tu landing de "Taller Especializado" ha alcanzado el Top 3 orgánico.`, color: 'emerald', icon: '🏆' }
              ].map((alerta, i) => (
                <div key={i} className={`bg-white p-10 rounded-[3rem] border-l-[16px] shadow-sm flex items-center gap-10 hover:translate-x-4 transition-transform duration-300 ${
                  alerta.color === 'rose' ? 'border-rose-500' : alerta.color === 'indigo' ? 'border-indigo-500' : 'border-emerald-500'
                }`}>
                  <span className="text-5xl">{alerta.icon}</span>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${
                      alerta.color === 'rose' ? 'text-rose-500' : alerta.color === 'indigo' ? 'text-indigo-500' : 'text-emerald-500'
                    }`}>{alerta.type}</p>
                    <p className="text-2xl font-bold text-slate-800 italic tracking-tight">{alerta.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
