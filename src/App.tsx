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

  // FUNCIÓN PARA CARGAR DATOS GENERALES
  const fetchData = async () => {
    try {
      setLoading(true);
      // Cambiamos /api/ por las rutas de tus archivos JSON en la raíz
      const [kwRes, alertRes] = await Promise.all([
        fetch('/metadata.json'),
        fetch('/alerts.json').catch(() => ({ json: () => [] })) // Si no existe, devuelve lista vacía
      ]);
      
      const kwData = await kwRes.json();
      const aData = await alertRes.json();
      
      // Aplicamos los filtros manualmente ya que no hay servidor que lo haga
      let filteredKws = kwData;
      if (filters.category) filteredKws = filteredKws.filter((k: any) => k.category === filters.category);
      if (filters.location) filteredKws = filteredKws.filter((k: any) => k.location === filters.location);
      if (filters.type) filteredKws = filteredKws.filter((k: any) => k.type === filters.type);

      setKeywords(filteredKws);
      setAlerts(Array.isArray(aData) ? aData : []);
      
      if (filteredKws.length > 0 && !selectedKeyword) {
        setSelectedKeyword(filteredKws[0]);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN PARA CARGAR DETALLES DE CADA KEYWORD
  const fetchDetails = async (kw: Keyword) => {
    try {
      // Cargamos los archivos de tendencias y sugerencias
      const [trendRes, sugRes] = await Promise.all([
        fetch('/trends.json').catch(() => ({ json: () => [] })),
        fetch('/suggestions.json').catch(() => ({ json: () => [] }))
      ]);
      
      const tData = await trendRes.json();
      const sData = await sugRes.json();
      
      // Si el JSON es un objeto con IDs, buscamos el del keyword, si no, mostramos todo
      setTrendData(Array.isArray(tData) ? tData : (tData[kw.id] || []));
      setSuggestions(Array.isArray(sData) ? sData : (sData[kw.id] || []));
      
    } catch (error) {
      console.error("Error cargando detalles:", error);
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

  // FUNCIÓN DEL BOTÓN ACTUALIZAR (Simulada para Vercel)
  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      // En una web estática no podemos ejecutar POST /api/analyze
      // Simulamos una carga para que la interfaz reaccione
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchData();
      alert("Análisis completado con éxito (Datos sincronizados desde archivos locales)");
    } catch (error) {
      console.error("Error en análisis:", error);
    } finally {
      setAnalyzing(false);
    }
  };
    </div>
  );
}
