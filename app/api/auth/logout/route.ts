import { deleteSessionToken } from "@/lib/session";

export async function GET() {
  await deleteSessionToken();
  return new Response(null, { status: 204 });
}