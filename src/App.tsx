import React, { useState, useEffect } from 'react';

// ==========================================
// 1. PEGA TU ENLACE AQUÍ ABAJO ENTRE LAS COMILLAS
// ==========================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?output=csv";

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Función para procesar el CSV que viene de Google Sheets
  const fetchAndParseData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, i) => {
          const val = values[i]?.trim();
          obj[header] = isNaN(Number(val)) ? val : Number(val);
        });
        return obj;
      }).filter(item => item.name); // Evita filas vacías

      setData(jsonData);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error("Error conectando con Google Sheets:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndParseData();
    const interval = setInterval(fetchAndParseData, 20000); // Se actualiza cada 20 segundos
    return () => clearInterval(interval);
  }, []);

  // Métricas calculadas en tiempo real desde tu Excel
  const stats = {
    results: data.length,
    trendMax: data.length > 0 ? Math.max(...data.map(d => d.trend || 0)) : 0,
    leadsTotal: data.reduce((acc, curr) => acc + (curr.leads || 0), 0),
    alertas: data.filter(d => d.trend > 100).length
  };

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black italic text-[#4F46E5] animate-pulse uppercase tracking-widest">Sincronizando con Google Sheets...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      
      {/* SIDEBAR - Navegación */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg italic">V</div>
          <h1 className="text-xl font-black italic">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {['Dashboard', 'Landings', 'ROI & Leads', 'Alertas'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">{activeTab}</h2>
            <p className="text-slate-400 font-medium italic">Datos reales conectados</p>
          </div>
          <div className="flex items-center gap-2 bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> CONEXIÓN LIVE
          </div>
        </header>

        {/* MÉTRICAS SUPERIORES (image_049343.png) */}
        <div className="grid grid-cols-4 gap-6 mb-10 text-center">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm shadow-indigo-100/20">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Resultados</p>
            <p className="text-5xl font-black text-[#4F46E5]">{stats.results}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Trend Max</p>
            <p className="text-5xl font-black text-[#10B981]">+{stats.trendMax}%</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Leads Est.</p>
            <p className="text-5xl font-black text-[#F43F5E]">{stats.leadsTotal}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Alertas</p>
            <p className="text-5xl font-black text-[#F59E0B]">{stats.alertas}</p>
          </div>
        </div>

        {/* CONTENIDO DASHBOARD (image_0e7903.png) */}
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 text-[#0F172A]">Ranking de Búsqueda Real</h3>
            <table className="w-full text-left font-bold italic">
              <thead className="text-[10px] text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <tr><th className="pb-6">Keyword</th><th className="pb-6 text-center">Búsquedas</th><th className="pb-6 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 text-sm uppercase tracking-tighter text-slate-700">{kw.name}</td>
                    <td className="py-6 text-center text-slate-400 font-black text-lg">{kw.volume}</td>
                    <td className="py-6 text-right text-[#10B981] font-black text-lg">+{kw.trend}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENIDO ROI (image_049303.png) */}
        {activeTab === 'ROI & Leads' && (
          <div className="grid grid-cols-3 gap-8 animate-in zoom-in">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black">306€</p>
              <p className="text-[10px] font-black text-slate-300 uppercase mt-4 italic">Inversión Estimada</p>
            </div>
            <div className="bg-[#4F46E5] p-12 rounded-[3rem] text-white shadow-xl text-center">
              <p className="text-5xl font-black">{stats.leadsTotal}</p>
              <p className="text-[10px] font-black opacity-60 uppercase mt-4 italic">Leads Reales</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm text-center">
              <p className="text-5xl font-black text-[#10B981]">3.600€</p>
              <p className="text-[10px] font-black text-slate-300 uppercase mt-4 italic">Retorno Bruto</p>
            </div>
          </div>
        )}

        {/* CONTENIDO LANDINGS (image_0ef1f9.png) */}
        {activeTab === 'Landings' && (
          <div className="bg-white p-32 rounded-[3rem] border border-slate-50 shadow-sm text-center italic">
            <p className="text-slate-300 font-black text-xl uppercase tracking-[0.2em]">Sincronizando con URLs de Search Console...</p>
          </div>
        )}
      </main>
    </div>
  );
}
