import React, { useState, useEffect } from 'react';
import { Keyword, Alert, TrendData, ContentSuggestion } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);
  // ESTO CONTROLA QUÉ PESTAÑA SE VE
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Landings' | 'ROI' | 'Alertas'>('Dashboard');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
    } catch (error) {
      const backup: Keyword[] = [
        { id: '1', name: 'coches eléctricos valladolid', volume: 1200, difficulty: 45, trend: '+18%', category: 'coches', location: 'Valladolid', type: 'transaccional', potential: 92 },
        { id: '2', name: 'concesionario omoda valladolid', volume: 2400, difficulty: 25, trend: '+150%', category: 'coches', location: 'Valladolid', type: 'navegacional', potential: 95 },
        { id: '3', name: 'motos ocasión león', volume: 850, difficulty: 30, trend: '+12%', category: 'motos', location: 'León', type: 'comercial', potential: 75 }
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
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">V</div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tight">VallaAuto</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase ml-10">Intelligence</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas' }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        <div className="p-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-tighter">Sistema Activo</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Valladolid, ES</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main className="flex-1 p-4 lg:p-10">
        
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Dashboard de Mercado</h2>
                <p className="text-sm text-slate-500 italic">Análisis en tiempo real de tendencias locales</p>
              </div>
            </header>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Keywords Activas</p>
                <p className="text-5xl font-black text-indigo-600">{keywords.length}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tendencias Alza</p>
                <p className="text-5xl font-black text-emerald-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Alertas Críticas</p>
                <p className="text-5xl font-black text-red-500">2</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Oportunidades SEO</p>
                <p className="text-5xl font-black text-amber-500">4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                {/* TABLA PRINCIPAL */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-extrabold text-xl text-slate-800">Ranking de Tendencias</h3>
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
                          <td className="px-8 py-5 font-bold text-slate-700 text-xs uppercase">{kw.name}</td>
                          <td className="px-8 py-5 text-slate-400 font-medium text-sm">{kw.location}</td>
                          <td className="px-8 py-5 text-right font-black text-emerald-500">{kw.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SECCIÓN ESTIMACIÓN ROI & LEADS */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 font-black text-8xl transition-all group-hover:scale-110">ROI</div>
                   <h3 className="font-extrabold text-xl text-slate-800 mb-2">Estimación de ROI & Leads</h3>
                   <p className="text-slate-400 text-sm mb-8">Proyección basada en volumen y tasas de conversión del sector automoción</p>
                   
                   {selectedKeyword ? (
                     <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-50 p-6 rounded-3xl">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Clicks Est.</p>
                           <p className="text-2xl font-black text-indigo-600">{Math.floor(selectedKeyword.volume * 0.15)}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-indigo-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Leads Potenciales</p>
                           <p className="text-2xl font-black text-emerald-600">{Math.floor(selectedKeyword.volume * 0.02)}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Valor Mercado</p>
                           <p className="text-2xl font-black text-slate-800">~{Math.floor(selectedKeyword.volume * 1.2)}€</p>
                        </div>
                     </div>
                   ) : (
                     <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-medium italic">
                        Selecciona una palabra clave para ver proyecciones de ROI
                     </div>
                   )}
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="font-extrabold text-slate-800 mb-6">Evolución Histórica</h3>
                  {selectedKeyword && (
                    <div className="space-y-6">
                      <div className="flex items-end justify-between h-32 gap-2">
                        {[40, 65, 50, 85, 60, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-indigo-100 rounded-t-lg transition-all hover:bg-indigo-600" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                      <p className="text-5xl font-black text-indigo-600 leading-none">{selectedKeyword.potential}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puntuación de Potencial</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                   <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Alertas Inteligentes
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm">
                         <p className="text-indigo-400 font-bold text-[10px] mb-1">TENDENCIA CRÍTICA</p>
                         <p className="font-medium text-slate-200 uppercase text-[11px]">Subida del 150% en concesionarios Omoda</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO PARA LAS OTRAS PESTAÑAS (RELLENO) */}
        {activeTab !== 'Dashboard' && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in zoom-in-95 duration-300">
             <div className="text-6xl mb-4">🏗️</div>
             <h2 className="text-2xl font-black text-slate-800">Sección {activeTab}</h2>
             <p className="text-slate-400 max-w-sm">Estamos procesando los datos de {activeTab.toLowerCase()} para Valladolid. Vuelve en unos minutos.</p>
             <button 
               onClick={() => setActiveTab('Dashboard')}
               className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg"
             >
               Volver al Dashboard
             </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
