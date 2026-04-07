const app = require("./app");
const connectDatabase = require("./config/db");
const env = require("./config/env");

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  const gracefulShutdown = () => {
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
};

startServer();
