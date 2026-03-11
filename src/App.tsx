import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Filter, 
  Download, 
  RefreshCw, 
  Car, 
  Bike,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Bell,
  MapPin,
  Lightbulb,
  FileText,
  Target,
  CheckCircle2,
  AlertTriangle,
  Info,
  Euro,
  Users,
  MousePointer2,
  PieChart,
  Share2,
  BookOpen
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Keyword, TrendData, Alert, ContentSuggestion } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    location: ''
  });

  const [view, setView] = useState<'dashboard' | 'landings' | 'roi'>('dashboard');

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const [kwRes, alertRes] = await Promise.all([
        fetch(`/api/keywords?${query}`),
        fetch('/api/alerts')
      ]);
      const kwData = await kwRes.json();
      const aData = await alertRes.json();
      setKeywords(kwData);
      setAlerts(aData);
      if (kwData.length > 0 && !selectedKeyword) {
        setSelectedKeyword(kwData[0]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (kw: Keyword) => {
    try {
      const [trendRes, sugRes] = await Promise.all([
        fetch(`/api/keywords/${kw.id}/trends`),
        fetch(`/api/keywords/${kw.slug}/landing`)
      ]);
      const tData = await trendRes.json();
      const lData = await sugRes.json();
      setTrendData(tData);
      
      // Fetch suggestions separately
      const sugRes2 = await fetch(`/api/keywords/${kw.id}/suggestions`);
      const sData = await sugRes2.json();
      setSuggestions(sData);
    } catch (error) {
      console.error("Detail fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (selectedKeyword) {
      fetchDetails(selectedKeyword);
    }
  }, [selectedKeyword]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await fetch('/api/analyze', { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const exportCSV = () => {
    const headers = "Term,Category,Type,Location,Volume,Difficulty,TrendScore,Potential,CPC,ConvRate\n";
    const rows = keywords.map(k => `${k.term},${k.category},${k.type},${k.location},${k.volume},${k.difficulty},${k.trend_score},${k.potential_score},${k.est_cpc},${k.est_conversion_rate}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vallaauto-trends-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  // ROI Calculations
  const estTraffic = selectedKeyword ? Math.round(selectedKeyword.volume * 0.15) : 0; // 15% CTR estimate
  const estLeads = selectedKeyword ? Math.round(estTraffic * selectedKeyword.est_conversion_rate) : 0;
  const estCost = selectedKeyword ? (estTraffic * selectedKeyword.est_cpc).toFixed(2) : "0.00";
  const estCPL = selectedKeyword && estLeads > 0 ? (parseFloat(estCost) / estLeads).toFixed(2) : "0.00";

  // Lead Projection Data
  const leadProjectionData = [
    { name: 'Actual', leads: estLeads },
    { name: '+10% SEO', leads: Math.round(estLeads * 1.1) },
    { name: '+25% SEO', leads: Math.round(estLeads * 1.25) },
    { name: '+50% SEO', leads: Math.round(estLeads * 1.5) },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-indigo-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-20 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <TrendingUp size={24} />
            </div>
            <span>VallaAuto</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-3 font-bold">Marketing Intelligence</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          <button 
            onClick={() => setView('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm",
              view === 'dashboard' ? "bg-indigo-50 text-indigo-700 shadow-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setView('landings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm",
              view === 'landings' ? "bg-indigo-50 text-indigo-700 shadow-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <FileText size={20} />
            Landing Pages
          </button>
          <button 
            onClick={() => setView('roi')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm",
              view === 'roi' ? "bg-indigo-50 text-indigo-700 shadow-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <PieChart size={20} />
            ROI & Leads
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all">
            <Bell size={20} />
            Alertas
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all">
            <Target size={20} />
            Campañas
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Valladolid, ES</p>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Sistema Activo
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900">
              {view === 'dashboard' ? 'Inteligencia de Mercado' : view === 'landings' ? 'Generador de Landings SEO' : 'Proyección de ROI'}
            </h1>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <MapPin size={16} className="text-indigo-500" />
              Valladolid & Castilla y León
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-95"
            >
              <RefreshCw size={18} className={cn(analyzing && "animate-spin")} />
              {analyzing ? "Analizando..." : "Actualizar Mercado"}
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
        </header>

        <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full">
          {view === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Keywords Activas", value: keywords.length, icon: Search, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Tendencias Alza", value: keywords.filter(k => k.trend_score > 0).length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Alertas Críticas", value: alerts.filter(a => a.type === 'alert').length, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Oportunidades SEO", value: keywords.filter(k => k.potential_score > 80).length, icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black mt-2 text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Table Section */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <h2 className="font-black text-2xl text-slate-900">Ranking de Tendencias</h2>
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                      <button 
                        onClick={() => setFilters(f => ({ ...f, category: '' }))}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", !filters.category ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
                      >Todos</button>
                      <button 
                        onClick={() => setFilters(f => ({ ...f, category: 'car' }))}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2", filters.category === 'car' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
                      ><Car size={14} /> Coches</button>
                      <button 
                        onClick={() => setFilters(f => ({ ...f, category: 'moto' }))}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2", filters.category === 'moto' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
                      ><Bike size={14} /> Motos</button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-slate-400" />
                      <select 
                        className="text-sm bg-transparent border-none focus:ring-0 font-bold text-slate-700 cursor-pointer"
                        value={filters.location}
                        onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                      >
                        <option value="">Toda España</option>
                        <option value="Valladolid">Valladolid</option>
                        <option value="Castilla y León">Castilla y León</option>
                        <option value="España">España</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter size={18} className="text-slate-400" />
                      <select 
                        className="text-sm bg-transparent border-none focus:ring-0 font-bold text-slate-700 cursor-pointer"
                        value={filters.type}
                        onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                      >
                        <option value="">Todos los tipos</option>
                        <option value="buy">Compra</option>
                        <option value="price">Precios</option>
                        <option value="financing">Financiación</option>
                        <option value="service">Mantenimiento</option>
                        <option value="rental">Renting</option>
                        <option value="insurance">Seguros</option>
                        <option value="comparison">Comparativas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Palabra Clave</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Ubicación</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Volumen</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Dificultad</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Tendencia</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Potencial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium italic">Sincronizando con fuentes de datos...</td>
                        </tr>
                      ) : keywords.map((kw) => (
                        <tr 
                          key={kw.id} 
                          className={cn(
                            "hover:bg-slate-50/50 transition-all cursor-pointer group",
                            selectedKeyword?.id === kw.id && "bg-indigo-50/30"
                          )}
                          onClick={() => setSelectedKeyword(kw)}
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                kw.category === 'car' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                              )}>
                                {kw.category === 'car' ? <Car size={20} /> : <Bike size={20} />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{kw.term}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{kw.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500">{kw.location}</td>
                          <td className="px-8 py-6 text-sm font-black text-slate-900 text-center">{kw.volume.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-20">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    kw.difficulty < 30 ? "bg-emerald-500" : kw.difficulty < 70 ? "bg-amber-500" : "bg-rose-500"
                                  )}
                                  style={{ width: `${kw.difficulty}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-slate-400">{kw.difficulty}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className={cn(
                              "flex items-center gap-1 text-xs font-black",
                              kw.trend_score > 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                              {kw.trend_score > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                              {Math.abs(kw.trend_score)}%
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block shadow-sm",
                              kw.potential_score > 80 ? "bg-emerald-100 text-emerald-700" : kw.potential_score > 50 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                            )}>
                              {kw.potential_score > 80 ? 'Alto' : kw.potential_score > 50 ? 'Medio' : 'Bajo'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROI & Lead Estimation Section */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900">Estimación de ROI & Leads</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Proyección basada en volumen y tasas de conversión del sector</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <PieChart size={24} className="text-indigo-600" />
                  </div>
                </div>

                {selectedKeyword ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: "Tráfico Estimado", value: estTraffic, sub: "Visitas/mes", icon: Users, color: "text-blue-600" },
                      { label: "Leads Potenciales", value: estLeads, sub: "Contactos/mes", icon: MousePointer2, color: "text-emerald-600" },
                      { label: "Inversión Ads", value: `${estCost}€`, sub: "Presupuesto sugerido", icon: Euro, color: "text-indigo-600" },
                      { label: "CPL Estimado", value: `${estCPL}€`, sub: "Coste por Lead", icon: Target, color: "text-purple-600" },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                          <item.icon size={18} className={item.color} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{item.value}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">Selecciona una palabra clave para ver proyecciones de ROI</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="lg:col-span-4 space-y-10">
              {/* Trend Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-lg text-slate-900">Evolución Histórica</h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">Live Sync</span>
                </div>
                
                {selectedKeyword ? (
                  <div className="space-y-6">
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis 
                            dataKey="date" 
                            hide 
                          />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            labelFormatter={(label) => format(new Date(label), 'd MMM', { locale: es })}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#6366f1" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorVol)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="pt-6 border-t border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Análisis de Tendencia</p>
                      <p className="font-black text-xl text-slate-900">{selectedKeyword.term}</p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Crecimiento</p>
                          <p className={cn(
                            "text-lg font-black",
                            selectedKeyword.trend_score > 0 ? "text-emerald-600" : "text-rose-600"
                          )}>{selectedKeyword.trend_score}%</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Dificultad</p>
                          <p className="text-lg font-black text-slate-900">{selectedKeyword.difficulty}/100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center text-slate-400 text-sm italic bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    Selecciona una keyword para ver evolución
                  </div>
                )}
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-black text-lg text-slate-900">Alertas Inteligentes</h3>
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-100">
                    {alerts.length}
                  </div>
                </div>
                <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto custom-scrollbar">
                  {alerts.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm italic">No hay alertas críticas hoy</div>
                  ) : alerts.map((alert) => (
                    <div key={alert.id} className="p-6 hover:bg-slate-50 transition-all group">
                      <div className="flex gap-4">
                        <div className="mt-1">
                          {alert.type === 'alert' ? <AlertCircle size={20} className="text-rose-500 animate-pulse" /> : 
                           alert.type === 'warning' ? <AlertTriangle size={20} className="text-amber-500" /> : 
                           alert.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> :
                           <Info size={20} className="text-blue-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-snug text-slate-700 group-hover:text-slate-900 transition-colors">{alert.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                            {format(new Date(alert.created_at), 'HH:mm - d MMM', { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Strategy Panel */}
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000" />
                
                <h3 className="font-black text-2xl mb-8 flex items-center gap-3 relative z-10">
                  <Lightbulb size={28} className="text-amber-400" />
                  Estrategia SEO IA
                </h3>
                
                {selectedKeyword ? (
                  <div className="space-y-8 relative z-10">
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Sugerencias optimizadas para <span className="text-white font-black underline decoration-indigo-500 underline-offset-4">"{selectedKeyword.term}"</span>:</p>
                    
                    <div className="space-y-6">
                      {suggestions.map((sug) => (
                        <div key={sug.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 hover:bg-white/10 transition-all cursor-default">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full",
                              sug.content_type === 'post' ? "bg-blue-500/20 text-blue-300" :
                              sug.content_type === 'landing' ? "bg-purple-500/20 text-purple-300" :
                              sug.content_type === 'ad' ? "bg-emerald-500/20 text-emerald-300" :
                              "bg-amber-500/20 text-amber-300"
                            )}>
                              {sug.content_type === 'post' ? 'Blog Post' : sug.content_type === 'landing' ? 'Landing Page' : sug.content_type === 'ad' ? 'Google Ad' : 'Social Media'}
                            </span>
                            <BookOpen size={16} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-base font-black leading-tight mb-2">{sug.title}</p>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{sug.structure}</p>
                          </div>
                          {sug.meta_description && (
                            <div className="pt-4 border-t border-white/5">
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Meta Description</p>
                              <p className="text-[11px] text-slate-300 italic">"{sug.meta_description}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20 active:scale-95">
                      <Share2 size={18} />
                      Publicar Estrategia
                    </button>
                  </div>
                ) : (
                  <div className="py-20 text-center relative z-10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-slate-700" />
                    </div>
                    <p className="text-sm text-slate-500 font-bold italic">Selecciona una keyword para generar estrategia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

          {view === 'landings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-xl mb-6">Páginas Generadas</h3>
                  <div className="space-y-2">
                    {keywords.map(kw => (
                      <button 
                        key={kw.id}
                        onClick={() => setSelectedKeyword(kw)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group",
                          selectedKeyword?.id === kw.id ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} className={selectedKeyword?.id === kw.id ? "text-indigo-600" : "text-slate-400"} />
                          <div>
                            <p className="font-bold text-sm">{kw.term}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">/{kw.slug}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                {selectedKeyword ? (
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-2xl text-slate-900">Vista Previa de Landing</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">URL: <span className="text-indigo-600 font-bold">vallaauto.es/{selectedKeyword.slug}</span></p>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">Editar</button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Publicar</button>
                      </div>
                    </div>
                    
                    <div className="p-10 space-y-10">
                      {/* SEO Meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Meta Title</p>
                          <p className="text-sm font-bold text-slate-900">{selectedKeyword.meta_title}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Meta Description</p>
                          <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedKeyword.meta_description}</p>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="border-t border-slate-100 pt-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contenido Generado (HTML)</p>
                        <div 
                          className="prose prose-slate max-w-none prose-headings:font-black prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-li:text-slate-600"
                          dangerouslySetInnerHTML={{ __html: selectedKeyword.content_html }}
                        />
                      </div>

                      {/* FAQs */}
                      <div className="border-t border-slate-100 pt-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Preguntas Frecuentes (Schema FAQ)</p>
                        <div className="space-y-4">
                          {JSON.parse(selectedKeyword.faq_json || '[]').map((faq: any, i: number) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                              <p className="font-bold text-slate-900 mb-2">{faq.question}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schema Markup */}
                      <div className="border-t border-slate-100 pt-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Schema Markup (JSON-LD)</p>
                        <pre className="bg-slate-900 text-indigo-300 p-6 rounded-3xl text-[10px] font-mono overflow-x-auto">
                          {JSON.stringify(JSON.parse(selectedKeyword.schema_markup || '{}'), null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-slate-400 text-sm italic bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
                    Selecciona una página para previsualizar
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'roi' && (
            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900">Estimación de ROI & Leads</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Proyección basada en volumen y tasas de conversión del sector</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <PieChart size={24} className="text-indigo-600" />
                  </div>
                </div>

                {selectedKeyword ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-6">
                      {[
                        { label: "Tráfico Estimado", value: estTraffic, sub: "Visitas/mes", icon: Users, color: "text-blue-600" },
                        { label: "Leads Potenciales", value: estLeads, sub: "Contactos/mes", icon: MousePointer2, color: "text-emerald-600" },
                        { label: "Inversión Ads", value: `${estCost}€`, sub: "Presupuesto sugerido", icon: Euro, color: "text-indigo-600" },
                        { label: "CPL Estimado", value: `${estCPL}€`, sub: "Coste por Lead", icon: Target, color: "text-purple-600" },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-3 mb-4">
                            <item.icon size={18} className={item.color} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                          </div>
                          <p className="text-3xl font-black text-slate-900">{item.value}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{item.sub}</p>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-8 bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                      <h4 className="font-black text-lg text-slate-900 mb-8">Proyección de Crecimiento de Leads</h4>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={leadProjectionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                            <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="leads" radius={[10, 10, 0, 0]}>
                              {leadProjectionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#818cf8' : index === 2 ? '#a5b4fc' : '#c7d2fe'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                          <span className="text-indigo-600">Tip Estratégico:</span> Optimizando el contenido para esta keyword y mejorando el internal linking, podrías alcanzar hasta <span className="font-black">{Math.round(estLeads * 1.5)} leads mensuales</span> sin aumentar la inversión publicitaria.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">Selecciona una palabra clave para ver proyecciones de ROI</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
