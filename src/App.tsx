import React, { useState, useEffect } from 'react';

// ==========================================
// PEGA AQUÍ TU ENLACE CSV DE LA PESTAÑA "SAS..."
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
      const headers = lines[0].split(',').map(h => h.trim().replaceAll('"', ''));
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          let val = values[i]?.replace(/"/g, '').trim();
          obj[h] = isNaN(Number(val)) ? val : Number(val);
        });
        return obj;
      }).filter(item => item.Query);

      setData(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Error en conexión live");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    clicks: data.reduce((acc, c) => acc + (c.Clicks || 0), 0),
    avgPos: (data.reduce((acc, c) => acc + (c.Position || 0), 0) / data.length).toFixed(1),
    // Alerta: Keywords que están perdiendo la primera página (Posición > 10)
    alerts: data.filter(d => d.Position > 10 && d.Clicks > 5)
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black italic text-[#4F46E5] uppercase tracking-widest">Sincronizando Autocyl Live...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl italic">V</div>
          <h1 className="text-xl font-black italic">VallaAuto</h1>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {['Dashboard', 'SEO Alerts', 'Analytics'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-400 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Autocyl Dashboard</h2>
            <p className="text-slate-400 font-medium italic">Datos reales: Valladolid & Castilla y León</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black border border-emerald-100 uppercase">Search Console Live</div>
          </div>
        </header>

        {/* METRICAS SUPERIORES */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Clics Totales</p>
            <p className="text-5xl font-black text-[#4F46E5]">{stats.clicks}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Posición Media</p>
            <p className="text-5xl font-black text-[#10B981]">{stats.avgPos}</p>
          </div>
          <div className="bg-[#F43F5E] p-8 rounded-[2rem] shadow-lg text-white">
            <p className="text-[10px] font-black opacity-60 uppercase mb-2">Alertas SEO</p>
            <p className="text-5xl font-black">{stats.alerts.length}</p>
          </div>
        </div>

        {/* CONTENIDO SEGÚN PESTAÑA */}
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
            <h3 className="text-2xl font-black italic uppercase mb-8">Top Keywords Autocyl</h3>
            <table className="w-full text-left font-bold italic">
              <thead>
                <tr className="text-[10px] text-slate-300 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-6">Keyword</th>
                  <th className="pb-6 text-center">Clicks</th>
                  <th className="pb-6 text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.slice(0, 10).map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-all">
                    <td className="py-6 text-sm uppercase text-slate-700">{kw.Query}</td>
                    <td className="py-6 text-center text-[#4F46E5] text-lg">{kw.Clicks}</td>
                    <td className={`py-6 text-right text-lg ${kw.Position > 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {Number(kw.Position).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'SEO Alerts' && (
          <div className="space-y-4">
            {stats.alerts.map((al, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border-l-8 border-rose-500 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-rose-500 uppercase">Caída de Posición</p>
                  <p className="text-xl font-black italic uppercase">{al.Query}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-700">P{Number(al.Position).toFixed(1)}</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Fuera de Top 10</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
