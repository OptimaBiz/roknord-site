<?php
// Local integration preview only. Production uses the web server's PHP handler.
$path = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if ($path === '/portal-api/portal.php') { require __DIR__.'/public/portal.php'; return true; }
return false;
