import serverless from "serverless-http";
import express from "express";
import { registerRoutes } from "../../server/routes";
import { createServer } from "http";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Initialize routes
let appHandler: ReturnType<typeof serverless> | null = null;

async function initializeApp() {
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);
  
  // Don't serve static files here - Netlify handles that
  return serverless(app);
}

// Lazy initialization
async function getHandler() {
  if (!appHandler) {
    appHandler = await initializeApp();
  }
  return appHandler;
}

export const handler = async (event: any, context: any) => {
  const serverlessHandler = await getHandler();
  return serverlessHandler(event, context);
};

