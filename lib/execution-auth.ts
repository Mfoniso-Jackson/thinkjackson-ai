import { headers } from "next/headers";

export async function requireExecutionOwner() {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  const expectedUser = process.env.ADMIN_SALES_USERNAME ?? "mfoniso";
  const expectedPassword = process.env.ADMIN_SALES_PASSWORD;

  if (!expectedPassword || !authorization?.startsWith("Basic ")) throw new Error("Authentication required.");
  const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  if (username !== expectedUser || password !== expectedPassword) throw new Error("Authentication required.");
  return username;
}
