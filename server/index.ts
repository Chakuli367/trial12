import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic as serveViteStatic, log } from "./vite";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API request logging middleware ---
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// --- Main async bootstrap ---
(async () => {
  const server = await registerRoutes(app);

  // --- Error handling middleware ---
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // --- Frontend serving ---
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production static serving
    // __dirname in ES modules is not available; using path.resolve()
    const clientDist = path.resolve("client", "dist"); 

    app.use(express.static(clientDist));

    // Catch-all to serve index.html for SPA routing
    app.get("*", (_req, res: Response) => {
      const indexFile = path.join(clientDist, "index.html");
      res.sendFile(indexFile, (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Internal Server Error");
        }
      });
    });

    log("Frontend static files served from: " + clientDist);
  }

  // --- Start server ---
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`Server running on port ${port}`);
    }
  );
})();


