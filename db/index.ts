import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

neonConfig.fetchConnectionCache = true;

neonConfig.fetchFunction = async (input, init) => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 300 * attempt));
      }
    }
  }

  throw lastError;
};

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

