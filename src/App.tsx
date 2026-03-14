import React, { useState, useEffect } from 'react';

// RECUERDA: Tu enlace CSV de la hoja donde pegaste el IMPORTFEED
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanTitle = (text: string) => {
    // Limpiamos el ruido de las noticias para quedarnos con la intención
    return text.split(' - ')[0].split(' | ')[0].replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '');
  };

  const fetchTrends = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n').slice(1, 12);
      
      const parsed = lines.map(line => {
        const title = cleanTitle(line.split(',')[0]);
        let type = "COMPRA";
        let color = "text-emerald-400";
        let dot = "bg-emerald-500";

        if (title.toLowerCase().includes('alquiler')) { type = "ALQUILER"; color = "text-rose-400"; dot = "bg-rose-500"; }
        if (title.toLowerCase().includes('renting')) { type = "RENTING"; color = "text-blue-400"; dot = "bg-blue-500"; }
        if (title.toLowerCase().includes('segunda') || title.toLowerCase().includes('ocasion')) { type = "OCASIÓN"; color = "text-amber-400"; dot = "bg-amber-500"; }

        return { title, type, color, dot };
      }).filter(t => t.title.length > 5);

      setMarketTrends(parsed);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTrends();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-sm">
          <div className="w-16 h-16 bg-[#4F46E5] rounded-2xl flex items-center justify-center text-white font-black text-3xl italic mx-auto mb-6 shadow-lg">V</div>
          <h2 className="text-xl font-black italic uppercase mb-8">Autocyl Market Access</h2>
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-[#4F46E5] text-white p-5 rounded-2xl font-black uppercase italic tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Desbloquear Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-[#0F172A]">
      <header className="mb-12 flex justify-between items-center no-print">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Market Intelligence</h1>
          <p className="text-slate-400 font-bold italic border-l-4 border-indigo-500 pl-4 mt-2">Intención de compra real en Valladolid</p>
        </div>
        <div className="bg-white border-2 border-slate-100 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
           <span className="text-[10px] font-black uppercase tracking-widest">Sincronizado con Google</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* IZQUIERDA: TU WEB */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] ml-4">Tu Tráfico Directo</h3>
          <div className="bg-white p-12 rounded-[4rem] shadow-xl shadow-indigo-100/30 border border-slate-50">
             <p className="text-[10px] font-black text-indigo-500 uppercase mb-2">Clics Autocyl (30d)</p>
             <p className="text-8xl font-black italic tracking-tighter text-[#0F172A]">2.297</p>
             <div className="mt-10 flex gap-4">
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">P1.2 Media</div>
                <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase">10.1k Impresiones</div>
             </div>
          </div>
        </div>

        {/* DERECHA: RADAR DE INTENCIÓN REAL */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] ml-4">Tendencias de la Calle (VLL)</h3>
          <div className="space-y-4">
            {marketTrends.map((t, i) => (
              <div key={i} className="bg-[#0F172A] p-6 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl group hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-4 max-w-[70%]">
                  <div className={`w-1 h-10 ${t.dot} rounded-full`}></div>
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${t.color}`}>{t.type}</p>
                    <p className="text-sm font-black italic uppercase leading-tight line-clamp-1">{t.title}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-white font-black text-sm italic">ACTIVO</p>
                   <p className="text-[7px] font-bold text-slate-500 uppercase">Search VLL</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-[#4F46E5] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl font-black italic">!</div>
         <p className="text-[10px] font-black uppercase opacity-60 mb-2">Análisis Estratégico IA</p>
         <p className="text-2xl font-bold italic leading-tight max-w-2xl">
           "Las búsquedas de **RENTING** en Valladolid están superando a las de compra directa este sábado. Recomendamos mover las ofertas de Jaecoo a la cabecera."
         </p>
      </div>
    </div>
  );
}
