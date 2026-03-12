import React, { useState, useEffect } from 'react';
import { Keyword, Alert, TrendData, ContentSuggestion } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-indigo-600">Cargando Intelligence Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* BARRA LATERAL IZQUIERDA (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">V</div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tight">VallaAuto</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase ml-10">Intelligence</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm cursor-pointer">
            <span className="text-lg">📊</span> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium cursor-pointer transition-colors">
            <span className="text-lg">📄</span> Landing Pages
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium cursor-pointer transition-colors">
            <span className="text-lg">📈</span> ROI & Leads
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium cursor-pointer transition-colors">
            <span className="text-lg">🔔</span> Alertas
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase">Sistema Activo</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Valladolid, ES</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Inteligencia de Mercado</h2>
            <p className="text-sm text-slate-500 font-medium mt-1 italic">📍 Valladolid & Castilla y León</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
              <span>🔄</span> Actualizar Mercado
            </button>
            <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <span>📥</span> Exportar
            </button>
          </div>
        </header>

        {/* TARJETAS DE MÉTRICAS (SUPERIORES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Keywords Activas', val: keywords.length, icon: '🔍', color: 'text-blue-600' },
            { label: 'Tendencias Alza', val: '12', icon: '📈', color: 'text-emerald-600' },
            { label: 'Alertas Críticas', val: '2', icon: '🚨', color: 'text-red-500' },
            { label: 'Oportunidades SEO', val: '4', icon: '💡', color: 'text-amber-500' }
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{card.icon}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              </div>
              <p className={`text-5xl font-black ${card.color}`}>{card.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* TABLA DE TENDENCIAS (CENTRO) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
                <h3 className="font-extrabold text-xl text-slate-800">Ranking de Tendencias</h3>
                <div className="flex gap-2">
                  <span className="text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-full font-bold shadow-md shadow-indigo-100">Todos</span>
                  <span className="text-xs text-slate-400 bg-white border border-slate-100 px-4 py-1.5 rounded-full font-bold hover:bg-slate-50 cursor-pointer transition-colors">Coches</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] border-b border-slate-50">
                    <tr>
                      <th className="px-8 py-5">Palabra Clave</th>
                      <th className="px-8 py-5">Ubicación</th>
                      <th className="px-8 py-5 text-center">Volumen</th>
                      <th className="px-8 py-5 text-right">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {keywords.map((kw) => (
                      <tr 
                        key={kw.id} 
                        onClick={() => setSelectedKeyword(kw)}
                        className={`cursor-pointer transition-all border-b border-slate-50 last:border-0 hover:bg-indigo-50/30 ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}
                      >
                        <td className="px-8 py-5 font-bold text-slate-700 uppercase text-[11px] tracking-tight">{kw.name}</td>
                        <td className="px-8 py-5 text-slate-400 font-semibold">{kw.location}</td>
                        <td className="px-8 py-5 text-center text-slate-600 font-bold">{kw.volume}</td>
                        <td className="px-8 py-5 text-right font-black text-emerald-500">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: EVOLUCIÓN E INTELIGENCIA */}
          <div className="space-y-8">
            {/* GRÁFICA DE EVOLUCIÓN */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <h3 className="font-extrabold text-slate-800 text-lg">Evolución Histórica</h3>
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Live Sync</span>
              </div>
              
              {selectedKeyword ? (
                <div className="space-y-8">
                  <div className="flex items-end justify-between h-40 gap-3 pt-4">
                    {[35, 60, 45, 85, 55, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 rounded-t-xl relative group transition-all duration-500" style={{ height: `${h}%` }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold shadow-xl">
                          {h}% Intencion
                        </div>
                        <div className={`absolute inset-0 bg-indigo-600 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Potencial de ROI</p>
                      <p className="text-6xl font-black text-indigo-600 tracking-tighter">{selectedKeyword.potential}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest uppercase">Competencia</p>
                        <p className="text-sm font-bold text-slate-700">Media-Baja</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 text-xs text-center p-8 italic">
                  Selecciona una keyword para analizar la evolución temporal
                </div>
              )}
            </div>

            {/* ALERTAS INTELIGENTES */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-7xl italic">!</div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-lg">Alertas IA</h3>
                <span className="bg-white/10 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">Real Time</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">Prioridad Alta</p>
                  <p className="text-sm font-semibold leading-relaxed">OMODA: Se detecta un pico de interés del 150% en Valladolid esta semana.</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-emerald-400 mb-2 uppercase tracking-widest">Oportunidad</p>
                  <p className="text-sm font-semibold leading-relaxed">Keywords "Taller Híbridos" sin competencia en el área de León.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
