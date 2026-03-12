import React, { useState, useEffect } from 'react';
import { Keyword, Alert } from './types';

// Definimos interfaces locales para las nuevas secciones
interface Landing { id: string; url: string; visits: number; conversion: string; status: string; }
interface RoiData { total_investment: number; estimated_revenue: number; roi_percentage: number; monthly_leads: any[]; }

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [landings, setLandings] = useState<Landing[]>([]);
  const [roi, setRoi] = useState<RoiData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Landings' | 'ROI' | 'Alertas'>('Dashboard');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Carga paralela de todos los archivos
      const [kwRes, lanRes, roiRes, altRes] = await Promise.all([
        fetch('/metadata.json'),
        fetch('/landings.json'),
        fetch('/roi.json'),
        fetch('/alerts.json')
      ]);

      const kwData = await kwRes.json();
      setKeywords(kwData);
      if (kwData.length > 0) setSelectedKeyword(kwData[0]);

      setLandings(await lanRes.json());
      setRoi(await roiRes.json());
      setAlerts(await altRes.json());
    } catch (error) {
      console.error("Usando datos de respaldo...");
      // Backup por si fallan los JSON
      setKeywords([{ id: '1', name: 'coches eléctricos valladolid', volume: 1200, difficulty: 45, trend: '+18%', category: 'coches', location: 'Valladolid', type: 'transaccional', potential: 92 }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-indigo-600 animate-pulse">Sincronizando VallaAuto Intelligence...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* SIDEBAR */}
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
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' }
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
      </aside>

      <main className="flex-1 p-4 lg:p-10">
        
        {/* VISTA DASHBOARD (TU VISTA ACTUAL) */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10 text-3xl font-extrabold text-slate-900">Dashboard de Mercado</header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
                      <tr><th className="px-8 py-5">Keyword</th><th className="px-8 py-5 text-right">Tendencia</th></tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer border-b border-slate-50 hover:bg-indigo-50/30 ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}>
                          <td className="px-8 py-5 font-bold text-slate-700 text-xs uppercase">{kw.name}</td>
                          <td className="px-8 py-5 text-right font-black text-emerald-500">{kw.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="font-bold text-lg mb-6">Alertas IA</h3>
                {alerts.map(a => (
                  <div key={a.id} className="bg-white/5 p-4 rounded-2xl mb-3 border border-white/5 text-xs">
                    <p className="text-indigo-400 font-black mb-1">{a.type.toUpperCase()}</p>
                    <p>{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISTA LANDING PAGES */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10 text-3xl font-extrabold text-slate-900">Rendimiento de Landings</header>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr><th className="px-8 py-5">URL de Campaña</th><th className="px-8 py-5 text-center">Visitas</th><th className="px-8 py-5 text-center">Conv.</th><th className="px-8 py-5 text-right">Estado</th></tr>
                </thead>
                <tbody>
                  {landings.map(l => (
                    <tr key={l.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-8 py-5 font-bold text-indigo-600 text-sm">{l.url}</td>
                      <td className="px-8 py-5 text-center font-bold">{l.visits}</td>
                      <td className="px-8 py-5 text-center text-emerald-600 font-black">{l.conversion}</td>
                      <td className="px-8 py-5 text-right"><span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA ROI & LEADS */}
        {activeTab === 'ROI' && roi && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10 text-3xl font-extrabold text-slate-900">Análisis de ROI</header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Inversión Total</p>
                <p className="text-4xl font-black text-slate-800">{roi.total_investment}€</p>
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white">
                <p className="text-[10px] font-bold opacity-70 uppercase mb-2">Ingreso Estimado</p>
                <p className="text-4xl font-black">{roi.estimated_revenue}€</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Porcentaje ROI</p>
                <p className="text-4xl font-black text-emerald-600">+{roi.roi_percentage}%</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-xl mb-8">Captación de Leads Mensual</h3>
                <div className="flex items-end justify-between h-48 gap-4 px-10">
                    {roi.monthly_leads.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-indigo-500 rounded-2xl transition-all hover:bg-indigo-700" style={{ height: `${m.leads * 2}px` }}></div>
                            <span className="mt-4 font-bold text-slate-400 text-xs uppercase">{m.month}</span>
                            <span className="font-black text-slate-800 text-sm">{m.leads}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
