import serverless from "serverless-http";
import express from "express";
import { registerRoutes } from "../../server/routes";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Initialize routes
let handler: ReturnType<typeof serverless> | null = null;

async function initializeApp() {
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);
  
  // Serve static files in production (Netlify handles this, but we include it for fallback)
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  
  return serverless(app);
}

// Lazy initialization
async function getHandler() {
  if (!handler) {
    handler = await initializeApp();
  }
  return handler;
}

export const handler = async (event: any, context: any) => {
  const serverlessHandler = await getHandler();
  return serverlessHandler(event, context);
};

