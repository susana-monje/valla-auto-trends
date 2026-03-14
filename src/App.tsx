import React, { useState, useEffect } from 'react';

// ==========================================
// 1. PEGA AQUÍ TUS DOS ENLACES
// ==========================================
const LINK_CLICS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv"; // El de Search Analytics
const LINK_RADAR = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=1359996423&single=true&output=csv"; // El nuevo

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clicsData, setClicsData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Leemos los Clics
      const resClics = await fetch(LINK_CLICS);
      const textClics = await resClics.text();
      // (Aquí va la lógica de limpieza de clics que ya teníamos...)
      
      // Leemos el Radar
      const resRadar = await fetch(LINK_RADAR);
      const textRadar = await resRadar.text();
      const linesRadar = textRadar.split('\n').slice(1, 6); // Cogemos los 5 mejores
      const parsedRadar = linesRadar.map(line => {
        const title = line.split(',')[0].replace(/"/g, '').split(' - ')[0];
        let type = "COMPRA";
        if (title.toLowerCase().includes('alquiler')) type = "ALQUILER";
        if (title.toLowerCase().includes('renting')) type = "RENTING";
        return { title, type };
      });

      setRadarData(parsedRadar);
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (isLoggedIn) fetchData(); }, [isLoggedIn]);

  // Pantalla de Login (admin / autocyl2026)
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h2 className="text-xl font-black italic mb-6">AUTOCYL INTEL</h2>
          <button onClick={() => setIsLoggedIn(true)} className="bg-[#4F46E5] text-white px-8 py-4 rounded-2xl font-black uppercase">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Market Intelligence</h1>
        <p className="text-slate-400 font-bold italic border-l-4 border-indigo-500 pl-4 mt-2">Valladolid / Castilla y León</p>
      </header>

      <div className="grid grid-cols-2 gap-10">
        {/* IZQUIERDA: TUS CLICS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Tu Tráfico Web</h3>
          <p className="text-7xl font-black italic tracking-tighter">2.297</p>
          <p className="text-xs font-bold text-emerald-500 mt-2 uppercase italic">Posición media: 1.2</p>
        </div>

        {/* DERECHA: RADAR REAL (Lo que has pedido) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Lo que busca Pucela ahora</h3>
          {radarData.map((t, i) => (
            <div key={i} className="bg-[#0F172A] p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center border-l-8 border-indigo-500">
              <div className="max-w-[80%]">
                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{t.type}</p>
                <p className="text-sm font-black italic uppercase leading-tight">{t.title}</p>
              </div>
              <span className="text-emerald-400 font-black text-[10px] italic">LIVE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
