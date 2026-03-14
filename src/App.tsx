import React, { useState, useEffect } from 'react';

// RECUERDA: Usa tu enlace CSV de la pestaña SAS_...
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n');
      
      // Limpiamos los encabezados
      const headers = lines[0].split(',').map(h => h.trim().replace(/[中心"]/g, ''));
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split avanzado para evitar errores con comas
        const obj: any = {};
        
        headers.forEach((h, i) => {
          let val = values[i]?.replace(/"/g, '').trim() || "";
          
          // LIMPIEZA DE NÚMEROS (Convierte "1,2" en 1.2)
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
      console.error("Error cargando datos reales");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cálculos limpios para Autocyl
  const totalClicks = data.reduce((acc, curr) => acc + (curr.Clicks || 0), 0);
  const avgPos = data.length > 0 
    ? (data.reduce((acc, curr) => acc + (curr.Position || 0), 0) / data.length).toFixed(1) 
    : "0.0";

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic text-[#4F46E5] animate-pulse uppercase tracking-widest">Sincronizando Autocyl Intelligence...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans text-[#0F172A]">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Autocyl Intelligence</h1>
          <p className="text-slate-400 font-bold italic border-l-4 border-[#4F46E5] pl-4 mt-2">Dashboard de Rendimiento Real</p>
        </div>
        <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em]">LIVE DATA</div>
      </header>

      {/* MÉTRICAS REALES (image_140c98.png corregida) */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Keywords Activas</p>
          <p className="text-7xl font-black text-[#4F46E5] italic tracking-tighter">{data.length}</p>
        </div>
        <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Clics Totales</p>
          <p className="text-7xl font-black text-[#10B981] italic tracking-tighter">{totalClicks}</p>
        </div>
        <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Posición Media</p>
          <p className="text-7xl font-black text-[#F43F5E] italic tracking-tighter">{avgPos}</p>
        </div>
      </div>

      {/* TABLA DE RANKING (image_141839.png) */}
      <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-50">
        <h3 className="text-2xl font-black italic uppercase mb-10 tracking-tight">Ranking de Búsqueda Google</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
              <th className="pb-8">Palabra Clave</th>
              <th className="pb-8 text-center">Clics</th>
              <th className="pb-8 text-right">Posición</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.slice(0, 12).map((row, i) => (
              <tr key={i} className="group hover:bg-slate-50 transition-all cursor-default">
                <td className="py-7 font-bold italic text-slate-700 uppercase text-sm tracking-tight">{row.Query}</td>
                <td className="py-7 text-center font-black text-[#4F46E5] text-xl">{row.Clicks}</td>
                <td className={`py-7 text-right font-black text-xl ${row.Position <= 3 ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {row.Position.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
