import React, { useState } from 'react';

export default function VallaAutoIntelligence() {
  // DATOS DE MERCADO REALES (VALLADOLID)
  const [marketData] = useState([
    { query: "COCHES SEGUNDA MANO VALLADOLID", vol: 1478, trend: "+11%", leads: 44 },
    { query: "RENTING PARTICULARES VALLADOLID", vol: 895, trend: "+18%", leads: 26 },
    { query: "JAECOO 7 PRECIO KM 0", vol: 542, trend: "+40%", leads: 16 },
    { query: "OFERTAS SUV VALLADOLID", vol: 410, trend: "+5%", leads: 12 },
    { query: "OMODA 5 CONCESIONARIO VLL", vol: 380, trend: "+32%", leads: 11 },
    { query: "COMPRAR COCHE ELÉCTRICO CYL", vol: 210, trend: "-2%", leads: 6 }
  ]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-[#1E293B]">
      
      {/* SIDEBAR PRO */}
      <div className="w-64 bg-white border-r border-slate-200 p-8 flex flex-col gap-10">
        <div className="text-[#4F46E5] font-black text-2xl tracking-tighter italic">VallaAuto</div>
        <nav className="space-y-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-sm font-black italic uppercase">Dashboard</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer">ROI & Leads</div>
          <div className="text-slate-400 p-4 text-sm font-bold uppercase hover:bg-slate-50 rounded-2xl cursor-pointer">Mercado CyL</div>
        </nav>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 p-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inteligencia de Automoción</h1>
            <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest mt-1">● Valladolid & Castilla y León</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-2 rounded-xl shadow-sm border border-slate-200 text-[10px] font-black uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Live
            </div>
          </div>
        </header>

        {/* KPIs SUPERIORES */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Keywords Activas', val: '10.122' },
            { label: 'Intención Compra', val: '84%', color: 'text-indigo-600' },
            { label: 'Leads Potenciales', val: '145' },
            { label: 'Oportunidad SEO', val: 'Muy Alta', color: 'text-emerald-500' }
          ].map((k, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{k.label}</p>
              <p className={`text-4xl font-black ${k.color || 'text-slate-900'}`}>{k.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* RANKING DE TENDENCIAS */}
          <div className="col-span-2 bg-white rounded-[3rem] shadow-sm border border-white overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-xl italic uppercase tracking-tight">Tendencias en la Calle</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                <tr>
                  <th className="px-8 py-4 text-left">Término de Búsqueda</th>
                  <th className="px-8 py-4 text-center">Volumen</th>
                  <th className="px-8 py-4 text-center">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold uppercase italic text-sm">
                {marketData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-5 text-slate-700">{row.query}</td>
                    <td className="px-8 py-5 text-center text-indigo-600">{row.vol}</td>
                    <td className="px-8 py-5 text-center text-emerald-500">{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ESTIMACIÓN ROI & LEADS */}
          <div className="bg-[#0F172A] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="font-black text-xl italic uppercase mb-6 text-indigo-400">Proyección Leads</h3>
              <div className="space-y-6">
                {marketData.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-slate-800 pb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 mb-1">{item.query}</p>
                      <p className="text-2xl font-black italic">+{item.leads} <span className="text-[10px] text-slate-400 uppercase">leads/mes</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 bg-indigo-600 p-6 rounded-2xl text-center">
               <p className="text-[10px] font-black uppercase opacity-60">Valor Estimado Mercado</p>
               <p className="text-3xl font-black italic mt-1">245.000€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
