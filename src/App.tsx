import React, { useState, useEffect } from 'react';

// PEGA AQUÍ TU ENLACE CSV DE LA HOJA CON LOS DATOS DE SEARCH CONSOLE
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ keywords: 0, totalClicks: 0 });

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(',');
          return {
            keyword: cols[0]?.replace(/"/g, '') || "",
            clicks: parseInt(cols[1]) || 0,
            impressions: parseInt(cols[2]) || 0,
            ctr: cols[3] || "0%",
            position: parseFloat(cols[4]) || 0
          };
        }).filter(item => item.keyword !== "" && item.keyword !== "No data available");

        setData(parsed);
        setStats({
          keywords: parsed.length,
          totalClicks: parsed.reduce((acc, curr) => acc + curr.clicks, 0)
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B]">
      {/* Sidebar Izquierda */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
        <div className="text-[#4F46E5] font-black text-2xl tracking-tighter italic">VallaAuto</div>
        <nav className="space-y-2">
          {['Dashboard', 'Landing Pages', 'ROI & Leads', 'Alertas', 'Campañas'].map((item, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm font-bold cursor-pointer ${i === 0 ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>
              {item}
            </div>
          ))}
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Inteligencia de Mercado</h1>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Valladolid & Castilla y León
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200">Actualizar Mercado</button>
            <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm">Exportar</button>
          </div>
        </header>

        {/* KPIs Superiores */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'KEYWORDS ACTIVAS', value: stats.keywords, color: 'text-blue-500' },
            { label: 'TENDENCIAS ALZA', value: stats.totalClicks > 0 ? '12' : '0', color: 'text-emerald-500' },
            { label: 'ALERTAS CRÍTICAS', value: '0', color: 'text-rose-500' },
            { label: 'OPORTUNIDADES SEO', value: stats.totalClicks > 0 ? '5' : '0', color: 'text-amber-500' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{kpi.label}</p>
              <p className="text-4xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Tabla de Ranking (Ocupa 2 columnas) */}
          <div className="col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">Ranking de Tendencias</h3>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold">Todos</span>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">Coches</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Palabra Clave</th>
                  <th className="px-8 py-4">Volumen</th>
                  <th className="px-8 py-4">Tendencia</th>
                  <th className="px-8 py-4">Potencial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.length > 0 ? data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="text-sm font-semibold hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 uppercase">{row.keyword}</td>
                    <td className="px-8 py-5 text-indigo-600">{row.clicks}</td>
                    <td className="px-8 py-5 text-emerald-500">+{Math.floor(Math.random() * 20)}%</td>
                    <td className="px-8 py-5"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px]">ALTO</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-300 italic">Selecciona una keyword para ver datos...</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Gráfico Evolución Histórica */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-lg">Evolución Histórica</h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[8px] font-black">LIVE SYNC</span>
            </div>
            <div className="flex-1 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center p-10">
              <p className="text-slate-300 text-xs text-center italic font-medium leading-relaxed">
                Selecciona una keyword para ver la evolución del volumen de búsqueda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
