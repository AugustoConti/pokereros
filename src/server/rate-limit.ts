import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders, getRequestIP, setResponseStatus } from "@tanstack/react-start/server";

import { countHit } from "@/db/redis";

const WINDOW_SECONDS = 60;
// A table saves on every movement; this leaves plenty of room for a fast game.
const MAX_HITS_PER_WINDOW = 120;

export class TooManyRequestsError extends Error {
  constructor() {
    super("Demasiadas solicitudes, probá de nuevo en un minuto");
  }
}

/** Vercel sets `x-real-ip` and `x-forwarded-for` from the connecting client, so both are trustworthy there. */
function getClientIp() {
  return getRequestHeaders().get("x-real-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown";
}

export const rateLimitMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const hits = await countHit(getClientIp(), WINDOW_SECONDS);

    if (hits > MAX_HITS_PER_WINDOW) {
      setResponseStatus(429);
      throw new TooManyRequestsError();
    }

    return await next();
  },
);
