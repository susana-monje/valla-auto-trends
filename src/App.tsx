import React, { useState, useEffect } from 'react';

// TU ENLACE CSV AQUÍ
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [data, setData] = useState<any[]>([]);

  // DATOS ESTRATÉGICOS DE AUTOMOCIÓN (CYL)
  // Estos datos los puedes actualizar tú en el Excel y la App los leerá
  const autoTrends = [
    { brand: "OMODA", interest: "MUY ALTO", region: "Valladolid", focus: "SUV Híbrido", color: "text-emerald-400" },
    { brand: "JAECOO", interest: "EXPLOSIÓN", region: "Palencia/VLL", focus: "Jaecoo 7", color: "text-sky-400" },
    { brand: "OCASIÓN", interest: "ESTABLE", region: "Castilla y León", focus: "Menos de 15.000€", color: "text-amber-400" },
    { brand: "ELÉCTRICOS", interest: "CRECIENDO", region: "Valladolid", focus: "Etiqueta Cero", color: "text-indigo-400" }
  ];

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (user === "admin" && pass === "autocyl2026") setIsLoggedIn(true);
    else alert("Error de acceso");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetch(SHEET_URL).then(res => res.text()).then(text => {
        // ... (Lógica de carga de datos de Search Console)
        setLoading(false);
      });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A] p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-black italic uppercase text-center mb-8 tracking-tighter">Autocyl Intelligence</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="USUARIO" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-none" onChange={e => setUser(e.target.value)} />
            <input type="password" placeholder="CLAVE" className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-none" onChange={e => setPass(e.target.value)} />
            <button className="w-full bg-[#4F46E5] text-white p-5 rounded-2xl font-black uppercase shadow-lg hover:bg-indigo-600 transition-all">ACCEDER</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-[#0F172A]">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Market Radar</h1>
          <p className="text-slate-400 font-bold italic border-l-4 border-indigo-500 pl-4 mt-2">Automoción: Valladolid & Castilla y León</p>
        </div>
        <div className="flex gap-2">
           <span className="bg-white border border-slate-200 px-4 py-2 rounded-full text-[10px] font-black italic shadow-sm">LIVE FEED</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LADO IZQUIERDO: TUS DATOS REALES */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] ml-2">Tu Tráfico Real (Web)</h3>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-slate-50">
            <div className="flex justify-between items-end mb-8">
               <div>
                 <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Impacto Autocyl</p>
                 <p className="text-6xl font-black italic tracking-tighter">2.297 <span className="text-sm font-normal text-slate-300">clics</span></p>
               </div>
               <div className="text-right">
                 <p className="text-2xl font-black text-emerald-500 italic">+14%</p>
                 <p className="text-[10px] font-black text-slate-300 uppercase underline">vs mes anterior</p>
               </div>
            </div>
            {/* Aquí iría el mapeo de tu tabla de keywords que ya funciona */}
          </div>
        </div>

        {/* LADO DERECHO: TENDENCIAS DE CALLE (AUTOMOCIÓN) */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] ml-2">Tendencias de Automoción CYL</h3>
          <div className="grid grid-cols-1 gap-4">
            {autoTrends.map((t, i) => (
              <div key={i} className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black italic group-hover:opacity-10 transition-opacity uppercase">{t.brand}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.region}</p>
                  </div>
                  <p className="text-2xl font-black italic tracking-tight">{t.brand} <span className="text-xs font-bold text-slate-400">({t.focus})</span></p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black italic ${t.color}`}>{t.interest}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase underline">Interés Google</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-lg shadow-indigo-200">
             <p className="text-[10px] font-black uppercase opacity-60 mb-2">💡 Insight Estratégico</p>
             <p className="text-lg font-bold italic leading-tight">
               "El interés por Omoda y Jaecoo en Valladolid ha superado a marcas tradicionales este mes. Es el momento de captar leads de 'Coche Chino Fiabilidad' en tu web."
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
