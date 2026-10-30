import { createGunzip } from "node:zlib";
import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { isIP } from "node:net";

const [inputPath, outputPath, release] = process.argv.slice(2);
if (!inputPath || !outputPath || !release) {
  console.error("Usage: node scripts/build-ru-geo-ranges.mjs <db.csv.gz> <output.json> <YYYY-MM>");
  process.exit(1);
}

const toHex = (address) => {
  const family = isIP(address);
  if (family === 4) {
    return address.split(".").map((part) => Number(part).toString(16).padStart(2, "0")).join("");
  }
  if (family !== 6) throw new Error(`Unsupported IP address: ${address}`);

  const [leftRaw, rightRaw = ""] = address.split("::");
  const left = leftRaw ? leftRaw.split(":") : [];
  const right = rightRaw ? rightRaw.split(":") : [];
  const missing = 8 - left.length - right.length;
  const groups = [...left, ...Array(Math.max(0, missing)).fill("0"), ...right];
  if (groups.length !== 8) throw new Error(`Invalid IPv6 address: ${address}`);
  return groups.map((group) => group.padStart(4, "0")).join("").toLowerCase();
};

const ranges = { ipv4: [], ipv6: [] };
const lines = createInterface({ input: createReadStream(inputPath).pipe(createGunzip()), crlfDelay: Infinity });

for await (const line of lines) {
  const match = line.match(/^"?([^",]+)"?,"?([^",]+)"?,"?([A-Z]{2})"?$/);
  if (!match || match[3] !== "RU") continue;
  const start = toHex(match[1]);
  const end = toHex(match[2]);
  ranges[start.length === 8 ? "ipv4" : "ipv6"].push([start, end]);
}

ranges.ipv4.sort((a, b) => a[0].localeCompare(b[0]));
ranges.ipv6.sort((a, b) => a[0].localeCompare(b[0]));

writeFileSync(outputPath, `${JSON.stringify({
  source: "DB-IP Country Lite",
  sourceUrl: "https://db-ip.com/db/lite.php",
  license: "CC BY 4.0",
  release,
  ...ranges,
})}\n`);

console.log(`Generated ${ranges.ipv4.length} IPv4 and ${ranges.ipv6.length} IPv6 RU ranges.`);
