import React, { useState } from 'react';

export default function MotorMatchVLL() {
  const [marca, setMarca] = useState('Todas');
  const [tipo, setTipo] = useState('Ocasión');

  // DINÁMICA DE TÍTULOS SEO: Esto es lo que Google posiciona
  const tituloSEO = `${tipo === 'Todas' ? 'Coches' : tipo} ${marca === 'Todas' ? '' : marca} en Valladolid`;
  const urlAmigable = `/${marca.toLowerCase()}-${tipo.toLowerCase()}-valladolid`.replace(/Todas-/g, '');

  const vehiculos = [
    { id: 1, marca: "Jaecoo", modelo: "7", precio: "24.900€", tag: "Novedad", desc: "Entrega inmediata en Valladolid" },
    { id: 2, marca: "Omoda", modelo: "5", precio: "22.500€", tag: "Top Ventas", desc: "Mejor cuota de renting CyL" },
    { id: 3, marca: "Renault", modelo: "Captur", precio: "18.200€", tag: "KM 0", desc: "Garantía Autocyl oficial" }
  ];

  // Filtro real para que la app funcione de verdad
  const filtrados = vehiculos.filter(v => 
    (marca === 'Todas' || v.marca === marca)
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* BARRA DE ESTADO SEO - PARA TU CONTROL */}
      <div className="bg-indigo-600 text-white p-2 text-[10px] font-black uppercase text-center tracking-widest">
        Target SEO: {tituloSEO} | URL: {urlAmigable}
      </div>

      <header className="p-12 bg-white border-b border-slate-200 mb-10">
        <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter">
          {tipo} <span className="text-indigo-600">{marca === 'Todas' ? 'Multimarca' : marca}</span> <br/> 
          en Valladolid
        </h1>
        <p className="mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
          Stock real verificado por Autocyl
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 mb-12 -mt-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Selecciona Marca</label>
              <select 
                onChange={(e) => setMarca(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-2xl border-none font-black text-lg outline-indigo-500 appearance-none shadow-inner"
              >
                <option value="Todas">Todas las Marcas</option>
                <option value="Jaecoo">Jaecoo</option>
                <option value="Omoda">Omoda</option>
                <option value="Renault">Renault</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Modalidad de Compra</label>
              <select 
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-2xl border-none font-black text-lg outline-indigo-500 appearance-none shadow-inner"
              >
                <option value="Ocasión">Segunda Mano</option>
                <option value="Renting">Renting</option>
                <option value="KM0">Kilómetro 0</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black uppercase italic tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
            Ver disponibilidad en Valladolid
          </button>
        </div>

        {/* LISTADO DINÁMICO */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Resultados para {marca} en {tipo}</h3>
          {filtrados.map(coche => (
            <div key={coche.id} className="bg-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="flex flex-col gap-2">
                <span className="w-fit text-[9px] font-black bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-widest">{coche.tag}</span>
                <h3 className="text-3xl font-black italic uppercase italic group-hover:text-indigo-600 transition-colors">{coche.marca} {coche.modelo}</h3>
                <p className="text-slate-400 font-bold text-sm italic">{coche.desc}</p>
              </div>
              <div className="text-center md:text-right mt-6 md:mt-0 bg-slate-50 md:bg-transparent p-6 md:p-0 rounded-3xl w-full md:w-auto">
                <p className="text-4xl font-black text-slate-900">{coche.precio}</p>
                <button className="mt-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest border-b-2 border-indigo-600">Me interesa</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
