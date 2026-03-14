import React, { useState, useEffect } from 'react';

export default function VallaAutoDashboard() {
  // MATRIZ DE INTELIGENCIA: DATOS REALES DE MERCADO EN VALLADOLID
  const [marketData] = useState([
    { query: "AUTOCYL", vol: 1284, trend: "+7%", potential: "ALTO" },
    { query: "COCHES SEGUNDA MANO VALLADOLID", vol: 478, trend: "+11%", potential: "ALTO" },
    { query: "AUTOCYL VALLADOLID", vol: 262, trend: "+13%", potential: "ALTO" },
    { query: "COCHES SEGUNDA MANO", vol: 113, trend: "+12%", potential: "ALTO" },
    { query: "RENTING PARTICULARES VALLADOLID", vol: 95, trend: "+18%", potential: "MUY ALTO" },
    { query: "COCHES DE SEGUNDA MANO", vol: 60, trend: "+13%", potential: "ALTO" },
    { query: "JAECOO 7 PRECIO VALLADOLID", vol: 54, trend: "+40%", potential: "NUEVA MARCA" }
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B]">
      {/* SIDEBAR ESTILO SAAS */}
      <div className="w-64 bg-white border-r border-slate-100 p-8 flex flex-col gap-10">
        <div className="text-[#4F46E5] font-black text-2xl tracking-tighter italic">VallaAuto</div>
        <nav className="space-y-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-sm font-black italic uppercase">Dashboard</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer">Landing Pages</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer">ROI & Leads</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer">Campañas</div>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inteligencia de Mercado</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Valladolid & Castilla y León</p>
            </div>
          </div>
          <button className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 transition-transform hover:scale-105">Actualizar Mercado</button>
        </header>

        {/* KPIs SUPERIORES IGUALES A TU IMAGEN */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Keywords Activas', val: '10122', color: 'text-slate-900' },
            { label: 'Tendencias Alza', val: '12', color: 'text-indigo-600' },
            { label: 'Alertas Críticas', val: '0', color: 'text-slate-900' },
            { label: 'Oportunidades SEO', val: '5', color: 'text-indigo-400' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{kpi.label}</p>
              <p className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{kpi.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* TABLA DE RANKING DE TENDENCIAS (AUTOMOCIÓN VLL) */}
          <div className="col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-50 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xl italic uppercase tracking-tight text-slate-900">Ranking de Tendencias</h3>
              <div className="flex gap-2">
                 <span className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Todos</span>
                 <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Coches</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Palabra Clave</th>
                  <th className="px-10 py-5 text-center">Volumen</th>
                  <th className="px-10 py-5 text-center">Tendencia</th>
                  <th className="px-10 py-5 text-center">Potencial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {marketData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6 text-sm uppercase text-slate-600 group-hover:text-indigo-600">{row.query}</td>
                    <td className="px-10 py-6 text-center text-indigo-600">{row.vol}</td>
                    <td className="px-10 py-6 text-center text-emerald-500">{row.trend}</td>
                    <td className="px-10 py-6 text-center">
                       <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black">ALTO</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EVOLUCIÓN HISTÓRICA */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-10 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-xl italic uppercase tracking-tight">Evolución Histórica</h3>
              <span className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase italic">Live Sync</span>
            </div>
            <div className="flex-1 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex items-center justify-center p-8 text-center">
              <p className="text-slate-300 text-[10px] font-black uppercase italic leading-relaxed">
                Selecciona una keyword para ver la evolución del volumen de búsqueda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
