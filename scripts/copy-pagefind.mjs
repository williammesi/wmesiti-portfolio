import { cp, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const source = join("dist", "client", "pagefind");
const vercelStatic = join(".vercel", "output", "static");

try {
  await stat(vercelStatic);
  const destination = join(vercelStatic, "pagefind");
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
  console.log("Copied Pagefind assets to Vercel static output.");
} catch {
  // Railway and generic Node deployments serve dist/client directly.
}
