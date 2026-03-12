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

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-indigo-600">Cargando Inteligencia de Mercado...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-black text-indigo-700">VallaAuto</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Marketing Intelligence</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm cursor-pointer">
            <span>📊 Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm cursor-pointer transition-all">
            <span>📄 Landing Pages</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm cursor-pointer">
            <span>📈 ROI & Leads</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm cursor-pointer">
            <span>🔔 Alertas</span>
          </div>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Valladolid, ES</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Activo
            </p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Inteligencia de Mercado</h2>
            <p className="text-sm text-slate-500 flex items-center gap-2">📍 Valladolid & Castilla y León</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Actualizar Mercado</button>
            <button className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">Exportar</button>
          </div>
        </header>

        {/* TARJETAS SUPERIORES (METRICS) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Keywords Activas', val: keywords.length, color: 'text-blue-600' },
            { label: 'Tendencias Alza', val: '12', color: 'text-emerald-600' },
            { label: 'Alertas Críticas', val: '2', color: 'text-red-500' },
            { label: 'Oportunidades SEO', val: '4', color: 'text-amber-500' }
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <p className={`text-4xl font-black ${card.color}`}>{card.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TABLA DE TENDENCIAS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-2">
              <div className="p-6 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Ranking de Tendencias</h3>
                <div className="flex gap-2">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">Todos</span>
                  <span className="text-xs text-slate-400 px-3 py-1 font-bold">Coches</span>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
                  <tr>
                    <th className="px-6 py-4">Palabra Clave</th>
                    <th className="px-6 py-4">Ubicación</th>
                    <th className="px-6 py-4 text-center">Volumen</th>
                    <th className="px-6 py-4 text-right">Tendencia</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {keywords.map((kw) => (
                    <tr 
                      key={kw.id} 
                      onClick={() => setSelectedKeyword(kw)}
                      className={`cursor-pointer transition-all hover:bg-slate-50 ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-700 uppercase text-[11px] tracking-tight">{kw.name}</td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{kw.location}</td>
                      <td className="px-6 py-4 text-center text-slate-600 font-bold">{kw.volume}</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-500">{kw.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMNA DERECHA: EVOLUCIÓN Y ALERTAS */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-slate-800 mb-6">Evolución Histórica</h3>
              {selectedKeyword ? (
                <div className="space-y-6">
                  <div className="flex items-end justify-between h-32 gap-3 pt-4">
                    {[40, 70, 50, 90, 60, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {h}% Vol
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Potencial Estimado</p>
                    <p className="text-5xl font-black text-indigo-600 leading-none">{selectedKeyword.potential}%</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 text-xs text-center p-8 italic">
                  Selecciona una keyword para ver la evolución
                </div>
              )}
            </div>

            <div className="bg-[#1E293B] p-8 rounded-[32px] shadow-2xl text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Alertas Inteligentes</h3>
                <span className="bg-indigo-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold text-indigo-300 mb-1">ALTA PRIORIDAD</p>
                  <p className="text-sm font-medium">OMODA: Subida del 150% en búsquedas locales en Valladolid.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold text-emerald-300 mb-1">OPORTUNIDAD</p>
                  <p className="text-sm font-medium">Baja competencia detectada para "Coches eléctricos CyL".</p>
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
