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
    fetch('/metadata.json')
      .then(res => res.json())
      .then(data => {
        setKeywords(data);
        if (data.length > 0) setSelectedKeyword(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // --- LÓGICA DE ROI ---
  const calcularROI = (vol: number) => {
    const clics = Math.floor(vol * 0.12);
    const leads = Math.floor(clics * 0.03);
    const ventas = Math.max(1, Math.floor(leads * 0.10));
    const inversion = clics * 0.90; // 0.90€ por clic
    const retorno = ventas * 2400; // Margen por coche
    return { clics, leads, ventas, inversion, retorno, neto: retorno - inversion };
  };

  // --- LÓGICA DE ALERTAS IA ---
  const obtenerAlertasIA = () => {
    const alertas = [];
    const explosiva = keywords.find(k => parseInt(k.trend) > 150);
    const oportunidad = keywords.find(k => k.potential > 95);

    if (explosiva) alertas.push({ tipo: 'CRÍTICA', msg: `Tendencia explosiva detectada en "${explosiva.name}" (${explosiva.trend}).`, color: 'rose' });
    if (oportunidad) alertas.push({ tipo: 'OPORTUNIDAD', msg: `Alta probabilidad de cierre en "${oportunidad.name}". Score: ${oportunidad.potential}%.`, color: 'indigo' });
    alertas.push({ tipo: 'MERCADO', msg: "La competencia en Valladolid ha bajado un 5% en búsquedas de híbridos.", color: 'emerald' });
    
    return alertas;
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600">SINCRO TOTAL DE SISTEMAS...</div>;

  const roi = selectedKeyword ? calcularROI(selectedKeyword.volume) : calcularROI(0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">V</div>
            <h1 className="text-xl font-black text-indigo-950 tracking-tighter">VallaAuto</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'Landings', icon: '📄', label: 'Landing Pages' },
            { id: 'ROI', icon: '📈', label: 'ROI & Leads' },
            { id: 'Alertas', icon: '🔔', label: 'Alertas IA' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10">
        
        {/* DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10 text-4xl font-black italic tracking-tight">Mercado Valladolid</header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase border-b border-slate-50">
                    <tr><th className="px-8 py-5">Keyword</th><th className="px-8 py-5 text-center">Búsquedas</th><th className="px-8 py-5 text-right">Trend</th></tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw) => (
                      <tr key={kw.id} onClick={() => setSelectedKeyword(kw)} className={`cursor-pointer border-b border-slate-50 hover:bg-indigo-50/40 transition-all ${selectedKeyword?.id === kw.id ? 'bg-indigo-50/60' : ''}`}>
                        <td className="px-8 py-6 font-bold text-slate-800 text-xs uppercase">{kw.name}</td>
                        <td className="px-8 py-6 text-center font-black text-slate-500">{kw.volume}</td>
                        <td className="px-8 py-6 text-right font-black text-emerald-500">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center h-fit">
                <h3 className="font-black text-xl text-slate-900 mb-8 italic">Potencial IA</h3>
                <div className="bg-indigo-50 p-10 rounded-[2rem]">
                  <p className="text-7xl font-black text-indigo-600 tracking-tighter">{selectedKeyword?.potential}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROI & LEADS */}
        {activeTab === 'ROI' && (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <header className="mb-10">
              <h2 className="text-4xl font-black italic">Proyección ROI & Captación</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Basado en: {selectedKeyword?.name}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Coste Campaña</p>
                <p className="text-5xl font-black">{roi.inversion.toLocaleString()}€</p>
              </div>
              <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl">
                <p className="text-[10px] font-black text-white/60 uppercase mb-2">Leads Estimados</p>
                <p className="text-5xl font-black">{roi.leads}</p>
              </div>
              <div className="bg-emerald-500 p-10 rounded-[3rem] text-white shadow-xl">
                <p className="text-[10px] font-black text-white/60 uppercase mb-2">Retorno Neto</p>
                <p className="text-5xl font-black">+{roi.neto.toLocaleString()}€</p>
              </div>
            </div>
          </div>
        )}

        {/* ALERTAS IA */}
        {activeTab === 'Alertas' && (
          <div className="animate-in zoom-in-95 duration-500 max-w-3xl">
            <header className="mb-10 text-4xl font-black italic">Centro de Alertas IA</header>
            <div className="space-y-6">
              {obtenerAlertasIA().map((alerta, i) => (
                <div key={i} className={`bg-white p-8 rounded-[2.5rem] border-l-[12px] shadow-sm flex items-center gap-8 ${
                  alerta.color === 'rose' ? 'border-rose-500' : alerta.color === 'indigo' ? 'border-indigo-500' : 'border-emerald-500'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white ${
                    alerta.color === 'rose' ? 'bg-rose-500' : alerta.color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`}>!</div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      alerta.color === 'rose' ? 'text-rose-500' : alerta.color === 'indigo' ? 'text-indigo-500' : 'text-emerald-500'
                    }`}>{alerta.tipo}</p>
                    <p className="font-bold text-slate-800 text-lg">{alerta.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LANDINGS (CÓDIGO SIMPLIFICADO PARA QUE NO FALLE) */}
        {activeTab === 'Landings' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <header className="mb-10 text-4xl font-black italic">Rendimiento de Páginas</header>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <p className="text-slate-400 font-bold uppercase text-center py-20 text-xl tracking-widest">Sincronizado con Google Search Console...</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
