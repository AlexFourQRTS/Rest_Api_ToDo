import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.data': 'application/octet-stream',
    '.zip': 'application/zip'
};

const server = createServer(async (req, res) => {
    // Устанавливаем нужные заголовки для SharedArrayBuffer
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Обрабатываем preflight запросы
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Отделяем путь от query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    filePath = join(__dirname, filePath);
    
    // Добавляем логирование
    console.log(`Request: ${req.method} ${req.url}`);
    console.log(`Path: ${url.pathname}`);
    console.log(`Query: ${url.search}`);
    console.log(`File path: ${filePath}`);
    
    try {
        const ext = extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        const data = await readFile(filePath);
        console.log(`File served successfully: ${filePath} (${data.length} bytes)`);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (error) {
        console.error(`Error serving file: ${filePath}`);
        console.error(`Error details: ${error.message}`);
        
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(500);
            res.end('Server error');
        }
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Headers set for SharedArrayBuffer support');
}); 