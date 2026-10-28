import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { getCookie, setCookie } from "@tanstack/react-start/server";

import { claimTableOwner } from "@/db/redis";

const OWNER_COOKIE = "pokereros_owner";
const OWNER_TOKEN_PATTERN = /^[\w-]{43}$/u;
// Browsers cap cookie lifetime at 400 days.
const OWNER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export class NotTableOwnerError extends Error {
  constructor() {
    super("No podés modificar esta mesa");
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Returns this browser's owner token, creating it on first use. It lives in an httpOnly cookie. */
function getOwnerToken() {
  const current = getCookie(OWNER_COOKIE);
  const token =
    current && OWNER_TOKEN_PATTERN.test(current) ? current : randomBytes(32).toString("base64url");

  setCookie(OWNER_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OWNER_COOKIE_MAX_AGE_SECONDS,
  });

  return token;
}

/**
 * The first browser that saves a table becomes its owner; later saves must come from that same browser.
 * Only a hash of the token is stored, so a database leak doesn't hand out write access.
 */
export async function assertTableOwner(id: string) {
  const ownerHash = hashToken(getOwnerToken());
  const currentOwner = await claimTableOwner(id, ownerHash);

  if (
    currentOwner === null ||
    !timingSafeEqual(Buffer.from(currentOwner), Buffer.from(ownerHash))
  ) {
    throw new NotTableOwnerError();
  }
}
