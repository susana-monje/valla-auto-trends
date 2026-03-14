import React, { useState, useEffect } from 'react';

// ==========================================
// CONFIGURACIÓN DE ACCESO Y DATOS
// ==========================================
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv"; 
const USER_AUTH = "admin"; // <--- Cambia tu usuario
const PASS_AUTH = "autocyl2026"; // <--- Cambia tu contraseña

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lógica de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === USER_AUTH && pass === PASS_AUTH) {
      setIsLoggedIn(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/[中心"]/g, ''));
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj: any = {};
        headers.forEach((h, i) => {
          let val = values[i]?.replace(/"/g, '').trim() || "";
          if (h === "Clicks" || h === "Impressions" || h === "Position") {
            let cleanNum = val.replace(',', '.'); 
            obj[h] = isNaN(Number(cleanNum)) ? 0 : Number(cleanNum);
          } else {
            obj[h] = val;
          }
        });
        return obj;
      }).filter(item => item.Query && item.Query.length < 100);

      setData(parsed);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const totalClicks = data.reduce((acc, curr) => acc + (curr.Clicks || 0), 0);
  const avgPos = data.length > 0 ? (data.reduce((acc, curr) => acc + (curr.Position || 0), 0) / data.length).toFixed(1) : "0.0";

  // PANTALLA DE LOGIN
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A] p-6">
        <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#4F46E5] rounded-2xl flex items-center justify-center text-white font-black text-4xl italic mb-4">V</div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#0F172A]">Autocyl Access</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Intelligence Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" placeholder="USUARIO" 
              className="w-full p-5 bg-slate-50 rounded-2xl border-none font-black italic text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setUser(e.target.value)}
            />
            <input 
              type="password" placeholder="CONTRASEÑA" 
              className="w-full p-5 bg-slate-50 rounded-2xl border-none font-black italic text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setPass(e.target.value)}
            />
            <button className="w-full bg-[#4F46E5] text-white p-5 rounded-2xl font-black italic uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
              Entrar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic text-[#4F46E5] animate-pulse">CARGANDO BASE DE DATOS...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-[#0F172A]">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print { .no-print { display: none !important; } .print-area { box-shadow: none !important; border: none !important; } }
      `}} />

      <header className="mb-12 flex justify-between items-start no-print">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Autocyl Dashboard</h1>
          <p className="text-slate-400 font-bold italic border-l-4 border-[#4F46E5] pl-4 mt-2 uppercase text-xs">Acceso autorizado: {user}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.print()} className="bg-white text-[#0F172A] border border-slate-200 px-6 py-4 rounded-2xl font-black italic text-xs hover:bg-slate-50 transition-all shadow-sm">
            📄 EXPORTAR PDF
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="bg-rose-50 text-rose-500 px-6 py-4 rounded-2xl font-black italic text-xs hover:bg-rose-100 transition-all">
            SALIR
          </button>
        </div>
      </header>

      {/* DASHBOARD REAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Keywords</p>
          <p className="text-6xl font-black text-[#4F46E5] italic">{data.length}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Clicks (30d)</p>
          <p className="text-6xl font-black text-[#10B981] italic">{totalClicks}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Posición Media</p>
          <p className="text-6xl font-black text-[#F43F5E] italic">{avgPos}</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50">
        <h3 className="text-2xl font-black italic uppercase mb-10">Ranking de Búsqueda</h3>
        <table className="w-full text-left font-bold italic">
          <thead className="text-[10px] font-black text-slate-300 uppercase border-b border-slate-50">
            <tr><th className="pb-6">Keyword</th><th className="pb-6 text-center">Clicks</th><th className="pb-6 text-right">Posición</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.slice(0, 15).map((row, i) => (
              <tr key={i}>
                <td className="py-5 text-sm uppercase text-slate-700">{row.Query}</td>
                <td className="py-5 text-center text-[#4F46E5]">{row.Clicks}</td>
                <td className={`py-5 text-right ${row.Position <= 3 ? 'text-emerald-500' : 'text-slate-400'}`}>{row.Position.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
