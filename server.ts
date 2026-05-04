import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load env before imports that use it
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase client for server-side
defineSupabase();

async function defineSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️ Supabase credentials missing — API endpoints will return mock data");
  }
  
  return createClient(supabaseUrl || "", supabaseServiceKey || "", {
    auth: { persistSession: false }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", platform: "floorstay", env: process.env.NODE_ENV || "development" });
  });

  // ==========================================
  // OTA PRICE COMPARISON ENGINE
  // ==========================================
  app.post("/api/ota-price", async (req, res) => {
    const { propertyId, nights = 1 } = req.body;
    
    try {
      const supabase = await defineSupabase();
      
      // Get property base price
      const { data: property } = await supabase
        .from("properties")
        .select("base_price, cleaning_fee")
        .eq("id", propertyId)
        .single();
      
      const basePrice = property?.base_price || 245;
      const cleaningFee = property?.cleaning_fee || 0;
      
      // Get cached OTA prices
      const { data: otaCache } = await supabase
        .from("ota_price_cache")
        .select("ota, price, fees, total")
        .eq("property_id", propertyId);
      
      const airbnbCache = otaCache?.find(c => c.ota === "airbnb");
      const vrboCache = otaCache?.find(c => c.ota === "vrbo");
      
      // Calculate per-night + total
      const directNightly = basePrice;
      const directTotal = (basePrice * nights) + cleaningFee;
      
      const airbnbNightly = airbnbCache ? airbnbCache.price : Math.round(basePrice * 1.20);
      const airbnbFees = airbnbCache ? airbnbCache.fees * nights : Math.round(basePrice * 0.20 * nights);
      const airbnbTotal = airbnbCache ? airbnbCache.total * nights : (airbnbNightly * nights) + cleaningFee;
      
      const vrboNightly = vrboCache ? vrboCache.price : Math.round(basePrice * 1.15);
      const vrboFees = vrboCache ? vrboCache.fees * nights : Math.round(basePrice * 0.15 * nights);
      const vrboTotal = vrboCache ? vrboCache.total * nights : (vrboNightly * nights) + cleaningFee;
      
      const savings = Math.max(airbnbTotal, vrboTotal) - directTotal;
      
      res.json({
        propertyId,
        nights,
        direct: directNightly,
        directTotal,
        airbnb: airbnbNightly,
        airbnbTotal,
        airbnbFees,
        vrbo: vrboNightly,
        vrboTotal,
        vrboFees,
        cleaningFee,
        savings: Math.max(0, Math.round(savings)),
        guaranteedWinner: true,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error("OTA price error:", err);
      // Fallback
      const basePrice = 245;
      const airbnbFee = Math.round(basePrice * 0.20);
      const vrboFee = Math.round(basePrice * 0.15);
      res.json({
        propertyId,
        nights,
        direct: basePrice,
        directTotal: basePrice * nights,
        airbnb: basePrice + airbnbFee,
        airbnbTotal: (basePrice + airbnbFee) * nights,
        airbnbFees: airbnbFee * nights,
        vrbo: basePrice + vrboFee,
        vrboTotal: (basePrice + vrboFee) * nights,
        vrboFees: vrboFee * nights,
        savings: Math.max(airbnbFee, vrboFee) * nights,
        guaranteedWinner: true
      });
    }
  });

  // ==========================================
  // STOREFRONT LOOKUP (by owner slug)
  // ==========================================
  app.get("/api/storefront/:slug", async (req, res) => {
    try {
      const supabase = await defineSupabase();
      const { data: owner } = await supabase
        .from("owners")
        .select("id, business_name, slug, headline, primary_color, logo_url, knowledge_base, commission_rate")
        .eq("slug", req.params.slug)
        .eq("status", "active")
        .single();
      
      if (!owner) {
        return res.status(404).json({ error: "Storefront not found" });
      }
      
      // Get owner's properties
      const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", owner.id)
        .eq("status", "active");
      
      res.json({
        owner,
        properties: properties || []
      });
    } catch (err) {
      console.error("Storefront error:", err);
      // Fallback mock
      res.json({
        owner: {
          business_name: "Quantum Hospitality",
          slug: req.params.slug,
          headline: "Premium Fort Lauderdale Stays",
          primary_color: "#141414"
        },
        properties: []
      });
    }
  });

  // ==========================================
  // ALL PROPERTIES (public feed)
  // ==========================================
  app.get("/api/properties", async (req, res) => {
    try {
      const supabase = await defineSupabase();
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*, owners!inner(business_name, slug)")
        .eq("status", "active");
      
      if (error) throw error;
      res.json(properties || []);
    } catch (err) {
      console.error("Properties fetch error:", err);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // ==========================================
  // OWNER DASHBOARD DATA
  // ==========================================
  app.get("/api/owner/:ownerId/dashboard", async (req, res) => {
    try {
      const supabase = await defineSupabase();
      const ownerId = req.params.ownerId;
      
      const { data: stats } = await supabase.rpc("get_owner_dashboard_stats", { p_owner_id: ownerId });
      const { data: recentBookings } = await supabase
        .from("bookings")
        .select("*, properties(name)")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", ownerId);
      
      const { data: syncLogs } = await supabase
        .from("sync_logs")
        .select("*")
        .in("property_id", properties?.map(p => p.id) || [])
        .order("timestamp", { ascending: false })
        .limit(20);
      
      res.json({
        stats: stats || {},
        recentBookings: recentBookings || [],
        properties: properties || [],
        syncLogs: syncLogs || []
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  });

  // ==========================================
  // CREATE BOOKING
  // ==========================================
  app.post("/api/bookings", async (req, res) => {
    try {
      const supabase = await defineSupabase();
      const booking = req.body;
      
      const { data, error } = await supabase
        .from("bookings")
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      console.error("Booking creation error:", err);
      res.status(500).json({ error: "Failed to create booking" });
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
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FloorStay server running on http://localhost:${PORT}`);
  });
}

startServer();
