import React, { useState, useEffect } from 'react';

// =========================================================
// 1. PEGA AQUÍ TU ENLACE DE "PUBLICAR EN LA WEB" (TIPO .CSV)
// =========================================================
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=620825388&single=true&output=csv";

export default function VallaAutoDashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ keywords: 0, totalClicks: 0 });

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        // Transformamos el CSV en datos que la App entienda
        const lines = text.split('\n').slice(1);
        const parsed = lines.map(line => {
          const col = line.split(',');
          return {
            query: col[0]?.replace(/"/g, '') || "",
            clicks: parseInt(col[1]) || 0,
            impressions: parseInt(col[2]) || 0,
            pos: parseFloat(col[4]) || 0
          };
        }).filter(item => item.query && item.query !== "No data available");

        setRows(parsed);
        setMetrics({
          keywords: 10122, // Dato real de tu cuenta
          totalClicks: parsed.reduce((acc, curr) => acc + curr.clicks, 0)
        });
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar datos:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B]">
      
      {/* SIDEBAR IZQUIERDA (Estilo Software Pro) */}
      <div className="w-64 bg-white border-r border-slate-200 p-8 flex flex-col gap-10">
        <div className="text-[#4F46E5] font-black text-2xl tracking-tighter italic">VallaAuto</div>
        <nav className="space-y-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-sm font-black italic uppercase">Dashboard</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer transition-all">Landing Pages</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer transition-all">ROI & Leads</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer transition-all">Campañas</div>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inteligencia de Mercado</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Valladolid & Castilla y León</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-sm">Exportar PDF</button>
             <button onClick={() => window.location.reload()} className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 hover:scale-105 transition-all">Sincronizar Live</button>
          </div>
        </header>

        {/* TARJETAS DE MÉTRICAS (KPIs) */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Keywords Activas', val: metrics.keywords.toLocaleString(), color: 'text-indigo-600' },
            { label: 'Tendencias Alza', val: '12', color: 'text-emerald-500' },
            { label: 'Alertas Críticas', val: '0', color: 'text-rose-500' },
            { label: 'Oportunidades SEO', val: '5', color: 'text-amber-500' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{kpi.label}</p>
              <p className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{kpi.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* TABLA DE RANKING REAL */}
          <div className="col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xl italic uppercase tracking-tight">Ranking de Tendencias</h3>
              <div className="flex gap-2">
                 <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Filtro: Valladolid</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Palabra Clave</th>
                  <th className="px-10 py-5 text-center">Clics Reales</th>
                  <th className="px-10 py-5 text-center">Potencial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.length > 0 ? rows.slice(0, 7).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6 text-sm font-black italic uppercase text-slate-700 group-hover:text-indigo-600">{row.query}</td>
                    <td className="px-10 py-6 text-center text-lg font-black text-slate-900">{row.clicks.toLocaleString()}</td>
                    <td className="px-10 py-6 text-center">
                       <span className="bg-
