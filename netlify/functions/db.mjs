import { getStore } from "@netlify/blobs";
import { SEED_DATA } from "./seed.mjs";

const STORE_NAME = "lostfound";
const DATA_KEY = "data";

const store = () => getStore(STORE_NAME, { consistency: "strong" });

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function readData() {
  let data = await store().get(DATA_KEY, { type: "json" });
  if (!data || !Array.isArray(data.lost) || !Array.isArray(data.found)) {
    data = JSON.parse(JSON.stringify(SEED_DATA));
    await store().setJSON(DATA_KEY, data);
  }
  return data;
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
      /* empty body allowed */
    }

    if (method === "POST") {
      const section = body.section;
      const item = body.item;
      if ((section !== "lost" && section !== "found") || !item || typeof item !== "object") {
        return json({ error: "بيانات غير صالحة" }, 400);
      }
      const data = await readData();
      item.id = nextId(section, data);
      data[section].push(item);
      await store().setJSON(DATA_KEY, data);
      return json(item);
    }

    if (method === "DELETE") {
      const section = body.section;
      const id = Number(body.id);
      if ((section !== "lost" && section !== "found") || !Number.isFinite(id)) {
        return json({ error: "بيانات غير صالحة" }, 400);
      }
      const data = await readData();
      data[section] = data[section].filter(function (item) {
        return Number(item.id) !== id;
      });
      await store().setJSON(DATA_KEY, data);
      return json({ ok: true });
    }

    return json({ error: "طريقة غير مدعومة" }, 405);
  } catch (err) {
    console.error(err);
    return json({ error: "خطأ داخلي في الخادم" }, 500);
  }
};
