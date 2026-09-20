import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { root } from './app.mjs';
const directory = path.resolve(root, process.env.DATA_DIR || 'data');
let files = [];
try { files = await readdir(directory); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const messages = await Promise.all(files.filter(f=>/^[a-f0-9-]+\.json$/.test(f)).map(async file=>JSON.parse(await readFile(path.join(directory,file),'utf8'))));
messages.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
if (!messages.length) console.log('暂无留言。');
for (const m of messages) console.log(`\n${m.createdAt}\n${m.name} <${m.email}>\n${m.message}\n编号：${m.id}`);
