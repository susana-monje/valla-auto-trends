import React, { useState, useEffect } from 'react';

// 1. PEGA AQUÍ TU ENLACE CSV (El que termina en output=csv)
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=620825388&single=true&output=csv";

export default function VallaAuto() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').slice(1);
        const parsed = rows.map(row => {
          const col = row.split(',');
          return {
            query: col[0]?.replace(/"/g, '') || "",
            clicks: col[2]?.replace(/\./g, '') || "0", // Columna C en tu imagen
            trend: Math.floor(Math.random() * 15) + 2 // Simulación de tendencia
          };
        }).filter(item => item.query && item.query !== "No data available").slice(0, 6);
        
        setData(parsed);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] p-8">
      {/* Sidebar y Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Inteligencia de Mercado</h1>
          <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-1">● Valladolid & Castilla y León</p>
        </div>
        <button className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100">Actualizar Mercado</button>
      </div>

      {/* KPIs Superiores (Como en tu imagen 093dda.png) */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 uppercase">Keywords Activas</p>
          <p className="text-4xl font-bold uppercase">10122</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 text-indigo-600">
          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 uppercase">Tendencias Alza</p>
          <p className="text-4xl font-bold">12</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 uppercase">Alertas Críticas</p>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 text-indigo-400">
          <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2 uppercase">Oportunidades SEO</p>
          <p className="text-4xl font-bold">5</p>
        </div>
      </div>

      {/* Tabla de Ranking Real (Leyendo tu imagen 0944fc.png) */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg">Ranking de Tendencias</h3>
            <div className="flex gap-2">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight">Coches</span>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase">
              <tr>
                <th className="px-8 py-4">Palabra Clave</th>
                <th className="px-8 py-4 text-center">Volumen</th>
                <th className="px-8 py-4 text-center">Tendencia</th>
                <th className="px-8 py-4 text-center">Potencial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors uppercase font-bold text-sm">
                  <td className="px-8 py-5 text-slate-700">{row.query}</td>
                  <td className="px-8 py-5 text-center text-indigo-600">{row.clicks}</td>
                  <td className="px-8 py-5 text-center text-emerald-500">+{row.trend}%</td>
                  <td className="px-8 py-5 text-center"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px]">ALTO</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evolución Histórica */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 p-8">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-lg">Evolución Histórica</h3>
              <span className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black tracking-widest">LIVE SYNC</span>
           </div>
           <div className="h-64 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex items-center justify-center p-8 text-center">
              <p className="text-slate-300 text-[10px] font-bold uppercase italic leading-relaxed">
                Selecciona una keyword para ver la evolución del volumen de búsqueda
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
