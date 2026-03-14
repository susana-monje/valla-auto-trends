import React, { useState, useEffect } from 'react';

// RECUERDA: Tu enlace CSV de la pestaña SAS_...
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSXXeQRMABwfyyvMrWXQr3IDHafpwkt9lgpHWoTQI1yUKm1DUKSD8n6SfolW1xzzJnM_5D5lGFXphs/pub?gid=91182897&single=true&output=csv";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      const lines = text.split('\n');
      
      // Limpiamos los encabezados de comillas raras
      const headers = lines[0].split(',').map(h => h.trim().replace(/[中心"]/g, ''));
      
      const parsed = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          let val = values[i]?.replace(/"/g, '').trim() || "";
          // Convertimos a número solo si es un valor corto y numérico
          if (val.length < 15 && !isNaN(Number(val.replace(',', '.')))) {
            obj[h] = Number(val.replace(',', '.'));
          } else {
            obj[h] = val;
          }
        });
        return obj;
      }).filter(item => item.Query && item.Query.length < 100); // Filtramos ruidos

      setData(parsed);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cálculos protegidos contra errores de texto (NaN)
  const stats = {
    keywords: data.length,
    clicks: data.reduce((acc, curr) => acc + (Number(curr.Clicks) || 0), 0),
    pos: data.length > 0 
      ? (data.reduce((acc, curr) => acc + (Number(curr.Position) || 0), 0) / data.length).toFixed(1) 
      : "0"
  };

  if (loading) return <div className="p-20 font-black italic text-[#4F46E5] animate-pulse">LIMPIANDO DATOS DE AUTOCYL...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic uppercase text-[#0F172A]">Autocyl Intelligence</h1>
        <div className="h-1 w-20 bg-[#4F46E5] mt-2"></div>
      </header>

      {/* TARJETAS LIMPIAS */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Keywords Activas</p>
          <p className="text-6xl font-black text-[#4F46E5] italic">{stats.keywords}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Clics Totales</p>
          <p className="text-6xl font-black text-[#10B981] italic">{stats.clicks}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Posición Media</p>
          <p className="text-6xl font-black text-[#F43F5E] italic">{stats.pos}</p>
        </div>
      </div>

      {/* TABLA DE CONTROL */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-300 uppercase border-b border-slate-50">
              <th className="pb-6">Palabra Clave</th>
              <th className="pb-6 text-center">Clics</th>
              <th className="pb-6 text-right">Posición</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                <td className="py-6 font-bold italic text-slate-700 uppercase text-sm">{row.Query}</td>
                <td className="py-6 text-center font-black text-[#4F46E5]">{row.Clicks}</td>
                <td className="py-6 text-right font-black text-slate-400">{Number(row.Position).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
