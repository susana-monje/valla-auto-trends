import React, { useState, useEffect } from 'react';

// Interfaz basada en tus capturas de "Ranking de Búsqueda Real"
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

  // Carga segura de datos con respaldo para evitar el "Sincronizando..." infinito
  useEffect(() => {
    fetch('/metadata.json')
      .then(res => res.json())
      .then(data => {
        setKeywords(data);
        if (data.length > 0) setSelectedKeyword(data[0]);
        setLoading(false);
      })
      .catch(() => {
        // Datos de respaldo exactos de tus capturas
        const mockData = [
          { id: "1", name: "Coches Eléctricos Valladolid", volume: 1200, trend: "+18%", potential: 92 },
          { id: "2", name: "Motos Ocasión León", volume: 850, trend: "+12%", potential: 85 },
          { id: "3", name: "Concesionario Oficial Omoda Valladolid", volume: 2400, trend: "+150%", potential: 98 },
          { id: "4", name: "Mejores SUV Híbridos 2026", volume: 3200, trend: "+25%", potential: 94 },
          { id: "5", name: "Taller Especializado Jaecoo", volume: 450, trend: "+200%", potential: 90 }
        ];
        setKeywords(mockData);
        setSelectedKeyword(mockData[0]);
        setLoading(false);
      });
  }, []);

  // Lógica de ROI basada en la keyword seleccionada
  const stats = selectedKeyword ? {
    inversion: Math.floor(selectedKeyword.volume * 0.12 * 0.95),
    leads: Math.floor(selectedKeyword.volume * 0.12 * 0.05),
    ingresos: Math.max(1, Math.floor(selectedKeyword.volume * 0.12 * 0.05 * 0.10)) * 2500
  } : { inversion: 0, leads: 0, ingresos: 0 };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600">INICIALIZANDO VALLAAUTO...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1A1F36]">
      
      {/* SIDEBAR FIJA - Diseño según capturas */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 text-center lg:text-left">
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
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sistema Activo: VLL</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* SECCIÓN 1: DASHBOARD (Mantiene el Ranking y la Evolución Histórica) */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-700">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Dashboard de Mercado</h2>
                <p className="text-slate-400 font-medium italic">Análisis en tiempo real de tendencias locales</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Live Data Connect</div>
            </header>

            {/* MÉTRICAS SUPERIORES */}
            <div className="grid grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Keywords Activas', value: '10', color: 'text-indigo-600' },
                { label: 'Tendencias Alza', value: '+240%', color: 'text-emerald-500' },
                { label: 'Leads Proyectados', value: '142', color: 'text-rose-500' },
                { label: 'Oportunidades SEO', value: '8', color: 'text-amber-500' }
              ].map((m, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{m.label}</p>
                  <p className={`text-5xl font-black tracking-tighter ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50"><h3 className="font-black text-xl italic text-slate-900 tracking-tight">Ranking de Búsqueda Real</h3></div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                    <tr><th className="px-8 py-4">Palabra Clave</th><th className="px-8 py-4 text-center">Búsquedas/Mes</th><th className="px-8 py-4 text-right">Crecimiento</th></tr>
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
                  <h3 className="font-black text-lg text-slate-900 mb-6 italic tracking-tight">Evolución del Interés</h3>
                  <div className="flex items-end justify-center gap-2 h-32 mb-8">
                    {[40, 70, 50, 90, 60, 100].map((h, i) => (
                      <div key={i} className="w-6 bg-indigo-100 rounded-t-lg transition-all hover:bg-indigo-600" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="bg-indigo-50/50 p-6 rounded-3xl">
                    <p className="text-6xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                    <p className="text-[10px] font-black text-indigo-300 uppercase mt-2 tracking-widest">Potencial de Conversión</p>
                  </div>
                </div>
                {/* ALERTAS INTELIGENTES */}
                <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-2xl">
                   <p className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-4"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Alertas Inteligentes</p>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Tendencia Crítica</p>
                      <p className="font-bold text-sm leading-tight italic">Subida del 150% en concesionarios Omoda</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: ROI & LEADS (Ahora funcional e integrada) */}
        {activeTab === 'ROI' && (
          <div className="animate-in slide-in-from-right-10 duration-700">
            <header className="mb-10 text-4xl font-black italic tracking-tight">Análisis de ROI & Leads</header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Inversión Ads Est.</p>
                <p className="text-6xl font-black tracking-tighter">{stats.inversion.toLocaleString()}€</p>
              </div>
              <div className="bg-indigo-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-100">
                <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Ingresos Proyectados</p>
                <p className="text-6xl font-black tracking-tighter">{stats.ingresos.toLocaleString()}€</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Leads Mensuales</p>
                <p className="text-6xl font-black text-emerald-500 tracking-tighter">{stats.leads}</p>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: LANDINGS (Basada en tu diseño de "Rendimiento de Páginas") */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <header className="mb-10 text-4xl font-black italic tracking-tight">Rendimiento de Páginas</header>
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest">
                  <tr><th className="px-12 py-8">Ruta de URL</th><th className="px-12 py-8 text-center">Visitas</th><th className="px-12 py-8 text-center">Leads</th><th className="px-12 py-8 text-right">Ratio</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-12 py-8 font-bold text-indigo-600 italic">/concesionario-omoda-valladolid</td>
                    <td className="px-12 py-8 text-center font-black">4.250</td>
                    <td className="px-12 py-8 text-center font-black">152</td>
                    <td className="px-12 py-8 text-right font-black text-emerald-500">3.6%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-12 py-8 font-bold text-indigo-600 italic">/ofertas-jaecoo-7-cyl</td>
                    <td className="px-12 py-8 text-center font-black">2.890</td>
                    <td className="px-12 py-8 text-center font-black">98</td>
                    <td className="px-12 py-8 text-right font-black text-emerald-500">3.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: ALERTAS (Estilo según tu captura de Alertas IA) */}
        {activeTab === 'Alertas' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-4xl">
            <header className="mb-10 text-4xl font-black italic tracking-tight text-slate-900">Centro de Alertas IA</header>
            <div className="space-y-6">
              {[
                { type: 'WARNING', msg: 'Aumento de búsqueda "Coches Omoda" en Valladolid', color: 'border-amber-400', tag: 'text-amber-500' },
                { type: 'SUCCESS', msg: 'Keyword "Segunda mano León" ha subido 5 posiciones', color: 'border-emerald-400', tag: 'text-emerald-500' },
                { type: 'CRITICAL', msg: 'Competencia directa pujando fuerte en Valladolid', color: 'border-rose-400', tag: 'text-rose-500' }
              ].map((a, i) => (
                <div key={i} className={`bg-white p-10 rounded-[2.5rem] border-l-[16px] ${a.color} shadow-sm flex items-center gap-10 hover:translate-x-2 transition-transform`}>
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center font-black">!</div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${a.tag}`}>{a.type}</p>
                    <p className="text-2xl font-bold text-slate-800 italic tracking-tight">{a.msg}</p>
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
