import React, { useState, useEffect } from 'react';

// ==========================================
// 1. TU ENLACE DE GOOGLE SHEETS (IMPORTANTE: Que sea el de la pestaña de Search Console)
// ==========================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n');
      
      // El complemento usa: Query, Clicks, Impressions, CTR, Position
      const headers = lines[0].split(',').map(h => h.trim().replaceAll('"', ''));
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          let val = values[i]?.replace(/"/g, '').trim();
          obj[h] = isNaN(Number(val)) ? val : Number(val);
        });
        return obj;
      }).filter(item => item.Query); // Filtramos por la columna Query que crea el complemento

      setData(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Error en la conexión live");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Se actualiza cada minuto
    return () => clearInterval(interval);
  }, []);

  // Cálculos reales basados en Autocyl
  const stats = {
    totalKeywords: data.length,
    totalClicks: data.reduce((acc, curr) => acc + (curr.Clicks || 0), 0),
    avgPosition: data.length > 0 ? (data.reduce((acc, curr) => acc + (curr.Position || 0), 0) / data.length).toFixed(1) : 0,
    topTrends: data.filter(d => d.Clicks > 10).length // Keywords con tracción real
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-black italic text-[#4F46E5] animate-pulse">
      CONECTANDO CON AUTOCYL SEARCH CONSOLE...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl italic shadow-lg">V</div>
          <h1 className="text-xl font-black italic">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {['Dashboard', 'SEO Real', 'Métricas'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Autocyl Intelligence</h2>
            <p className="text-slate-400 font-medium italic underline">Datos directos de Google Search Console</p>
          </div>
          <div className="bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full text-[10px] font-black border border-[#DCFCE7] animate-pulse">
            SISTEMA ACTIVO (LIVE)
          </div>
        </header>

        {/* METRICAS REALES */}
        <div className="grid grid-cols-4 gap-6 mb-10 text-center">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Keywords</p>
            <p className="text-5xl font-black text-[#4F46E5]">{stats.totalKeywords}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Clicks (30d)</p>
            <p className="text-5xl font-black text-[#10B981]">{stats.totalClicks}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Posición Media</p>
            <p className="text-5xl font-black text-[#F43F5E]">{stats.avgPosition}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Oportunidades</p>
            <p className="text-5xl font-black text-[#F59E0B]">{stats.topTrends}</p>
          </div>
        </div>

        {/* TABLA DE DATOS REALES */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
          <h3 className="text-2xl font-black italic uppercase mb-8">Ranking de Palabras Clave (Google)</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-300 uppercase font-black border-b border-slate-50">
                <th className="pb-4">Keyword</th>
                <th className="pb-4 text-center">Clicks</th>
                <th className="pb-4 text-center">Impresiones</th>
                <th className="pb-4 text-right">Posición</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.slice(0, 15).map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-all font-bold italic">
                  <td className="py-5 text-sm uppercase text-slate-700">{kw.Query}</td>
                  <td className="py-5 text-center text-[#4F46E5]">{kw.Clicks}</td>
                  <td className="py-5 text-center text-slate-400">{kw.Impressions}</td>
                  <td className="py-5 text-right text-slate-400">{Number(kw.Position).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
