const FORMAT_VERSION = 1;

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function base64ToFile({ name, type, data }) {
  const [header, b64] = data.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const raw  = atob(b64);
  const buf  = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return new File([buf], name, { type: type || mime });
}

async function serializeState(dados, items) {
  const serializedItems = await Promise.all(
    items.map(async item => ({
      ...item,
      isOpen: false,
      files: await Promise.all((item.files || []).map(fileToBase64)),
    }))
  );
  return { version: FORMAT_VERSION, exportedAt: new Date().toISOString(), dados, items: serializedItems };
}

function deserializeState({ dados, items }) {
  return {
    dados,
    items: items.map(item => ({
      ...item,
      files: (item.files || []).map(base64ToFile),
    })),
  };
}

export async function exportToJson(dados, items) {
  const payload = await serializeState(dados, items);
  const blob    = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  const nome    = (dados.nome || 'rascunho').replace(/\s+/g, '_');
  a.href        = url;
  a.download    = `memorial_${nome}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.dados || !Array.isArray(json.items)) {
          reject(new Error('Arquivo JSON não é um memorial válido.'));
          return;
        }
        resolve(deserializeState(json));
      } catch {
        reject(new Error('Arquivo JSON inválido ou corrompido.'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsText(file);
  });
}
