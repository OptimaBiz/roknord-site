import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const base = "http://127.0.0.1:4387";
const suffix = Date.now();
const email = `review-${suffix}@example.test`;
const otherEmail = `other-${suffix}@example.test`;
const password = "Test-only-Password-2026!";
function manage(...args) {
  return execFileSync(
    "docker",
    [
      "compose",
      "-f",
      "docker-compose.portal.yml",
      "exec",
      "-T",
      "-e",
      `ROKNORD_INITIAL_PASSWORD=${password}`,
      "portal",
      "php",
      "/workspace/server/client-portal/manage.php",
      ...args,
    ],
    { encoding: "utf8" },
  );
}
manage("create", email, "Проверка", "Учебная организация");
manage("create", otherEmail, "Другой клиент", "Другая учебная организация");
manage(
  "document",
  email,
  "/workspace/server/client-portal/samples/demo-contract.txt",
  "Тестовый договор",
  "Договор",
);
manage("task", email, "Проверить выборку", "Согласовать");

class Client {
  cookie = "";
  csrf = "";
  async request(action, data, extra = {}) {
    const headers = {
      Cookie: this.cookie,
      ...(data
        ? {
            Origin: base,
            "X-CSRF-Token": this.csrf,
            ...(data instanceof FormData
              ? {}
              : { "Content-Type": "application/json" }),
          }
        : {}),
      ...extra,
    };
    const res = await fetch(`${base}/portal-api/portal.php?action=${action}`, {
      method: data ? "POST" : "GET",
      headers,
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
    const set = res.headers.get("set-cookie");
    if (set) this.cookie = set.split(";")[0];
    return res;
  }
  async session() {
    const r = await this.request("session");
    assert.equal(r.status, 200);
    const data = await r.json();
    this.csrf = data.csrf;
    return data;
  }
  async login(email) {
    await this.session();
    assert.equal(
      (await this.request("login", { email, password })).status,
      200,
    );
    await this.session();
  }
}
const a = new Client();
assert.equal(
  (await a.request("project")).status,
  401,
  "anonymous access denied",
);
await a.session();
assert.equal(
  (await a.request("login", { email, password }, { "X-CSRF-Token": "bad" }))
    .status,
  403,
  "CSRF required",
);
assert.equal(
  (
    await a.request(
      "login",
      { email, password },
      { Origin: "https://outside.example" },
    )
  ).status,
  403,
  "foreign origin denied",
);
await a.login(email);
const b = new Client();
await b.login(otherEmail);
const second = new Client();
await second.login(email);
const data = await (await a.request("project")).json();
assert.equal(data.documents.length, 1);
assert.equal(data.tasks.length, 1);
const id = data.documents[0].id;
assert.equal(
  (await b.request(`download&id=${id}`)).status,
  404,
  "other client cannot download",
);
assert.equal(
  (await b.request("task", { id: data.tasks[0].id, done: true })).status,
  404,
  "other client cannot alter task",
);
const download = await a.request(`download&id=${id}`);
assert.equal(download.status, 200);
assert.match(download.headers.get("content-disposition"), /attachment/);
assert.match(download.headers.get("cache-control"), /no-store/);
assert.match(await download.text(), /ДЕМОНСТРАЦИОННЫЙ/);
assert.equal(
  (await a.request("task", { id: data.tasks[0].id, done: true })).status,
  200,
);
assert.equal(
  (
    await a.request("message", {
      body: "Тест сохранения <script>alert(1)</script>",
    })
  ).status,
  200,
);
const updated = await (await a.request("project")).json();
assert.equal(updated.tasks[0].done, 1);
assert.match(updated.messages[0].body, /<script>/);
const invalid = new FormData();
invalid.append(
  "file",
  new Blob(["plain text"], { type: "application/pdf" }),
  "false.pdf",
);
assert.equal(
  (await a.request("upload", invalid)).status,
  422,
  "false PDF rejected",
);
const valid = new FormData();
valid.append(
  "file",
  new Blob(
    [await readFile("public/pdf/roknord_karta_riskov_pk_os_smk_2026.pdf")],
    { type: "application/pdf" },
  ),
  "review.pdf",
);
assert.equal((await a.request("upload", valid)).status, 200, "PDF uploaded");
assert.equal((await (await a.request("project")).json()).documents.length, 2);
const changed = await a.request("password", {
  current: password,
  password: "Changed-test-Password-2026!",
});
assert.equal(changed.status, 200);
a.csrf = (await changed.json()).csrf;
assert.equal(
  (await second.request("project")).status,
  401,
  "old session revoked",
);
assert.equal((await a.request("logout", {})).status, 200);
assert.equal(
  (await a.request(`download&id=${id}`)).status,
  401,
  "logout blocks file",
);
const rate = new Client();
await rate.session();
let last;
for (let i = 0; i < 9; i++)
  last = await rate.request("login", {
    email: `missing-${suffix}@example.test`,
    password: "incorrect",
  });
assert.equal(last.status, 429, "repeated guesses rate limited");
console.log(
  "PASS: login, CSRF, origin, ownership, document downloads, tasks, messages, PDF validation/upload, password rotation, session revocation, logout, rate limiting.",
);
