import React, { useState } from 'react';

export default function SEOBuscadorVLL() {
  const [marca, setMarca] = useState('Todas');
  const [tipo, setTipo] = useState('Ocasión');

  // ESTO ES LO QUE VE GOOGLE: Generación de la URL Amigable
  const urlAmigable = `/${marca.toLowerCase()}-${tipo.toLowerCase()}-valladolid`.replace(/ /g, '-');

  const stockReal = [
    { id: 1, nombre: "Jaecoo 7", precio: "24.900€", tag: "Novedad" },
    { id: 2, nombre: "Omoda 5", precio: "22.500€", tag: "Top Ventas" },
    { id: 3, nombre: "Renault Captur", precio: "18.200€", tag: "KM 0" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER SEO */}
      <div className="bg-white border-b p-4 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vista previa de URL para Google:</p>
        <code className="text-indigo-600 font-bold text-sm">https://autocyl.es{urlAmigable}</code>
      </div>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 mb-10">
          <h2 className="text-3xl font-black italic uppercase mb-8">Buscador de Stock <span className="text-indigo-600">Pucela</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Marca</label>
              <select 
                onChange={(e) => setMarca(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold"
              >
                <option value="Todas">Todas las marcas</option>
                <option value="Jaecoo">Jaecoo</option>
                <option value="Omoda">Omoda</option>
                <option value="Renault">Renault</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Estado</label>
              <select 
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold"
              >
                <option value="Ocasión">Segunda Mano</option>
                <option value="KM0">KM 0</option>
                <option value="Renting">Renting</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-indigo-600 transition-all">
            Generar Oferta en Valladolid
          </button>
        </div>

        {/* RESULTADOS DINÁMICOS */}
        <div className="grid grid-cols-1 gap-4">
          {stockReal.map(coche => (
            <div key={coche.id} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div>
                <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">{coche.tag}</span>
                <h3 className="text-xl font-black italic uppercase mt-2">{coche.nombre}</h3>
                <p className="text-slate-400 text-xs">Disponible en Autocyl Valladolid</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">{coche.precio}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase">Ver detalles SEO</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
