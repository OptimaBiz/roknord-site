import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const files = fs.readdirSync(root,{recursive:true}).filter(file=>file.endsWith('.html'));
const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const failures=[];
let indexed=0;
for (const file of files) {
  const html=fs.readFileSync(path.join(root,file),'utf8');
  const route='/'+file.replace(/index.html$/,'');
  const canonical=`https://roknord.ru${route}`;
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)failures.push(`${route}: H1`);
  if(!html.includes(`rel="canonical" href="${canonical}"`))failures.push(`${route}: canonical`);
  const noindex=/<meta[^>]+name="robots"[^>]+content="[^\"]*noindex/.test(html);
  if(!noindex){indexed++;if(!sitemap.includes(`<loc>${canonical}</loc>`))failures.push(`${route}: sitemap missing`);}
  if(noindex&&sitemap.includes(`<loc>${canonical}</loc>`))failures.push(`${route}: noindex in sitemap`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)) {
    if(match[1].startsWith('/portal-api/'))continue;
    const url=new URL(match[1],'http://local');let target=path.join(root,decodeURIComponent(url.pathname));
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)){failures.push(`${route}: missing ${match[1]}`);continue;}
    if(url.hash&&target.endsWith('.html')&&!fs.readFileSync(target,'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))failures.push(`${route}: anchor ${match[1]}`);
  }
  if(route==='/account/'&&(/mc\.yandex|Roknord-Demo-2026|Учебная лаборатория/.test(html)))failures.push('Private page includes analytics or demo data');
  if(html.includes('property="og:type" content="article"')){
    const json=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    const article=json.find(item=>item['@type']==='Article');
    assert.ok(article,route);
    assert.ok(html.includes(`property="og:image" content="${article.image}"`),route+' OG image');
    assert.ok(article.image.endsWith('.webp'),route+' WebP');
    assert.ok(html.includes(`src="${new URL(article.image).pathname}"`),route+' cover');
    assert.ok(json.some(item=>item['@type']==='FAQPage'),route+' FAQ');
  }
}
assert.deepEqual(failures,[]);
console.log(`PASS ${files.length} pages: H1, canonical, ${indexed} sitemap entries, internal links/assets/anchors, article images and schemas, private-page separation.`);
