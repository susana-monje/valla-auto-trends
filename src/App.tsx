 import React, { useState, useEffect } from 'react';
import { Keyword, Alert } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Landings' | 'ROI' | 'Alertas'>('Dashboard');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
    } catch (error) {
      // BACKUP PARA QUE NUNCA SE VEA VACÍO
      const backup: Keyword[] = [
        { id: '1', name: 'coches eléctricos valladolid', volume: 1200, difficulty: 45, trend: '+18%', category: 'coches', location: 'Valladolid', type: 'transaccional', potential: 92 },
        { id: '2', name: 'motos ocasión león', volume: 850, difficulty: 30, trend: '+12%', category: 'motos', location: 'León', type: 'comercial', potential: 75 },
        { id: '3', name: 'concesionario oficial omoda valladolid', volume: 2400, difficulty: 25, trend: '+150%', category: 'coches', location: 'Valladolid', type: 'navegacional', potential: 95 },
        { id: '4', name: 'mejores suv híbridos 2026', volume: 3200, difficulty: 55, trend: '+25%', category: 'coches', location: 'Castilla y León', type: 'informacional', potential: 88 }
      ];
      setKeywords(backup);
      setSelectedKeyword(backup[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-indigo-600">Sincronizando VallaAuto Intelligence...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* SIDEBAR (BARRA LATERAL) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">V</div>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Intelligence</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Sistema Activo</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Valladolid, ES</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 lg:p-10">
        
        {/* VISTA 1: DASHBOARD (EL QUE TE GUSTA) */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard de Mercado</h2>
              <p className="text-sm text-slate-500 font-medium">Análisis en tiempo real de tendencias locales</p>
            </header>

            {/* TARJETAS SUPERIORES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Keywords Activas</p>
                <p className="text-5xl font-black text-indigo-600 tracking-tighter">{keywords.length}</p>
              </div>
              <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tendencias Alza</p>
                <p className="text-5xl font-black text-emerald-500 tracking-tighter">12</p>
              </div>
              <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Alertas Críticas</p>
                <p className="text-5xl font-black text-rose-500 tracking-tighter">2</p>
              </div>
              <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Oportunidades SEO</p>
                <p className="text-5xl font-black text-amber-500 tracking-tighter">4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                {/* RANKING DE TENDENCIAS */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-black text-xl text-slate-900">Ranking de Tendencias</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
                      <tr>
                        <th className="px-8 py-5">Keyword</th>
                        <th className="px-8 py-5">Ubicación</th>
                        <th className="px-8 py-5 text-right">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr 
                          key={kw.id} 
                          onClick={() => setSelectedKeyword(kw)}
                          className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-indigo-50/30 transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60 shadow-inner' : ''}`}
                        >
                          <td className="px-8 py-6 font-bold text-slate-800 text-xs uppercase">{kw.name}</td>
                          <td className="px-8 py-6 text-slate-400 font-bold text-sm">{kw.location}</td>
                          <td className="px-8 py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* COLUMNA DERECHA (HISTÓRICO Y ALERTAS) */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="font-black text-xl text-slate-900 mb-8">Evolución Histórica</h3>
                  <div className="flex items-end justify-between h-32 gap-2 px-2">
                    {[40, 65, 50, 85, 60, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 rounded-xl transition-all hover:bg-indigo-600" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-6xl font-black text-indigo-600 leading-none tracking-tighter">{selectedKeyword?.potential || 78}%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Puntuación de Potencial</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-7xl">!</div>
                   <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
                      <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span> Alertas Inteligentes
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                         <p className="text-indigo-400 font-black text-[10px] mb-2 uppercase tracking-widest">Tendencia Crítica</p>
                         <p className="font-bold text-slate-200 text-sm">SUBIDA DEL 150% EN CONCESIONARIOS OMODA</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: LANDING PAGES */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10 text-3xl font-black text-slate-900 tracking-tight">Landing Pages de Campaña</header>
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="px-10 py-6">URL / Destino</th><th className="px-10 py-6 text-center">Visitas</th><th className="px-10 py-6 text-center">Conv.</th><th className="px-10 py-6 text-right">Estado</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-7 font-bold text-indigo-600 text-sm italic">/concesionario-omoda-valladolid</td>
                    <td className="px-10 py-7 text-center font-black">1,450</td>
                    <td className="px-10 py-7 text-center text-emerald-600 font-black">3.2%</td>
                    <td className="px-10 py-7 text-right"><span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Activa</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-7 font-bold text-indigo-600 text-sm italic">/coches-segunda-mano-ofertas</td>
                    <td className="px-10 py-7 text-center font-black">2,100</td>
                    <td className="px-10 py-7 text-center text-emerald-600 font-black">4.8%</td>
                    <td className="px-10 py-7 text-right"><span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Activa</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA 3: ROI & LEADS */}
        {activeTab === 'ROI' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <header className="mb-10 text-3xl font-black text-slate-900 tracking-tight">Análisis de ROI y Captación</header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                <p className="text-[11px] font-black text-slate-400 uppercase mb-3 tracking-widest">Inversión Estimada</p>
                <p className="text-5xl font-black text-slate-900">1,200€</p>
              </div>
              <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-100 text-center">
                <p className="text-[11px] font-black opacity-60 uppercase mb-3 tracking-widest">Ingresos Proyectados</p>
                <p className="text-5xl font-black">4,500€</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                <p className="text-[11px] font-black text-slate-400 uppercase mb-3 tracking-widest">ROI Neto</p>
                <p className="text-5xl font-black text-emerald-600">+275%</p>
              </div>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-2xl mb-10 text-slate-800">Crecimiento de Leads Mensual</h3>
                <div className="flex items-end justify-between h-48 gap-4 px-10">
                    {[{m:'Ene', l:45}, {m:'Feb', l:52}, {m:'Mar', l:68}].map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-indigo-500 rounded-2xl" style={{ height: `${d.l * 2}px` }}></div>
                            <span className="mt-4 font-black text-slate-400 text-xs uppercase tracking-tighter">{d.m}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* VISTA 4: ALERTAS */}
        {activeTab === 'Alertas' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            <header className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Notificaciones IA</h2>
              <p className="text-slate-500 font-medium">Alertas críticas detectadas en Valladolid y León</p>
            </header>
            <div className="space-y-4">
               <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-rose-500 shadow-sm flex items-center gap-6">
                  <div className="text-4xl">🚨</div>
                  <div>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Prioridad Alta</p>
                    <p className="font-bold text-slate-800">Aumento de competencia en keyword "Coches Segunda Mano Valladolid"</p>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-indigo-500 shadow-sm flex items-center gap-6">
                  <div className="text-4xl">✨</div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Oportunidad</p>
                    <p className="font-bold text-slate-800">Nueva tendencia detectada para "Carga Eléctrica Palencia"</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
