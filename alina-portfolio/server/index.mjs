import { createApp } from './app.mjs';
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || '127.0.0.1';
const app = createApp();
app.requestTimeout = 15000;
app.headersTimeout = 10000;
app.listen(port, host, () => console.log(`Alina portfolio: http://${host}:${port}`));
app.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => app.close(() => process.exit(0)));
