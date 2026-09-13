import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist/github-pages");
const base = "/Equianalgesic_Dosing_Calculator_Staging/";
const port = Number(process.env.PORT || 8788);
const types = {".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain"};
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    let file = path.resolve(root, pathname.startsWith(base) ? pathname.slice(base.length) : "404.html");
    if (path.relative(root, file).startsWith("..") || path.isAbsolute(path.relative(root, file))) {
      response.writeHead(403).end(); return;
    }
    let code = pathname.startsWith(base) ? 200 : 404;
    if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, "index.html");
    let body = await readFile(file).catch(() => null);
    if (!body) {code = 404; file = path.join(root, "404.html"); body = await readFile(file);}
    response.writeHead(code, {"Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store"});
    response.end(body);
  } catch { response.writeHead(500).end("Preview unavailable"); }
});
server.listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}${base}`));
