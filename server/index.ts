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
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
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
    throw err;
  });

 // --- Frontend serving ---
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  // Production static serving (directly from client folder)
  const __dirname = path.resolve();
  const clientDist = path.join(__dirname, "client"); // <-- index.html is here

  app.use(express.static(clientDist));

  // Catch-all to serve index.html for SPA routing
  app.get("*", (_, res: Response) => {
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
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


