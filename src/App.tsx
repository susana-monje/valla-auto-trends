import React, { useState, useEffect } from 'react';
import { Keyword, Alert, TrendData, ContentSuggestion } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      if (!response.ok) throw new Error('Error al cargar');
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
    } catch (error) {
      const backup: Keyword[] = [
        { id: '1', name: 'coches eléctricos valladolid', volume: 1200, difficulty: 45, trend: '+18%', category: 'eléctricos', location: 'Valladolid', type: 'transaccional', potential: 92 },
        { id: '2', name: 'concesionario oficial omoda valladolid', volume: 2400, difficulty: 25, trend: '+150%', category: 'marcas', location: 'Valladolid', type: 'navegacional', potential: 95 },
        { id: '3', name: 'motos segunda mano león', volume: 850, difficulty: 30, trend: '+12%', category: 'motos', location: 'León', type: 'comercial', potential: 75 }
      ];
      setKeywords(backup);
      setSelectedKeyword(backup[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setAlerts([
      { id: '1', type: 'warning', message: 'Explosión de interés en OMODA Valladolid', date: 'Hoy' },
      { id: '2', type: 'success', message: 'Keyword "Taller Jaecoo" con baja dificultad detectada', date: 'Ayer' }
    ]);
  }, []);

  // ESTA ES LA PARTE QUE RECUPERA LAS GRÁFICAS Y SUGERENCIAS
  useEffect(() => {
    if (selectedKeyword) {
      setTrendData([
        { date: 'Ene', value: 40 },
        { date: 'Feb', value: 65 },
        { date: 'Mar', value: selectedKeyword.potential }
      ]);
      setSuggestions([
        { id: '1', title: `Guía SEO: Dominando "${selectedKeyword.name}"`, type: 'Blog', impact: 'Alto' },
        { id: '2', title: `Campaña Local Ads en ${selectedKeyword.location}`, type: 'SEM', impact: 'Medio' }
      ]);
    }
  }, [selectedKeyword]);

  if (loading) return <div className="p-10 text-center font-bold text-blue-900">Cargando VallaAuto Intelligence...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight">VallaAuto <span className="text-blue-600">Trends</span></h1>
          <p className="text-slate-500 font-medium">Panel de Inteligencia SEO Valladolid & CyL</p>
        </div>
        <div className="bg-white p-2 px-4 rounded-full shadow-sm border border-slate-200 text-sm font-bold text-blue-600">
          Marzo 2026
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: LISTADO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Keyword</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Volumen</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw) => (
                  <tr 
                    key={kw.id} 
                    onClick={() => setSelectedKeyword(kw)}
                    className={`border-b last:border-0 cursor-pointer transition-all hover:bg-blue-50 ${selectedKeyword?.id === kw.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                  >
                    <td className="p-5 font-bold text-slate-700">{kw.name}</td>
                    <td className="p-5 text-center text-slate-600 font-semibold">{kw.volume}</td>
                    <td className="p-5 text-right font-black text-emerald-600">{kw.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NUEVA SECCIÓN: SUGERENCIAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2 inline-block">{s.type}</span>
                <h4 className="font-bold text-slate-800">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-1 italic">Impacto estimado: {s.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: DETALLE Y GRÁFICA */}
        <div className="space-y-6">
          {selectedKeyword && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl italic">ROI</div>
              <h3 className="text-sm font-bold text-blue-600 uppercase mb-1">Análisis Detallado</h3>
              <p className="text-2xl font-black text-slate-800 mb-6">{selectedKeyword.name}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>POTENCIAL DE CONVERSIÓN</span>
                    <span>{selectedKeyword.potential}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${selectedKeyword.potential}%` }}></div>
                  </div>
                </div>

                {/* MINI GRÁFICA DE TENDENCIA VISUAL */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center tracking-[0.2em]">Evolución trimestral</p>
                  <div className="flex items-end justify-around h-24 gap-2 px-2">
                    {trendData.map((d, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                        <div 
                          className="w-full bg-blue-100 rounded-t-md group-hover:bg-blue-400 transition-colors relative" 
                          style={{ height: `${d.value}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.value}%
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Alertas del Mercado
            </h3>
            <div className="space-y-3 text-sm">
              {alerts.map(a => (
                <div key={a.id} className="bg-white/10 p-3 rounded-lg border border-white/5">
                  <p className="font-medium">{a.message}</p>
                  <span className="text-[10px] opacity-50 uppercase font-bold">{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
