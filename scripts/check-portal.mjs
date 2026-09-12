import { pathToFileURL } from 'node:url';

// No credentials, login attempts or client data: validate an anonymous session only.
export async function checkPortal(origin, request = fetch) {
  const url = new URL('/portal-api/portal.php?action=session', origin);
  if (url.protocol !== 'https:') throw new Error('Проверка production API требует HTTPS.');
  const response = await request(url, { redirect: 'error', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json' } });
  if (response.status !== 200 || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('API кабинета не готов: HTTP ' + response.status + '. Проверьте PHP веб-сайта и наличие portal-api/portal.php.');
  }
  const body = await response.json();
  if (!/^[a-f0-9]{64}$/.test(body.csrf) || body.user !== null || !response.headers.get('cache-control')?.includes('no-store')) {
    throw new Error('API кабинета вернул неожиданный ответ. Публикация не подтверждена.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await checkPortal(process.argv[2] || 'https://roknord.ru');
    console.log('PASS: HTTPS API кабинета отвечает; анонимная сессия и no-store проверены.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
