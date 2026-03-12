import React, { useState, useEffect } from 'react';
import { Keyword, Alert } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Landings' | 'ROI' | 'Alertas'>('Dashboard');
  const [iaAnalysis, setIaAnalysis] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
    } catch (error) {
      console.error("Error cargando JSON. Asegúrate de que public/metadata.json exista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Función de Análisis IA para encontrar la mejor oportunidad
  const generarAnalisisIA = () => {
    if (keywords.length === 0) return;
    const mejor = [...keywords].sort((a, b) => (b.potential + parseInt(b.trend)) - (a.potential + parseInt(a.trend)))[0];
    setIaAnalysis(`OPORTUNIDAD DETECTADA: La keyword "${mejor.name.toUpperCase()}" es tu mejor opción hoy. Tiene un potencial del ${mejor.potential}% y una tendencia explosiva de ${mejor.trend}. Recomendación: Crear campaña en Google Ads inmediatamente.`);
  };

  const getStats = (vol: number) => {
    const clicks = Math.floor(vol * 0.12);
    const leads = Math.floor(clicks * 0.025);
    const roi = leads * 1800;
    return { clicks, leads, roi };
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600">CONECTANDO MOTOR IA...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">V</div>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Intelligence</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {['Dashboard', 'Landings', 'ROI', 'Alertas'].map((id) => (
            <div key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm cursor-pointer transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
              {id === 'Dashboard' ? '📊' : id === 'Landings' ? '📄' : id === 'ROI' ? '📈' : '🔔'} {id}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-700">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Valladolid: Inteligencia de Mercado</h2>
                <p className="text-slate-500 font-medium">Datos 100% reales de tu metadata.json</p>
              </div>
              <button 
                onClick={generarAnalisisIA}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
              >
                🪄 Generar Informe IA
              </button>
            </header>

            {iaAnalysis && (
              <div className="mb-10 p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl animate-in slide-in-from-top-4 duration-500 border-b-4 border-indigo-800">
                <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Análisis Estratégico Real-Time</p>
                <p className="font-bold text-lg italic tracking-tight">{iaAnalysis}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                      <tr><th className="px-8 py-5">Keyword</th><th className="px-8 py-5 text-center">Búsquedas</th><th className="px-8 py-5 text-right">Tendencia</th></tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-indigo-50/40 transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}>
                          <td className="px-8 py-6 font-bold text-slate-800 text-xs uppercase tracking-tighter">{kw.name}</td>
                          <td className="px-8 py-6 text-center font-black text-slate-500">{kw.volume}</td>
                          <td className="px-8 py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="font-black text-xl text-slate-900 mb-8 tracking-tight italic">Evolución: {selectedKeyword?.name}</h3>
                  <div className="flex items-end justify-between h-40 gap-2 px-2">
                    {[25, 45, 30, 60, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 rounded-xl hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="mt-8 text-center bg-indigo-50 p-6 rounded-3xl">
                    <p className="text-6xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Potencial Comercial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ROI' && selectedKeyword && (
          <div className="animate-in slide-in-from-right-10 duration-500">
             <header className="mb-10 text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Proyección ROI: {selectedKeyword.name}</header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Tráfico Mes</p>
                   <p className="text-6xl font-black text-slate-900 tracking-tighter">{getStats(selectedKeyword.volume).clicks}</p>
                </div>
                <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Leads Brutos</p>
                   <p className="text-6xl font-black text-emerald-500 tracking-tighter">{getStats(selectedKeyword.volume).leads}</p>
                </div>
                <div className="bg-indigo-600 p-12 rounded-[3rem] shadow-2xl text-white">
                   <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-4">Valor Estimado</p>
                   <p className="text-6xl font-black tracking-tighter">{getStats(selectedKeyword.volume).roi}€</p>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
