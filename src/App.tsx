import React, { useState, useEffect } from 'react';
import { Keyword } from './types';

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Landings' | 'ROI' | 'Alertas'>('Dashboard');
  const [iaAnalysis, setIaAnalysis] = useState<string | null>(null);

  // DATOS DE LANDINGS (SIMULADOS SOBRE TRÁFICO REAL DE VALLADOLID)
  const landingsData = [
    { url: "/concesionario-omoda-valladolid", visitas: 2450, conv: "4.2%", leads: 103, status: "Óptima" },
    { url: "/ofertas-jaecoo-7-cyl", visitas: 1820, conv: "3.8%", leads: 69, status: "Óptima" },
    { url: "/coches-ocasion-valladolid", visitas: 5100, conv: "2.1%", leads: 107, status: "Mejorable" },
    { url: "/renting-particulares-vll", visitas: 940, conv: "5.5%", leads: 52, status: "Crítica (Bajo Tráfico)" },
    { url: "/taller-oficial-omoda", visitas: 410, conv: "8.2%", leads: 34, status: "Óptima" }
  ];

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

  const generarAnalisisIA = () => {
    if (keywords.length === 0) return;
    const mejor = [...keywords].sort((a, b) => (b.potential + parseInt(b.trend)) - (a.potential + parseInt(a.trend)))[0];
    setIaAnalysis(`ESTRATEGIA RECOMENDADA: Priorizar inversión en "${mejor.name.toUpperCase()}". Es la tendencia número 1 en Castilla y León con un crecimiento del ${mejor.trend}.`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600">CARGANDO INTELIGENCIA...</div>;

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
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas IA' }
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm cursor-pointer transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        
        {/* SECCIÓN: DASHBOARD (TU DISEÑO ORIGINAL) */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-700">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Mercado Valladolid</h2>
                <p className="text-slate-500 font-medium italic">Análisis real de intención de búsqueda</p>
              </div>
              <button onClick={generarAnalisisIA} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                🪄 Generar Informe IA
              </button>
            </header>

            {iaAnalysis && (
              <div className="mb-10 p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl animate-bounce-short">
                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Sugerencia del sistema</p>
                <p className="font-bold text-lg">{iaAnalysis}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                    <tr><th className="px-8 py-5">Keyword</th><th className="px-8 py-5 text-center">Volumen</th><th className="px-8 py-5 text-right">Tendencia</th></tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw) => (
                      <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-indigo-50/40 transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}>
                        <td className="px-8 py-6 font-bold text-slate-800 text-xs uppercase">{kw.name}</td>
                        <td className="px-8 py-6 text-center font-black text-slate-500">{kw.volume}</td>
                        <td className="px-8 py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
                <h3 className="font-black text-xl text-slate-900 mb-8 italic">Potencial: {selectedKeyword?.name}</h3>
                <div className="text-center bg-indigo-50 p-10 rounded-[2rem]">
                  <p className="text-7xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">Score de Conversión</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN: LANDING PAGES (¡YA FUNCIONA!) */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <header className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Rendimiento de Landings</h2>
              <p className="text-slate-500 font-medium italic">Métricas de conversión por URL específica</p>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest">
                  <tr>
                    <th className="px-10 py-6">URL del Destino</th>
                    <th className="px-10 py-6 text-center">Visitas Únicas</th>
                    <th className="px-10 py-6 text-center">Ratio Conv.</th>
                    <th className="px-10 py-6 text-center">Leads</th>
                    <th className="px-10 py-6 text-right">Estado Salud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {landingsData.map((page, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-8 font-bold text-indigo-600 italic">{page.url}</td>
                      <td className="px-10 py-8 text-center font-black text-slate-700">{page.visitas.toLocaleString()}</td>
                      <td className="px-10 py-8 text-center font-black text-emerald-600">{page.conv}</td>
                      <td className="px-10 py-8 text-center font-black text-slate-900">{page.leads}</td>
                      <td className="px-10 py-8 text-right">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${
                          page.status === 'Óptima' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {page.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
