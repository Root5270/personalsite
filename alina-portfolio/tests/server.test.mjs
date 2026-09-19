import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app.mjs';
test('API, validation, private storage and persistence', async () => {
  const directory = await mkdtemp(path.join(tmpdir(),'alina-api-test-'));
  const app = createApp({dataDir:directory});
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${app.address().port}`;
  const post = (body,headers={})=>fetch(`${base}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...headers},body:JSON.stringify(body)});
  const valid = {name:'Test visitor',email:'test@example.com',message:'This is a local automated test message.',consent:true};
  try {
    assert.equal((await fetch(base)).status,200);
    assert.match(await (await fetch(`${base}/portfolio.html`)).text(),/contact-form/);
    const {projects} = await (await fetch(`${base}/api/projects`)).json();
    assert.equal(projects.length,4);
    for (const project of projects) {
      assert.equal((await fetch(`${base}/api/projects/${project.id}`)).status,200);
      for (const img of project.images) assert.equal((await fetch(`${base}/${img.src}`)).status,200);
    }
    assert.equal((await fetch(`${base}/api/projects/missing`)).status,404);
    for (const p of ['/server/app.mjs','/.env','/data/example.json','/%2e%2e%5cserver/app.mjs']) assert.ok([403,404].includes((await fetch(base+p)).status));
    assert.equal((await post(valid,{Origin:'https://untrusted.example'})).status,403);
    assert.equal((await post({...valid,email:'invalid'})).status,422);
    assert.equal((await post({...valid,consent:false})).status,422);
    assert.equal((await post({...valid,website:'bot'})).status,400);
    const accepted = await post(valid);
    assert.equal(accepted.status,201);
    const {id} = await accepted.json();
    const saved = JSON.parse(await readFile(path.join(directory,`${id}.json`),'utf8'));
    assert.equal(saved.message,valid.message);
    assert.equal(saved.email,valid.email);
    assert.equal((await fetch(`${base}/data/${id}.json`)).status,404);
    assert.equal((await post({...valid,message:'x'.repeat(17000)})).status,413);
    assert.equal((await post(valid)).status,429);
    assert.equal((await readdir(directory)).length,1);
    await new Promise(resolve=>app.close(resolve));
    assert.equal(JSON.parse(await readFile(path.join(directory,`${id}.json`),'utf8')).name,valid.name);
  } finally {
    app.closeAllConnections();
    if (app.listening) await new Promise(resolve=>app.close(resolve));
    await rm(directory,{recursive:true,force:true});
  }
});
