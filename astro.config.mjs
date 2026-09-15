// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';

const sitemapExcludedPaths = new Set([
  '/404.html',
  '/404/',
  '/account/',
  '/thank-you/',
  '/materials/karta-riskov-pk-os-smk-2026/download/',
]);

const normalizePagePath = (pathname) => {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutIndex = withLeadingSlash.replace(/index\.html$/, '');
  return withoutIndex || '/';
};

const sitemapIntegration = {
  name: 'roknord-sitemap',
  hooks: {
    'astro:build:done': async ({ pages, dir, logger }) => {
      const paths = [...new Set(pages.map(({ pathname }) => normalizePagePath(pathname)))]
        .filter((pathname) => !sitemapExcludedPaths.has(pathname))
        .sort((left, right) => left === '/' ? -1 : right === '/' ? 1 : left.localeCompare(right, 'ru'));
      const urls = paths.map((pathname) => `  <url><loc>${new URL(pathname, 'https://roknord.ru').href}</loc></url>`).join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      await writeFile(new URL('sitemap.xml', dir), sitemap, 'utf8');
      logger.info(`Создан sitemap.xml: ${paths.length} страниц`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://roknord.ru',
  compressHTML: true,
  integrations: [sitemapIntegration],
});
