const BASE = import.meta.env.VITE_API_URL;

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function apiPost(path, data, init = {}) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    body: JSON.stringify(data),
  }).then(handle);
}
