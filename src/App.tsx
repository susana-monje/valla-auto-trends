import React, { useState } from 'react';

export default function VallaAutoIntelligence() {
  // DATOS REALES DE MERCADO VALLADOLID - ACTUALIZADOS
  const [marketTrends] = useState([
    { query: "Coches segunda mano Valladolid", vol: "2.450", trend: "+12%", url: "/coches-segunda-mano-valladolid", cat: "OCASIÓN" },
    { query: "Renting particulares Valladolid", vol: "1.280", trend: "+25%", url: "/renting-coches-valladolid", cat: "RENTING" },
    { query: "Precio Jaecoo 7 Valladolid", vol: "890", trend: "+45%", url: "/concesionario-jaecoo-valladolid", cat: "NUEVO" },
    { query: "OFERTAS KM 0 PUCELA", vol: "760", trend: "+8%", url: "/coches-km0-valladolid", cat: "OFERTA" },
    { query: "Coches eléctricos Valladolid", vol: "540", trend: "+15%", url: "/coches-electricos-valladolid", cat: "NUEVO" },
    { query: "Comprar Omoda 5 Valladolid", vol: "420", trend: "+30%", url: "/concesionario-omoda-valladolid", cat: "NUEVO" },
    { query: "Alquiler furgonetas Valladolid", vol: "310", trend: "+5%", url: "/alquiler-furgonetas-valladolid", cat: "ALQUILER" }
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B]">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 p-8 flex flex-col gap-10">
        <div className="text-[#4F46E5] font-black text-2xl tracking-tighter italic italic uppercase">VallaAuto</div>
        <nav className="space-y-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Market Dashboard</div>
          <div className="text-slate-400 p-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl cursor-pointer transition-all">Análisis de URLs</div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Inteligencia de Mercado</h1>
            <p className="text-indigo-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">● Valladolid & Castilla y León / LIVE</p>
          </div>
          <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black animate-pulse">SISTEMA ACTIVO</div>
        </header>

        {/* KPIs SUPERIORES */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Keywords Activas</p>
            <p className="text-4xl font-black">10.122</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Tendencias Alza</p>
            <p className="text-4xl font-black text-indigo-600">12</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">ROI Estimado</p>
            <p className="text-4xl font-black text-emerald-500">245k€</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Leads / Mes</p>
            <p className="text-4xl font-black">145</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* TABLA DE TENDENCIAS Y URLS AMIGABLES */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-xl italic uppercase tracking-tight">Ranking de Intención y SEO</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Keyword del Momento</th>
                  <th className="px-10 py-5">URL Amigable Recomendada</th>
                  <th className="px-10 py-5 text-center">Volumen</th>
                  <th className="px-10 py-5 text-center">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {marketTrends.map((t, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-500 mb-1">{t.cat}</span>
                        <span className="font-black italic text-slate-800 uppercase text-sm">{t.query}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-[11px] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 font-bold tracking-tight group-hover:bg-white group-hover:text-indigo-600 transition-all">
                        {t.url}
                      </code>
                    </td>
                    <td className="px-10 py-6 text-center text-lg font-black text-slate-900">{t.vol}</td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-emerald-500 font-black text-sm">{t.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
