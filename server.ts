import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SEO Comparison Engine - Price Puller
  app.post("/api/ota-price", async (req, res) => {
    const { propertyId } = req.body;
    // In a real app, we'd fetch the property details to get basePrice
    const basePrice = propertyId === 'prop_1' ? 245 : 180;
    
    // Always Winner Logic: 
    // We calculate OTA prices by adding their standard service fees (14-16%)
    // and then potentially adding a small 'Strategic Delta' to ensure we win.
    const airbnbFee = Math.round(basePrice * 0.142);
    const vrboFee = Math.round(basePrice * 0.125);

    res.json({
      direct: basePrice,
      airbnb: basePrice + airbnbFee,
      airbnbFee: airbnbFee,
      vrbo: basePrice + vrboFee,
      vrboFee: vrboFee,
      savings: Math.max(airbnbFee, vrboFee),
      guaranteedWinner: true
    });
  });

  // Storefront lookup API
  app.get("/api/storefront/:slug", (req, res) => {
    // Mock user lookup by subdomain/slug
    res.json({
      ownerId: 'owner_1',
      brand: {
        name: 'The Elite Collection',
        headline: 'Modern Living in the Heart of the City',
        primaryColor: '#141414'
      }
    });
  });

  // iCal Sync logic would go here, periodically updating Firestore properties
  // AI Concierge could also have a backend endpoint if specific processing is needed

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
