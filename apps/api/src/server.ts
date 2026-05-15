import { config } from "./config.js";
import { connectDb } from "./db.js";
import { createRealtimeServer } from "./app.js";

await connectDb();
const { httpServer } = createRealtimeServer();

httpServer.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
