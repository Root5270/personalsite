import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { projects } from './projects.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
const security = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
};
export function createApp({dataDir = path.resolve(root, process.env.DATA_DIR || 'data'), publicOrigin = process.env.PUBLIC_ORIGIN || ''} = {}) {
  const attempts = new Map();
  const json = (res, status, value) => { res.writeHead(status, {...security, 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, {ok:true});
      if (url.pathname === '/api/projects' && req.method === 'GET') return json(res, 200, {projects});
      if (url.pathname.startsWith('/api/projects/') && req.method === 'GET') {
        const project = projects.find(p => p.id === url.pathname.split('/').at(-1));
        return json(res, project ? 200 : 404, project ? {project} : {error:'没有找到这个项目。'});
      }
      if (url.pathname === '/api/contact') {
        if (req.method !== 'POST') return json(res, 405, {error:'请使用 POST 提交。'});
        const origin = req.headers.origin;
        const allowed = publicOrigin || `http://${req.headers.host}`;
        if (origin && origin !== allowed) return json(res, 403, {error:'请求来源不受支持。'});
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return json(res, 415, {error:'请使用 JSON 提交。'});
        const now = Date.now();
        for (const [key, entry] of attempts) if (now-entry.start > 600000) attempts.delete(key);
        const ip = req.socket.remoteAddress;
        const entry = attempts.get(ip) || {start:now,count:0};
        entry.count++; attempts.set(ip,entry);
        if (entry.count > 5) { res.setHeader('Retry-After','600'); return json(res,429,{error:'提交过于频繁，请十分钟后重试，或直接发送邮件。'}); }
        let size = 0; const chunks = [];
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 16384) { json(res,413,{error:'内容过长，请缩短后重试。'}); return; }
          chunks.push(chunk);
        }
        let body;
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return json(res,400,{error:'提交格式有误。'}); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) return json(res,400,{error:'提交格式有误。'});
        if (body.website) return json(res,400,{error:'提交未通过验证。'});
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        if (name.length < 1 || name.length > 60 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 3000 || body.consent !== true) return json(res,422,{error:'请填写姓名、有效邮箱、10–3000 字的留言，并同意用于联系回复。'});
        const id = randomUUID();
        await mkdir(dataDir,{recursive:true,mode:0o700});
        await writeFile(path.join(dataDir,`${id}.json`), JSON.stringify({id,name,email,message,createdAt:new Date().toISOString()},null,2), {flag:'wx',mode:0o600});
        return json(res,201,{ok:true,id,message:'留言已保存，感谢联系。'});
      }
      if (url.pathname.startsWith('/api/')) return json(res,404,{error:'接口不存在。'});
      if (!['GET','HEAD'].includes(req.method)) return json(res,405,{error:'不支持此请求。'});
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch { return json(res,400,{error:'路径格式有误。'}); }
      if (pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some(part=>part.startsWith('.'))) return json(res,403,{error:'无法访问此路径。'});
      const target = path.resolve(publicDir, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!target.startsWith(publicDir + path.sep)) return json(res,403,{error:'无法访问此路径。'});
      const ext = path.extname(target);
      if (!types[ext]) return json(res,404,{error:'页面不存在。'});
      const content = await readFile(target);
      res.writeHead(200,{...security,'Content-Type':types[ext],'Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (res.headersSent) { res.end(); return; }
      if (['ENOENT','EISDIR','ENOTDIR'].includes(error.code)) return json(res,404,{error:'页面不存在。'});
      console.error('Request failed:', error.code || error.name);
      json(res,500,{error:'暂时无法保存，请稍后重试或直接发送邮件。'});
    }
  });
}
