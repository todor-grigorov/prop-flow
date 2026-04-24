import { env } from "./infrastructure/config/env.js";
import { createExpressApp } from "./infrastructure/http/expressApp.js";
import { logger } from "./infrastructure/logging/logger.js";

const app = createExpressApp();

app.listen(env.PORT, () => {
  logger.info(`PropFlow API listening on port ${env.PORT}`);
});
