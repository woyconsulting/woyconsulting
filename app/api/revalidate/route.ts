import { revalidateTag } from "next/cache";
import { decodeSignatureHeader, isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;
// Allow for delivery retries and clock skew. Late changes still refresh through the CMS cache TTL.
const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000;
const empty = (status: number) => new Response(null, { status });

async function readSignedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return body + decoder.decode();
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

/** Sanity publish webhook: verifies the HMAC signature, then expires every CMS read ("sanity" tag). */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || secret.length < 32) return empty(503);
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) return empty(401);
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return empty(413);
  let body: string | null;
  try {
    body = await readSignedBody(request);
  } catch {
    return empty(400);
  }
  if (body === null) return empty(413);
  let valid = false;
  try {
    const { timestamp } = decodeSignatureHeader(signature);
    valid = Math.abs(Date.now() - timestamp) <= MAX_SIGNATURE_AGE_MS
      && await isValidSignature(body, signature, secret);
  } catch {
    valid = false;
  }
  if (!valid) return empty(401);
  revalidateTag("sanity", { expire: 0 });
  return Response.json({ revalidated: true });
}
