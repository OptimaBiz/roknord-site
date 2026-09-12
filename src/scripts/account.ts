export {};

const element = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const status = element("portal-status");
const workspace = element("portal-workspace");
const login = element("portal-login");
let csrf = "";
type DocumentRecord = {
  id: string;
  title: string;
  category: string;
  size: number;
  created: string;
};
type Task = { id: string; title: string; due: string; done: number };
type Message = { author: string; body: string; created: string };
type ProjectData = {
  project: {
    title: string;
    stage: string;
    next_step: string;
    manager: string;
    due: string;
  } | null;
  documents: DocumentRecord[];
  tasks: Task[];
  messages: Message[];
};
function notify(message: string) {
  status.textContent = message;
}
function signedOut() {
  workspace.hidden = true;
  login.hidden = false;
  ["document-list", "task-list", "message-list"].forEach((id) =>
    element(id).replaceChildren(),
  );
  [
    "client-company",
    "client-name",
    "project-title",
    "project-stage",
    "project-due",
    "project-manager",
    "project-next",
  ].forEach((id) => (element(id).textContent = ""));
  ["message-form", "upload-form", "password-form"].forEach((id) =>
    element<HTMLFormElement>(id).reset(),
  );
}
async function api(action: string, data?: object | FormData) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`/portal-api/portal.php?action=${action}`, {
      method: data ? "POST" : "GET",
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
      headers: data
        ? {
            "X-CSRF-Token": csrf,
            ...(data instanceof FormData
              ? {}
              : { "Content-Type": "application/json" }),
          }
        : {},
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
    const result = await response
      .json()
      .catch(() => ({
        message: "Кабинет временно недоступен. Напишите на hello@roknord.ru.",
      }));
    if (!response.ok) {
      if (response.status === 401) signedOut();
      throw new Error(result.message || "Не удалось выполнить действие.");
    }
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw new Error(
        "Сервер не ответил вовремя. Проверьте соединение и повторите.",
      );
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
function node(tag: string, text: string) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}
function date(value: string) {
  return new Date(value).toLocaleDateString("ru-RU");
}
async function refresh() {
  const data: ProjectData = await api("project");
  element("project-title").textContent =
    data.project?.title || "Проект ещё не назначен";
  element("project-stage").textContent =
    data.project?.stage || "Ожидает согласования";
  element("project-due").textContent = data.project?.due || "Уточняется";
  element("project-manager").textContent = data.project?.manager || "Рокнорд";
  element("project-next").textContent =
    data.project?.next_step ||
    "Свяжитесь с координатором для согласования состава работ.";
  const documents = element("document-list");
  documents.replaceChildren();
  data.documents.forEach((doc) => {
    const row = node("div", "");
    row.className = "account-document";
    const info = node("div", "");
    info.append(
      node("h3", doc.title),
      node(
        "p",
        `${doc.category} · ${date(doc.created)} · ${Math.max(1, Math.round(doc.size / 1024))} КБ`,
      ),
    );
    const link = document.createElement("a");
    link.href = `/portal-api/portal.php?action=download&id=${encodeURIComponent(doc.id)}`;
    link.textContent = "Скачать ↓";
    link.setAttribute("aria-label", `Скачать: ${doc.title}`);
    row.append(info, link);
    documents.append(row);
  });
  if (!data.documents.length)
    documents.append(
      node("p", "Документы появятся после согласования проекта."),
    );
  const tasks = element("task-list");
  tasks.replaceChildren();
  data.tasks.forEach((task) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.done);
    const text = node("span", task.title);
    if (task.due) text.append(node("small", `Срок: ${task.due}`));
    label.append(checkbox, text);
    tasks.append(label);
    checkbox.addEventListener("change", async () => {
      checkbox.disabled = true;
      try {
        await api("task", { id: task.id, done: checkbox.checked });
        notify("Статус задачи сохранён.");
      } catch (e) {
        checkbox.checked = !checkbox.checked;
        notify((e as Error).message);
      } finally {
        checkbox.disabled = false;
      }
    });
  });
  if (!data.tasks.length)
    tasks.append(node("p", "Сейчас нет назначенных задач."));
  const messages = element("message-list");
  messages.replaceChildren();
  data.messages.forEach((message) => {
    const li = node("li", "");
    li.dataset.author = message.author;
    li.append(
      node("strong", message.author === "team" ? "Координатор Рокнорд" : "Вы"),
      node("small", ` · ${date(message.created)}`),
      node("p", message.body),
    );
    messages.append(li);
  });
  if (!data.messages.length)
    messages.append(
      node("li", "Начните переписку с вопроса по вашему проекту."),
    );
}
async function initialize() {
  try {
    const session = await api("session");
    csrf = session.csrf;
    if (!session.user) {
      signedOut();
      notify("");
      return;
    }
    await refresh();
    element("client-company").textContent = session.user.company;
    element("client-name").textContent =
      `${session.user.name} · ${session.user.email}`;
    element("portal-demo").hidden = !session.user.demo;
    login.hidden = true;
    workspace.hidden = false;
    notify("");
  } catch (e) {
    signedOut();
    notify((e as Error).message);
  }
}
function bindForm(
  id: string,
  handler: (form: HTMLFormElement, values: FormData) => Promise<void>,
) {
  const form = element<HTMLFormElement>(id);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector("button")!;
    button.disabled = true;
    notify("Выполняем…");
    try {
      await handler(form, new FormData(form));
    } catch (e) {
      notify((e as Error).message);
    } finally {
      button.disabled = false;
    }
  });
}
bindForm("login-form", async (form, values) => {
  const session = await api("session");
  csrf = session.csrf;
  await api("login", Object.fromEntries(values));
  form.reset();
  await initialize();
  if (!workspace.hidden) {
    element("project-title").tabIndex = -1;
    element("project").scrollIntoView({ block: "start" });
    element("project-title").focus({ preventScroll: true });
  }
});
bindForm("message-form", async (form, values) => {
  await api("message", { body: values.get("body") });
  form.reset();
  await refresh();
  notify("Сообщение сохранено в переписке проекта.");
});
bindForm("upload-form", async (form, values) => {
  const file = values.get("file") as File;
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Размер PDF не должен превышать 10 МБ.");
  await api("upload", values);
  form.reset();
  await refresh();
  notify("Документ передан в проект.");
});
bindForm("password-form", async (form, values) => {
  if (values.get("password") !== values.get("confirmation"))
    throw new Error("Новые пароли не совпадают.");
  const result = await api("password", {
    current: values.get("current"),
    password: values.get("password"),
  });
  csrf = result.csrf;
  form.reset();
  notify("Пароль изменён. Остальные сеансы завершены.");
});
element("portal-logout").addEventListener("click", async () => {
  try {
    await api("logout", {});
    signedOut();
    notify("Вы вышли из кабинета.");
    element<HTMLFormElement>("login-form").querySelector("input")?.focus();
  } catch (e) {
    notify((e as Error).message);
  }
});
element("portal-refresh").addEventListener("click", async () => {
  try {
    await refresh();
    notify("Данные обновлены.");
  } catch (e) {
    notify((e as Error).message);
  }
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    signedOut();
    initialize();
  }
});
initialize();
