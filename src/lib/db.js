const DB_NAME    = 'memorial_rsc_db';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = () => reject(req.error);
  });
}

async function fileToRecord(file) {
  const buffer = await file.arrayBuffer();
  return { name: file.name, type: file.type, buffer };
}

function recordToFile({ name, type, buffer }) {
  return new File([buffer], name, { type });
}

export async function saveToIDB(userId, dados, items) {
  const db = await openDB();
  const serializedItems = await Promise.all(
    items.map(async item => ({
      ...item,
      files: await Promise.all((item.files || []).map(fileToRecord)),
    }))
  );
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(
      { dados, items: serializedItems, savedAt: new Date().toISOString() },
      userId
    );
    tx.oncomplete = resolve;
    req.onerror   = () => reject(req.error);
  });
}

export async function loadFromIDB(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(userId);
    req.onsuccess = () => {
      const result = req.result;
      if (!result) { resolve(null); return; }
      resolve({
        dados: result.dados,
        items: result.items.map(item => ({
          ...item,
          files: (item.files || []).map(recordToFile),
        })),
      });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearFromIDB(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(userId);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}
