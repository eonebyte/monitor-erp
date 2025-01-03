
// server.mjs
import Fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config'
import cors from '@fastify/cors';
import accountingPlugin from './plugins/accountingPlugin.mjs';
import authPlugin from './plugins/authPlugin.mjs';
import salesPlugin from './plugins/salesPlugin.mjs';
import clientRoutes from './plugins/clientRoutes.mjs';
import purchasePlugin from './plugins/purchasePlugin.mjs';
// import authPlugin from './plugins/auth/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PORT_CLIENT = process.env.BASE_PORT_CLIENT || 3000;
const BASE_URL_CLIENT = process.env.BASE_URL_CLIENT;

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;

export async function build(opts = {}) {
  const app = Fastify(opts);

  app.register(import('@fastify/static'), {
    root: path.join(__dirname, '../client/dist'),
    prefix: '/'
  })

  app.register(import('@fastify/static'), {
    root: path.join(__dirname, '../client/src/assets'),
    prefix: '/src/assets/', 
    decorateReply: false, // berguna agar plugin static bisa diregister lebih dari 1 kali
  });
  

 
  app.register(cors, {
    // origin: `${BASE_URL_CLIENT}:${BASE_PORT_CLIENT}`,
    origin: true,
    credentials: true
  });

  app.register(import('@fastify/secure-session'), {
    sessionName: 'session',
    // cookieName: 'my-session-cookie',
    key: fs.readFileSync(path.join(__dirname, 'eonebyte')),
    expiry: 24 * 60 * 60, // Default 1 day
    cookie: {
      path: '/'
      // options for setCookie, see https://github.com/app/app-cookie
    }
  })
  app.register(import('@fastify/postgres'), {
    connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  })

  // Plugin
  // ======
  // Client Routes
  app.register(clientRoutes);
  // Auth
  app.register(authPlugin);
  // Sales
  app.register(salesPlugin);
  // Accounting
  app.register(accountingPlugin);

  app.register(purchasePlugin);


  return app
}