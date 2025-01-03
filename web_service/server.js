import { build } from "./app.js";

async function startServer() {
  const opts = {
    logger: {
      level: 'info'
    }
  }
  
  if (process.stdout.isTTY) {
    opts.logger.transport = { target: 'pino-pretty' }
  }
  
  const app = await build(opts)
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Server listening at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
