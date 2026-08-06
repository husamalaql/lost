import { getStore } from "@netlify/blobs";
import { SEED_DATA } from "./seed.mjs";

const STORE_NAME = "lostfound";
const DATA_KEY = "data_v2";

const store = () => getStore(STORE_NAME, { consistency: "strong" });

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function readDataWithMeta() {
  const entry = await store().getWithMetadata(DATA_KEY, { type: "json" });
  let data = entry ? entry.data : null;
  if (!data || !Array.isArray(data.lost) || !Array.isArray(data.found)) {
    data = JSON.parse(JSON.stringify(SEED_DATA));
    const written = await store().setJSON(DATA_KEY, data);
    return { data: data, etag: written.etag };
  }
  return { data: data, etag: entry.etag };
}

async function readData() {
  return (await readDataWithMeta()).data;
}

async function mutate(fn) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, etag } = await readDataWithMeta();
    const result = fn(data);
    if (result === false) return;
    const res = await store().setJSON(DATA_KEY, data, { onlyIfMatch: etag });
    if (res && res.modified !== false) return;
  }
  throw new Error("تعارض في الكتابة المتزامنة، حاول مجدداً");
}

function nextId(section, data) {
  let max = 0;
  (data[section] || []).forEach(function (item) {
    if (Number(item.id) > max) max = Number(item.id);
  });
  return max + 1;
}

export default async (req) => {
  try {
    const method = req.method || "GET";

    if (method === "GET") {
      return json(await readData());
    }

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      return json({ error: "جسم الطلب غير صالح" }, 400);
    }

    if (method === "POST") {
      const section = body.section;
      const item = body.item;
      if ((section !== "lost" && section !== "found") || !item || typeof item !== "object") {
        return json({ error: "بيانات غير صالحة" }, 400);
      }
      let saved = null;
      await mutate(function (data) {
        item.id = nextId(section, data);
        data[section].push(item);
        saved = item;
      });
      return json(saved);
    }

    if (method === "DELETE") {
      const section = body.section;
      const id = Number(body.id);
      if ((section !== "lost" && section !== "found") || !Number.isFinite(id)) {
        return json({ error: "بيانات غير صالحة" }, 400);
      }
      await mutate(function (data) {
        data[section] = data[section].filter(function (item) {
          return Number(item.id) !== id;
        });
      });
      return json({ ok: true });
    }

    return json({ error: "طريقة غير مدعومة" }, 405);
  } catch (err) {
    console.error(err);
    return json({ error: "خطأ داخلي في الخادم: " + (err && err.message ? err.message : "غير معروف") }, 500);
  }
};
