import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("vallaauto.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- car, moto
    type TEXT NOT NULL, -- buy, price, comparison, financing, service, rental, insurance
    location TEXT NOT NULL DEFAULT 'Valladolid',
    volume INTEGER DEFAULT 0,
    difficulty INTEGER DEFAULT 0,
    trend_score REAL DEFAULT 0.0,
    potential_score INTEGER DEFAULT 0, -- 0-100
    est_cpc REAL DEFAULT 0.0,
    est_conversion_rate REAL DEFAULT 0.0,
    meta_title TEXT,
    meta_description TEXT,
    content_html TEXT,
    faq_json TEXT, -- JSON string of FAQs
    schema_markup TEXT, -- JSON-LD string
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS trends_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword_id INTEGER NOT NULL,
    date DATE NOT NULL,
    volume INTEGER NOT NULL,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id)
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, warning, success, alert
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id)
  );

  CREATE TABLE IF NOT EXISTS content_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    structure TEXT NOT NULL,
    meta_description TEXT,
    content_type TEXT NOT NULL, -- post, landing, ad, social
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/keywords", (req, res) => {
    const { category, type, location } = req.query;
    let query = "SELECT * FROM keywords WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (location) {
      query += " AND location = ?";
      params.push(location);
    }

    query += " ORDER BY trend_score DESC LIMIT 100";
    
    const keywords = db.prepare(query).all(...params);
    res.json(keywords);
  });

  app.get("/api/keywords/:id/trends", (req, res) => {
    const trends = db.prepare("SELECT * FROM trends_history WHERE keyword_id = ? ORDER BY date ASC").all(req.params.id);
    res.json(trends);
  });

  app.get("/api/keywords/:slug/landing", (req, res) => {
    const keyword = db.prepare("SELECT * FROM keywords WHERE slug = ?").get(req.params.slug);
    if (!keyword) return res.status(404).json({ error: "Landing page not found" });
    
    // Get related internal links
    const related = db.prepare(`
      SELECT term, slug FROM keywords 
      WHERE category = ? AND id != ? 
      ORDER BY trend_score DESC LIMIT 5
    `).all(keyword.category, keyword.id);

    res.json({ ...keyword, internal_links: related });
  });

  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare(`
      SELECT a.*, k.term 
      FROM alerts a 
      JOIN keywords k ON a.keyword_id = k.id 
      ORDER BY a.created_at DESC LIMIT 20
    `).all();
    res.json(alerts);
  });

  app.get("/api/keywords/:id/suggestions", (req, res) => {
    const suggestions = db.prepare("SELECT * FROM content_suggestions WHERE keyword_id = ?").all(req.params.id);
    res.json(suggestions);
  });

  // Trigger Analysis (Simulated with Gemini)
  app.post("/api/analyze", async (req, res) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const prompt = `
        Actúa como un experto en SEO senior, marketing digital y mercado automotriz en España, específicamente en Valladolid y Castilla y León.
        Simula datos de Google Trends, Keyword Planner, YouTube Trends y noticias locales para generar una lista de 25 palabras clave que sean tendencia HOY (${new Date().toLocaleDateString()}) relacionadas con:
        - Compra de coches/motos (nuevos y segunda mano)
        - Financiación, Renting y Leasing
        - Talleres, mantenimiento y recambios
        - Seguros de vehículos
        - Comparativas de modelos específicos (SUV, eléctricos, híbridos)
        
        Para cada palabra clave, proporciona en formato JSON:
        - term: la palabra clave
        - slug: url amigable (ej: 'coches-segunda-mano-valladolid')
        - category: 'car' o 'moto'
        - type: 'buy', 'price', 'comparison', 'financing', 'service', 'rental', 'insurance'
        - location: 'Valladolid', 'Castilla y León' o 'España'
        - volume: volumen de búsqueda mensual estimado (entero)
        - difficulty: dificultad SEO (0-100)
        - trend_score: porcentaje de crecimiento reciente (ej: 55.5)
        - potential_score: puntuación de oportunidad de marketing (0-100)
        - est_cpc: coste por clic estimado en euros (ej: 1.25)
        - est_conversion_rate: tasa de conversión estimada (ej: 0.025)
        - meta_title: título SEO optimizado para CTR (máx 60 caracteres)
        - meta_description: descripción SEO optimizada para CTR (máx 155 caracteres)
        - content_html: contenido enriquecido en HTML (incluye H2, H3, listas, tablas comparativas simuladas)
        - faq_json: un array de objetos { question, answer } con 3-5 preguntas frecuentes
        - schema_markup: objeto JSON-LD para Schema.org (tipo FAQPage o Product/Service)
        - suggestions: un array de objetos con:
            - title: título sugerido para contenido SEO o anuncio
            - structure: breve descripción de la estructura del contenido
            - meta_description: meta descripción optimizada
            - content_type: 'post', 'landing', 'ad' o 'social'
        
        Responde ÚNICAMENTE con el array JSON.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });
      const responseText = result.text;
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const keywordsData = JSON.parse(cleanJson);

      const insertKeyword = db.prepare(`
        INSERT INTO keywords (
          term, slug, category, type, location, volume, difficulty, trend_score, 
          potential_score, est_cpc, est_conversion_rate, meta_title, meta_description, 
          content_html, faq_json, schema_markup, last_updated
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(term) DO UPDATE SET
          slug = excluded.slug,
          volume = excluded.volume,
          difficulty = excluded.difficulty,
          trend_score = excluded.trend_score,
          potential_score = excluded.potential_score,
          est_cpc = excluded.est_cpc,
          est_conversion_rate = excluded.est_conversion_rate,
          meta_title = excluded.meta_title,
          meta_description = excluded.meta_description,
          content_html = excluded.content_html,
          faq_json = excluded.faq_json,
          schema_markup = excluded.schema_markup,
          last_updated = CURRENT_TIMESTAMP
      `);

      const insertTrend = db.prepare(`
        INSERT INTO trends_history (keyword_id, date, volume)
        VALUES (?, ?, ?)
      `);

      const insertAlert = db.prepare(`
        INSERT INTO alerts (keyword_id, message, type)
        VALUES (?, ?, ?)
      `);

      const insertSuggestion = db.prepare(`
        INSERT INTO content_suggestions (keyword_id, title, structure, meta_description, content_type)
        VALUES (?, ?, ?, ?, ?)
      `);

      const today = new Date().toISOString().split("T")[0];

      for (const kw of keywordsData) {
        const info = insertKeyword.run(
          kw.term, 
          kw.slug,
          kw.category, 
          kw.type, 
          kw.location, 
          kw.volume, 
          kw.difficulty, 
          kw.trend_score, 
          kw.potential_score,
          kw.est_cpc,
          kw.est_conversion_rate,
          kw.meta_title,
          kw.meta_description,
          kw.content_html,
          JSON.stringify(kw.faq_json),
          JSON.stringify(kw.schema_markup)
        );
        const keywordId = info.lastInsertRowid || db.prepare("SELECT id FROM keywords WHERE term = ?").get(kw.term).id;
        
        // Add historical data point
        insertTrend.run(keywordId, today, kw.volume);

        // Add suggestions
        if (kw.suggestions) {
          db.prepare("DELETE FROM content_suggestions WHERE keyword_id = ?").run(keywordId);
          for (const sug of kw.suggestions) {
            insertSuggestion.run(keywordId, sug.title, sug.structure, sug.meta_description, sug.content_type);
          }
        }

        // Generate alerts
        if (kw.trend_score > 50) {
          insertAlert.run(keywordId, `¡ALERTA CRÍTICA! '${kw.term}' en ${kw.location} se ha disparado un ${kw.trend_score}%`, 'alert');
        } else if (kw.potential_score > 85 && kw.difficulty < 35) {
          insertAlert.run(keywordId, `¡OPORTUNIDAD ESTRATÉGICA! '${kw.term}' detectada con alto ROI potencial.`, 'success');
        }
      }

      res.json({ success: true, count: keywordsData.length });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze trends" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
