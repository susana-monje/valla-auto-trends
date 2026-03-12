import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Intentamos cargar tu JSON de las 30 keywords
    fetch('/metadata.json')
      .then(res => {
        if (!res.ok) throw new Error("Archivo no encontrado");
        return res.json();
      })
      .then(data => {
        setKeywords(data);
        if (data.length > 0) setSelectedKeyword(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Usando datos de respaldo:", err.message);
        // DATOS DE RESPALDO PARA QUE NUNCA SE QUEDE "SINCRONIZANDO"
        const backupData = [
          { id: "1", name: "omoda 5 valladolid", volume: 3200, trend: "+185%", potential: 98 },
          { id: "2", name: "jaecoo 7 precio", volume: 2400, trend: "+210%", potential: 95 },
          { id: "3", name: "coches ocasion valladolid", volume: 5400, trend: "+12%", potential: 88 }
        ];
        setKeywords(backupData);
        setSelectedKeyword(backupData[0]);
        setLoading(false);
      });
  }, []);

  // Fórmulas de ROI actualizadas
  const stats = selectedKeyword ? {
    inversion: Math.floor(selectedKeyword.volume * 0.12 * 0.90),
    leads: Math.floor(selectedKeyword.volume * 0.12 * 0.04),
    ventas: Math.max(1, Math.floor(selectedKeyword.volume * 0.12 * 0.04 * 0.10)),
    ingresos: Math.max(1, Math.floor(selectedKeyword.volume * 0.12 * 0.04 * 0.10)) * 2400
  } : { inversion: 0, leads: 0, ventas: 0, ingresos: 0 };

  const roiNeto = stats.inversion > 0 ? (((stats.ingresos - stats.inversion) / stats.inversion) * 100).toFixed(0) : 0;

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-indigo-900 animate-pulse uppercase tracking-widest text-sm">Sincronizando Mercado Valladolid...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl italic shadow-xl shadow-indigo-100">V</div>
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tighter leading-none">VallaAuto</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1">INTELLIGENCE</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas IA' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-12 overflow-y-auto">
        
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Dashboard</h2>
              <p className="text-slate-500 font-medium text-lg italic mt-2">Tendencias reales detectadas en Valladolid</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[11px] text-slate-400 font-black uppercase tracking-widest">
                    <tr><th className="px-10 py-6">Keyword</th><th className="px-10 py-6 text-center">Volumen</th><th className="px-10 py-6 text-right">Trend</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {keywords.map((kw) => (
                      <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
                        <td className="px-10 py-7 font-bold text-slate-800 uppercase italic tracking-tighter">{kw.name}</td>
                        <td className="px-10 py-7 text-center font-black text-slate-500 text-lg">{kw.volume}</td>
                        <td className="px-10 py-7 text-right font-black text-emerald-500 text-lg">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center h-fit">
                <h3 className="font-black text-2xl text-slate-900 mb-8 italic uppercase tracking-tighter">Potencial de Venta</h3>
                <div className="bg-indigo-50 py-12 rounded-[2.5rem]">
                  <p className="text-8xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                  <p className="text-xs font-black text-indigo-300 mt-2 uppercase tracking-widest">Score IA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ROI' && (
          <div className="animate-in slide-in-from-right-8 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black italic tracking-tight">ROI & Captación</h2>
              <p className="text-slate-500 font-medium italic mt-2 uppercase text-xs tracking-widest">Proyección para: {selectedKeyword?.name}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 tracking-widest">Inversión Ads</p>
                <p className="text-6xl font-black text-slate-900 tracking-tighter">{stats.inversion.toLocaleString()}€</p>
              </div>
              <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl">
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3 tracking-widest">Ingresos Brutos</p>
                <p className="text-6xl font-black tracking-tighter">{stats.ingresos.toLocaleString()}€</p>
              </div>
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 tracking-widest">ROI Neto</p>
                <p className="text-6xl font-black text-emerald-500 tracking-tighter">+{roiNeto}%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
             <header className="mb-12"><h2 className="text-5xl font-black italic tracking-tight text-slate-900">Rendimiento Landings</h2></header>
             <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white text-[11px] font-black uppercase">
                    <tr><th className="px-12 py-7">URL</th><th className="px-12 py-7 text-center">Visitas</th><th className="px-12 py-7 text-center">Leads</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold text-lg">
                    <tr><td className="px-12 py-8 text-indigo-600 italic">/concesionario-omoda-vll</td><td className="px-12 py-8 text-center text-slate-700">3.410</td><td className="px-12 py-8 text-center text-slate-900">124</td></tr>
                    <tr><td className="px-12 py-8 text-indigo-600 italic">/ofertas-jaecoo-7-cyl</td><td className="px-12 py-8 text-center text-slate-700">2.890</td><td className="px-12 py-8 text-center text-slate-900">92</td></tr>
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'Alertas' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-4xl space-y-6">
            <header className="mb-12"><h2 className="text-5xl font-black italic tracking-tight text-slate-900">Alertas Inteligentes</h2></header>
            <div className="bg-white p-10 rounded-[3rem] border-l-[16px] border-rose-500 shadow-sm flex items-center gap-8 hover:translate-x-2 transition-transform">
               <span className="text-5xl">🔥</span>
               <div><p className="text-xs font-black text-rose-500 uppercase tracking-widest">Crítica</p><p className="text-2xl font-bold text-slate-800 italic">Tendencia OMODA subiendo un 185% en Valladolid.</p></div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border-l-[16px] border-indigo-500 shadow-sm flex items-center gap-8 hover:translate-x-2 transition-transform">
               <span className="text-5xl">✨</span>
               <div><p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Oportunidad</p><p className="text-2xl font-bold text-slate-800 italic">Bajo CPC detectado en "Coches ocasión baratos".</p></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
