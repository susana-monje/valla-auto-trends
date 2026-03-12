import React, { useState, useEffect } from 'react';
import { Keyword, Alert, TrendData, ContentSuggestion } from './types';

// Interfaces locales para los tipos de datos adicionales de la Sidebar y Tarjetas
interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface MetricCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // Datos para la Sidebar (Barra Lateral)
  const sidebarItems: SidebarItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'LandingPages', label: 'Landing Pages', icon: '📄' },
    { id: 'ROI Leads', label: 'ROI & Leads', icon: '📈' },
    { id: 'Alertas', label: 'Alertas', icon: '🔔' },
    { id: 'Campaas', label: 'Campañas', icon: '🎯' },
  ];

  // Datos para las Tarjetas de Métricas Superiores
  const metricCards: MetricCard[] = [
    { label: 'KEYWORDS ACTIVAS', value: '10', icon: '🔍', color: 'text-indigo-600' },
    { label: 'TENDENCIAS ALZA', value: '12', icon: '📈', color: 'text-emerald-500' },
    { label: 'ALERTAS CRÍTICAS', value: '2', icon: '⚠️', color: 'text-rose-600' },
    { label: 'OPORTUNIDADES SEO', value: '4', icon: '💡', color: 'text-amber-500' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
    } catch (error) {
      // DATOS DE RESPALDO (Esto asegura que la interfaz se vea con datos)
      const backup: Keyword[] = [
        { id: '1', name: 'coches eléctricos valladolid', volume: 1200, difficulty: 45, trend: '+18%', category: 'eléctricos', location: 'Valladolid', type: 'transaccional', potential: 92 },
        { id: '2', name: 'motos ocasión león', volume: 850, difficulty: 30, trend: '+12%', category: 'motos', location: 'León', type: 'comercial', potential: 75 },
        { id: '3', name: 'concesionario oficial omoda valladolid', volume: 2400, difficulty: 25, trend: '+150%', category: 'marcas', location: 'Valladolid', type: 'navegacional', potential: 95 },
        { id: '4', name: 'mejores suv híbridos 2026', volume: 3200, difficulty: 55, trend: '+25%', category: 'híbridos', location: 'Castilla y León', type: 'informacional', potential: 88 }
      ];
      setKeywords(backup);
      if (backup.length > 0) setSelectedKeyword(backup[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setAlerts([
      { id: '1', type: 'warning', message: 'Subida de interés en OMODA Valladolid', date: 'Hoy' }
    ]);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-xl font-semibold text-indigo-700 animate-pulse">Cargando Panel de Inteligencia VallaAuto Trends...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* SIDEBAR (Barra Lateral Izquierda) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
        <div className="mb-10">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white font-black text-xl rounded-xl w-10 h-10 flex items-center justify-center shadow-lg shadow-indigo-200">V</div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tighter">VallaAuto</h1>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5 ml-1">Market Intel</p>
        </div>
        <nav className="flex-1 space-y-2.5">
          {sidebarItems.map(item => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3.5 p-3.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${item.id === 'Dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto border border-indigo-100 bg-indigo-50 rounded-2xl p-5 text-indigo-900 shadow-inner">
          <div className="flex gap-2 items-center mb-1.5">
            <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>
            <span className="text-xs font-black uppercase text-emerald-600">Sistema Live</span>
          </div>
          <p className="text-sm font-bold">Valladolid & CyL</p>
          <p className="text-xs font-medium opacity-80 mt-1">Inteligencia SEO local en tiempo real</p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Main Content) */}
      <main className="flex-1 p-8 md:p-12">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Inteligencia de Mercado</h2>
            <p className="text-slate-500 font-medium mt-1">📍 Análisis de tendencias y oportunidades en Castilla y León</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white font-bold text-sm rounded-xl px-6 py-3.5 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">Actualizar Mercado</button>
            <button className="bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl px-6 py-3.5 shadow-sm hover:bg-slate-50 transition-colors">Exportar Datos</button>
          </div>
        </header>

        {/* TARJETAS DE MÉTRICAS (METRICS CARDS) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metricCards.map((card, index) => (
            <div key={index} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.icon}</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              </div>
              <p className={`text-5xl font-black ${card.color} tracking-tight`}>{card.value}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TABLA DE TENDENCIAS (TRENDS TABLE) */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 mb-2">
                <h3 className="text-xl font-extrabold text-slate-950">Ranking de Tendencias</h3>
                <div className="flex gap-1.5">
                  <span className="bg-indigo-50 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">Todos</span>
                  <span className="bg-slate-100 text-slate-500 px-3.5 py-1 rounded-full text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors">Coches</span>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="text-xs text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4">Palabra Clave</th>
                    <th className="px-5 py-4 text-center">Volumen</th>
                    <th className="px-5 py-4 text-right">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw) => (
                    <tr 
                      key={kw.id} 
                      onClick={() => setSelectedKeyword(kw)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/50' : ''}`}
                    >
                      <td className="px-5 py-5 font-semibold text-slate-800 uppercase text-[11px] tracking-tight">{kw.name}</td>
                      <td className="px-5 py-5 text-center text-slate-600 font-medium">{kw.volume}</td>
                      <td className="px-5 py-5 text-right font-black text-emerald-500">{kw.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* EVOLUCIÓN HISTÓRICA & ALERTAS (EVOLUTION & ALERTS) */}
          <section className="space-y-8">
            {selectedKeyword && (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-950">Evolución Histórica</h3>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Live Sync</span>
                </div>
                <div className="space-y-6">
                  {/* Gráfico de barras estilizado */}
                  <div className="flex items-end justify-between h-40 gap-2 px-1">
                    {[45, 72, 58, 91, 65, 83].map((height, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 rounded-lg relative group transition-all duration-300" style={{ height: `${height}%` }}>
                        <div className="absolute top-0 inset-x-0 bg-indigo-600 rounded-t-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:height-full"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-lg">
                          {height}% ROI
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Potencial de ROI Estimado</p>
                    <p className="text-7xl font-black text-indigo-600 tracking-tighter mt-1">{selectedKeyword.potential}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Alertas Inteligentes</h3>
                <span className="bg-white/10 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">Real Time</span>
              </div>
              <div className="space-y-4">
                {alerts.map(a => (
                  <div key={a.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-sm font-semibold">{a.message}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1.5">{a.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
