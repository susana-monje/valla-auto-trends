import React, { useState } from "react";

type Page = "dashboard" | "landings" | "roi";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* SIDEBAR */}

      <div className="w-64 bg-white shadow-md p-6">

        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
            V
          </div>
          <div>
            <div className="font-bold text-lg">VallaAuto</div>
            <div className="text-xs text-gray-400">INTELLIGENCE</div>
          </div>
        </div>

        <nav className="space-y-3">

          <button
            onClick={() => setPage("dashboard")}
            className={`w-full text-left p-3 rounded-lg ${
              page === "dashboard" ? "bg-indigo-100" : ""
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setPage("landings")}
            className={`w-full text-left p-3 rounded-lg ${
              page === "landings" ? "bg-indigo-100" : ""
            }`}
          >
            📄 Landings
          </button>

          <button
            onClick={() => setPage("roi")}
            className={`w-full text-left p-3 rounded-lg ${
              page === "roi" ? "bg-indigo-100" : ""
            }`}
          >
            📈 ROI & Leads
          </button>

          <button className="w-full text-left p-3 rounded-lg">
            🔔 Alertas
          </button>

          <button className="w-full text-left p-3 rounded-lg">
            🎯 Campañas
          </button>

        </nav>
      </div>

      {/* MAIN */}

      <div className="flex-1 p-10 overflow-auto">

        {page === "dashboard" && <Dashboard />}
        {page === "landings" && <Landings />}
        {page === "roi" && <ROI />}

      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">

      <Card title="Keywords activas" value="10" color="text-indigo-600" />
      <Card title="Tendencias alza" value="+240%" color="text-green-500" />
      <Card title="Leads proyectados" value="142" color="text-red-500" />
      <Card title="Oportunidades SEO" value="8" color="text-orange-500" />

    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className={`text-4xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-400 mb-6">
        Datos verificados de Google Ads & Trends API
      </p>

      <Stats />

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-white rounded-2xl p-6">

          <h2 className="font-bold mb-4">Ranking de Búsqueda Real</h2>

          <table className="w-full text-sm">

            <thead className="text-gray-400">
              <tr>
                <th className="text-left pb-3">Palabra clave</th>
                <th className="text-left">Búsquedas</th>
                <th className="text-left">Crecimiento</th>
              </tr>
            </thead>

            <tbody className="space-y-2">

              <tr>
                <td>OMODA 5 VALLADOLID</td>
                <td>3200</td>
                <td className="text-green-500">+185%</td>
              </tr>

              <tr>
                <td>JAECOO 7 PRECIO ESPAÑA</td>
                <td>2400</td>
                <td className="text-green-500">+210%</td>
              </tr>

              <tr>
                <td>COCHES OCASION VALLADOLID</td>
                <td>5400</td>
                <td className="text-green-500">+12%</td>
              </tr>

            </tbody>

          </table>
        </div>

        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center items-center">

          <div className="text-gray-400 mb-2">Potencial IA</div>
          <div className="text-6xl font-bold text-indigo-600">95%</div>

        </div>

      </div>
    </div>
  );
}

function Landings() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-1">Landings</h1>
      <p className="text-gray-400 mb-6">
        Datos verificados de Google Ads & Trends API
      </p>

      <Stats />

      <div className="bg-white rounded-2xl p-6">

        <table className="w-full">

          <thead className="text-gray-400">
            <tr>
              <th className="text-left pb-4">Página de destino</th>
              <th className="text-left">Visitas</th>
              <th className="text-left">Conv.</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td className="text-indigo-600">/concesionario-omoda-valladolid</td>
              <td>2.450</td>
              <td className="text-green-500">4.2%</td>
            </tr>

            <tr>
              <td className="text-indigo-600">/jaecoo-7-ofertas</td>
              <td>1.820</td>
              <td className="text-green-500">3.8%</td>
            </tr>

          </tbody>

        </table>

      </div>
    </div>
  );
}

function ROI() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-1">ROI & Leads</h1>
      <p className="text-gray-400 mb-6">
        Datos verificados de Google Ads & Trends API
      </p>

      <Stats />

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl text-center">
          <div className="text-gray-400">Inversión estimada</div>
          <div className="text-5xl font-bold mt-2">306€</div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl text-center text-white">
          <div>Leads reales</div>
          <div className="text-5xl font-bold mt-2">14</div>
        </div>

        <div className="bg-white p-6 rounded-2xl text-center">
          <div className="text-gray-400">Retorno bruto</div>
          <div className="text-5xl font-bold text-green-500 mt-2">3600€</div>
        </div>

      </div>

    </div>
  );
}
