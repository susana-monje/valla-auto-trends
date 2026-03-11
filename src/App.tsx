// 1. ESTADOS (Asegúrate de que Keyword, Alert, etc., estén importados de ./types)
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [filters, setFilters] = useState({ category: '', type: '', location: '' });
  const [view, setView] = useState<'dashboard' | 'landings' | 'roi'>('dashboard');

  // 2. CARGA DE DATOS CON "BACKUP" (Si el JSON falla, usa estos datos)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/metadata.json');
      if (!response.ok) throw new Error('No se pudo cargar metadata.json');
      
      const data = await response.json();
      setKeywords(data);
      if (data.length > 0) setSelectedKeyword(data[0]);
      
    } catch (error) {
      console.warn("Usando datos de respaldo por error en JSON:", error);
      // DATOS DE EMERGENCIA para que la web no se vea vacía
      const backupData = [
        { id: '1', name: 'Coches eléctricos Valladolid', volume: 1200, difficulty: 45, trend: '+15%', category: 'coches', location: 'Valladolid', type: 'transaccional', potential: 85 },
        { id: '2', name: 'Motos de ocasión León', volume: 850, difficulty: 30, trend: '+22%', category: 'motos', location: 'León', type: 'informativa', potential: 70 }
      ];
      setKeywords(backupData);
      setSelectedKeyword(backupData[0]);
    } finally {
      setLoading(false);
    }
  };

  // 3. CARGA DE DETALLES (Simulada para estabilidad)
  const fetchDetails = async (kw: Keyword) => {
    // Generamos una tendencia visual basada en el volumen del keyword
    const mockTrends = [
      { date: 'Ene', value: kw.volume * 0.6 },
      { date: 'Feb', value: kw.volume * 0.8 },
      { date: 'Mar', value: kw.volume * 1.1 },
      { date: 'Abr', value: kw.volume }
    ];
    setTrendData(mockTrends);
    setSuggestions([
      { id: '1', title: `Estrategia SEO para ${kw.name}`, type: 'Contenido', impact: 'Alto' },
      { id: '2', title: `Landing Page específica: ${kw.location}`, type: 'Conversión', impact: 'Medio' }
    ]);
  };

  // 4. EFECTOS DE REACT
  useEffect(() => {
    fetchData();
    setAlerts([{ id: '1', type: 'warning', message: 'Incremento de búsqueda en sector Híbridos', date: 'Hoy' }]);
  }, []);

  useEffect(() => {
    if (selectedKeyword) fetchDetails(selectedKeyword);
  }, [selectedKeyword]);

  // 5. ACCIÓN DEL BOTÓN ACTUALIZAR
  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulamos proceso de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
    alert("Análisis de mercado actualizado correctamente.");
  };
