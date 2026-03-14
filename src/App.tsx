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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalClicks = data.reduce((acc, curr) => acc + (curr.Clicks || 0), 0);
  const avgPos = data.length > 0 ? (data.reduce((acc, curr) => acc + (curr.Position || 0), 0) / data.length).toFixed(1) : "0.0";

  // Función para imprimir/PDF
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic text-[#4F46E5] animate-pulse">GENERANDO INTERFAZ DE AUTOCYL...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-[#0F172A]">
      {/* ESTILOS PARA EL PDF */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-area { box-shadow: none !important; border: none !important; width: 100% !important; }
          .grid { grid-template-cols: repeat(3, 1fr) !important; display: flex !important; gap: 10px !important; }
          .card { border: 1px solid #eee !important; flex: 1; }
        }
      `}} />

      <header className="mb-12 flex justify-between items-start print-area">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Autocyl Intelligence</h1>
          <p className="text-slate-400 font-bold italic border-l-4 border-[#4F46E5] pl-4 mt-2">Informe de Rendimiento en Tiempo Real</p>
        </div>
        <button 
          onClick={handlePrint}
          className="no-print bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black italic text-sm hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
        >
          📄 GENERAR INFORME PDF
        </button>
      </header>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 print-area">
        <div className="card bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Keywords</p>
          <p className="text-6xl font-black text-[#4F46E5] italic">{data.length}</p>
        </div>
        <div className="card bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Clicks (30d)</p>
          <p className="text-6xl font-black text-[#10B981] italic">{totalClicks}</p>
        </div>
        <div className="card bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Posición Media</p>
          <p className="text-6xl font-black text-[#F43F5E] italic">{avgPos}</p>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 print-area">
        <h3 className="text-2xl font-black italic uppercase mb-10">Ranking Search Console</h3>
        <table className="w-full text-left font-bold italic">
          <thead>
            <tr className="text-[10px] font-black text-slate-300 uppercase border-b border-slate-50">
              <th className="pb-6">Keyword</th>
              <th className="pb-6 text-center">Clicks</th>
              <th className="pb-6 text-right">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.slice(0, 15).map((row, i) => (
              <tr key={i}>
                <td className="py-5 text-sm uppercase text-slate-700">{row.Query}</td>
                <td className="py-5 text-center text-[#4F46E5]">{row.Clicks}</td>
                <td className="py-5 text-right text-slate-400">{row.Position.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <footer className="mt-10 text-[10px] font-black text-slate-300 uppercase text-center print-area">
        Autocyl Intelligence System — {new Date().toLocaleDateString()} — Valladolid, España
      </footer>
    </div>
  );
}
