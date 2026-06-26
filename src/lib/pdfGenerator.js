import { getCriterio, calcular } from './engine';
import { pluralUnidade } from './pluralUnidade';

const azulIFSC  = [11, 58, 117];
const verdeIFSC = [28, 124, 59];
const cinzaCard = [243, 247, 252];
const bordaCard = [197, 214, 235];
const labelCor  = [95, 115, 145];
const textoCor  = [22, 38, 68];

// Garante que qualquer valor chegue ao doc.text() como string segura
const safeStr = (v) => (v == null || typeof v === 'object') ? '' : String(v);

function drawPageHeader(doc, title, logoWhiteDataUrl, logoNatW, logoNatH) {
  doc.setFillColor(...azulIFSC); doc.rect(0, 0, 210, 22, 'F');
  const lH = 14.3, lW = lH * (logoNatW / logoNatH);
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 5, (22 - lH) / 2, lW, lH, 'logo-w', 'FAST'); } catch {}
  }
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  doc.text(title, 105, 14, { align: 'center' });
  doc.setFillColor(...verdeIFSC); doc.rect(0, 22, 210, 2.5, 'F');
}

function drawPageFooter(doc) {
  const fy = 284;
  doc.setFillColor(...azulIFSC); doc.rect(0, fy, 210, 13, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text('Instituto Federal de Santa Catarina — IFSC  |  www.ifsc.edu.br', 105, fy + 8, { align: 'center' });
}

function drawFieldCard(doc, label, value, x, y, w, h) {
  doc.setFillColor(...cinzaCard);
  doc.setDrawColor(...bordaCard);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...labelCor);
  doc.text(label.toUpperCase(), x + 3.5, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...textoCor);
  const strVal = (value != null && typeof value !== 'object') ? String(value) : '';
  const val = (strVal.trim() && strVal !== 'Não informado' && strVal !== 'Não informada') ? strVal : '—';
  const wrapped = doc.splitTextToSize(val, w - 7);
  doc.text(wrapped[0], x + 3.5, y + 13.5);
}

function rasterizeSvg(src, widthPx) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const h = Math.round(widthPx * (img.naturalHeight || 148) / (img.naturalWidth || 520));
      const cv = document.createElement('canvas');
      cv.width = widthPx; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, widthPx, h);
      resolve({ dataUrl: cv.toDataURL('image/png'), natW: img.naturalWidth || 520, natH: img.naturalHeight || 148 });
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function getLogoDataUrls() {
  let logoWhiteDataUrl = null, logoNatW = 520, logoNatH = 148;
  try {
    const r = await rasterizeSvg('/logo-cppd-branca.png', 200);
    if (r) { logoWhiteDataUrl = r.dataUrl; logoNatW = r.natW; logoNatH = r.natH; }
  } catch { /* logo optional */ }
  return { logoWhiteDataUrl, logoNatW, logoNatH };
}

function buildCapa(jsPDF, dados, logoWhiteDataUrl, logoNatW, logoNatH) {
  const { jsPDF: JPDF } = window.jspdf;
  const doc = new JPDF();
  const { nome: serverNome, siape: serverSiape, nivelPretendido: serverNivel,
          email, celular, rt, portariaRt, dataRt, dataLimite, declaranteNome,
          declaranteSiape, cidade } = dados;

  const logoCapaW = 22.4;
  const logoCapaH = logoCapaW * (logoNatH / logoNatW);
  const logoCapaY = (33 - logoCapaH) / 2;

  doc.setFillColor(...azulIFSC); doc.rect(0, 0, 210, 33, 'F');
  doc.setFillColor(...verdeIFSC); doc.rect(0, 33, 210, 3.5, 'F');
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 7, logoCapaY, logoCapaW, logoCapaH, 'logo-w', 'FAST'); } catch {}
  }
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(13.5);
  doc.text('INSTITUTO FEDERAL DE SANTA CATARINA', 105, 17, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(180, 210, 255);
  doc.text('Comissão Permanente de Pessoal Docente (CPPD)', 105, 27, { align: 'center' });

  // Left green stripe — extends to footer top
  doc.setFillColor(...verdeIFSC); doc.rect(0, 36.5, 5, 247.5, 'F');

  doc.setDrawColor(200, 218, 240); doc.setLineWidth(0.4);
  doc.line(22, 60, 68, 60); doc.line(142, 60, 188, 60);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(130, 150, 180);
  doc.text('R  E  L  A  T  Ó  R  I  O', 105, 63.5, { align: 'center' });
  doc.setDrawColor(...verdeIFSC); doc.setLineWidth(1.2); doc.line(55, 67.5, 155, 67.5);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(13.5); doc.setTextColor(...azulIFSC);
  const titleLines = doc.splitTextToSize('SOLICITAÇÃO DE RECONHECIMENTO DE SABERES E COMPETÊNCIAS (RSC) NA CARREIRA EBTT', 162);
  doc.text(titleLines, 105, 78, { align: 'center' });

  const nivelBadgeY = 78 + titleLines.length * 7.5 + 5;
  const nivelLabel  = `Nível Pretendido: ${serverNivel || '—'}`;
  const nivelW      = doc.getTextWidth(nivelLabel) + 20;
  doc.setFillColor(...verdeIFSC); doc.roundedRect(105 - nivelW / 2, nivelBadgeY - 6, nivelW, 10.5, 2.5, 2.5, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(255, 255, 255);
  doc.text(nivelLabel, 105, nivelBadgeY, { align: 'center' });

  const sep1Y = nivelBadgeY + 12;
  doc.setDrawColor(210, 222, 238); doc.setLineWidth(0.3); doc.line(12, sep1Y, 198, sep1Y);

  const H  = 17;   // card height (mm)
  const TW = 186;  // title bar width: x=12 to x=198
  const G  = 4;    // gap between cards and next title bar (mm)

  function sectionTitle(label, y) {
    doc.setFillColor(...azulIFSC); doc.roundedRect(12, y - 6, TW, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(255, 255, 255);
    doc.text(label, 105, y, { align: 'center' });
  }

  // IDENTIFICAÇÃO DO SERVIDOR
  const dadosTitleY = sep1Y + 9;
  sectionTitle('IDENTIFICAÇÃO DO SERVIDOR', dadosTitleY);
  const cardY = dadosTitleY + 6;
  drawFieldCard(doc, 'Nome Completo', serverNome, 12, cardY, 130, H);
  drawFieldCard(doc, 'SIAPE', serverSiape, 147, cardY, 51, H);
  drawFieldCard(doc, 'E-mail Institucional', email, 12, cardY + H + 3, 95, H);
  drawFieldCard(doc, 'Celular', celular, 112, cardY + H + 3, 40, H);
  drawFieldCard(doc, 'Nível RSC Pretendido', serverNivel, 157, cardY + H + 3, 41, H);

  // RETRIBUIÇÃO POR TITULAÇÃO
  const rtY = cardY + 2 * (H + 3) + G + 6;
  sectionTitle('RETRIBUIÇÃO POR TITULAÇÃO', rtY);
  const rtCards = rtY + 6;
  drawFieldCard(doc, 'Retribuição por Titulação', rt || 'Nenhuma', 12,  rtCards, 52, H);
  drawFieldCard(doc, 'Número da Portaria',         portariaRt,       69,  rtCards, 65, H);
  drawFieldCard(doc, 'Data de Concessão',           dataRt,           139, rtCards, 59, H);

  // OUTRAS INFORMAÇÕES
  const outY = rtCards + H + G + 6;
  sectionTitle('OUTRAS INFORMAÇÕES', outY);
  const outCards = outY + 6;
  drawFieldCard(doc, 'Última Data dos Documentos (Limite)', dataLimite, 12, outCards, 94, H);

  // DADOS DO DECLARANTE E LOCAL
  const decY = outCards + H + G + 6;
  sectionTitle('DADOS DO DECLARANTE E LOCAL', decY);
  const decCards = decY + 6;
  // Equal-width distribution: 3 × 58mm with 6mm gaps (12→70, 76→134, 140→198)
  drawFieldCard(doc, 'Nome do Declarante', declaranteNome, 12,  decCards, 58, H);
  drawFieldCard(doc, 'SIAPE Declarante',   declaranteSiape, 76,  decCards, 58, H);
  drawFieldCard(doc, 'Cidade',             cidade,          140, decCards, 58, H);

  // Date line: Cidade, DD de mês de YYYY
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const hoje = new Date();
  const cidadeStr = safeStr(cidade).trim();
  const dataStr = `${cidadeStr ? cidadeStr + ', ' : ''}${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}.`;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...labelCor);
  doc.text(dataStr, 105, decCards + H + 10, { align: 'center' });

  // Footer bar fixed at bottom
  const footerY = 284;
  doc.setFillColor(...azulIFSC); doc.rect(0, footerY, 210, 13, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text('Instituto Federal de Santa Catarina — IFSC  |  www.ifsc.edu.br', 105, footerY + 8, { align: 'center' });

  return doc;
}

export async function generatePdf(items, dados, onProgress) {
  if (!window.jspdf || !window.PDFLib || !window.saveAs) throw new Error('Bibliotecas não carregadas.');
  if (items.length === 0) throw new Error('Adicione pelo menos um item antes de gerar o PDF.');

  const { PDFDocument, rgb, StandardFonts, degrees } = window.PDFLib;
  const { jsPDF: JPDF } = window.jspdf;

  onProgress?.('Carregando logo...');
  const { logoWhiteDataUrl, logoNatW, logoNatH } = await getLogoDataUrls();
  const logoRodapeH = 11.2;
  const logoRodapeW = logoRodapeH * (logoNatW / logoNatH);

  const finalPdf   = await PDFDocument.create();
  const helvetica  = await finalPdf.embedFont(StandardFonts.Helvetica);

  onProgress?.('Gerando capa...');
  const capaDoc = buildCapa(JPDF, dados, logoWhiteDataUrl, logoNatW, logoNatH);
  const capaPdf = await PDFDocument.load(capaDoc.output('arraybuffer'));

  // Memorial descritivo
  let decPdf = null;
  if (dados.memorialTexto?.trim()) {
    const decDoc = new JPDF();
    drawPageHeader(decDoc, 'MEMORIAL DESCRITIVO', logoWhiteDataUrl, logoNatW, logoNatH);
    drawPageFooter(decDoc);
    decDoc.setFont('helvetica', 'normal'); decDoc.setFontSize(11); decDoc.setTextColor(30, 30, 30);
    const lines = decDoc.splitTextToSize(dados.memorialTexto, 170);
    decDoc.text(lines, 20, 40);

    // Local, data e assinatura
    const mesesMem = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const hojeMem  = new Date();
    const cidadeMem = safeStr(dados.cidade).trim();
    const dataMem = `${cidadeMem ? cidadeMem + ', ' : ''}${hojeMem.getDate()} de ${mesesMem[hojeMem.getMonth()]} de ${hojeMem.getFullYear()}.`;
    let mY = 40 + lines.length * 6.5 + 28;
    decDoc.text(dataMem, 105, mY, { align: 'center' });
    mY += 37;
    decDoc.text('__________________________________________', 105, mY, { align: 'center' });
    mY += 7;
    decDoc.setFont('helvetica', 'bold'); decDoc.setFontSize(11);
    decDoc.text('Assinatura Autenticável', 105, mY, { align: 'center' });
    mY += 6;
    decDoc.setFont('helvetica', 'normal'); decDoc.setFontSize(9); decDoc.setTextColor(80, 80, 80);
    decDoc.text('(Gov.br ou ICP-Edu/IFSC)', 105, mY, { align: 'center' });
    mY += 9;
    decDoc.setFont('helvetica', 'bold'); decDoc.setFontSize(11); decDoc.setTextColor(...azulIFSC);
    decDoc.text(safeStr(dados.nome) || '—', 105, mY, { align: 'center' });
    mY += 6;
    decDoc.setFont('helvetica', 'normal'); decDoc.setFontSize(10); decDoc.setTextColor(30, 30, 30);
    decDoc.text(`SIAPE nº ${safeStr(dados.siape) || '—'}`, 105, mY, { align: 'center' });

    decPdf = await PDFDocument.load(decDoc.output('arraybuffer'));
  }

  onProgress?.('Processando comprovantes...');
  const temDeclarante = !!(safeStr(dados.declaranteNome).trim() || safeStr(dados.declaranteSiape).trim() || safeStr(dados.cidade).trim());

  // ── Group items by diretriz, preserving sorted order ──────────────────
  const dirGroups = [];
  const dirKeyMap = {};
  for (const item of items) {
    const crit = getCriterio(item.codigo);
    if (!crit) continue;
    const key = `${crit.nivel}__${crit.diretriz}`;
    if (!dirKeyMap[key]) {
      const g = { key, nivel: crit.nivel, diretriz: crit.diretriz, entries: [] };
      dirGroups.push(g); dirKeyMap[key] = g;
    }
    dirKeyMap[key].entries.push({ item, crit });
  }

  // ── Card layout helpers (professional card design, no table) ──────────
  const TX = 15, TW = 170;

  const drawCritSubHdr = (d, y, crit, count, totalPts) => {
    const ptsStr   = totalPts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const countStr = `${count} registro${count !== 1 ? 's' : ''} cadastrado${count !== 1 ? 's' : ''}`;
    const titleH = 10, sumH = 7, fullH = titleH + sumH;

    // Layer 1: full block in dark navy — provides unified outer shape with rounded corners
    d.setFillColor(7, 42, 95);
    d.roundedRect(TX, y, TW, fullH, 2, 2, 'F');

    // Layer 2: title area in azulIFSC — rounded top, flat bottom (rect squaring off the lower edge)
    d.setFillColor(...azulIFSC);
    d.roundedRect(TX, y, TW, titleH, 2, 2, 'F');
    d.rect(TX, y + titleH - 2, TW, 2, 'F');

    // Title text
    d.setFont('helvetica', 'bold'); d.setFontSize(9); d.setTextColor(255, 255, 255);
    d.text(`Critério ${crit.codigo} —`, TX + 3, y + 7);
    const prefW = d.getTextWidth(`Critério ${crit.codigo} — `);
    const descParts = d.splitTextToSize(crit.descricao, TW - 8 - prefW);
    d.setFont('helvetica', 'normal'); d.setFontSize(8.5); d.setTextColor(200, 220, 255);
    d.text(descParts[0] + (descParts.length > 1 ? '…' : ''), TX + 3 + prefW, y + 7);

    // Summary text (inside dark navy area)
    d.setFont('helvetica', 'normal'); d.setFontSize(7); d.setTextColor(150, 188, 232);
    d.text(countStr, TX + 3.5, y + titleH + 4.8);
    d.setFont('helvetica', 'bold'); d.setFontSize(7.5); d.setTextColor(255, 255, 255);
    d.text(`${ptsStr} pontos`, TX + TW - 3.5, y + titleH + 4.8, { align: 'right' });

    return fullH + 4;
  };

  const estimateCardH = (d, item) => {
    d.setFont('helvetica', 'bold'); d.setFontSize(9.5);
    const descLines = d.splitTextToSize(String(item.docDescricao || '—'), TW - 8);
    const hasObs = !!(item.observacao && typeof item.observacao === 'string' && item.observacao.trim());
    d.setFont('helvetica', 'normal'); d.setFontSize(7.5);
    const obsLines = hasObs ? d.splitTextToSize(String(item.observacao), TW - 8) : [];
    const contentH = 7.5 + 3.5 + descLines.length * 5.5 + (hasObs ? 2 + obsLines.length * 4 : 0) + 3.5;
    return contentH + 10 + 3;
  };

  const drawItemCard = (d, y, rowNum, item, crit, pageLabel = null) => {
    const qty     = String(item.quantidade ?? '0');
    const pts     = (parseFloat(qty) * crit.fator).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const qtyStr  = `${qty} ${pluralUnidade(crit.unidade, qty)}`;
    const rawData = (item.data && typeof item.data === 'string') ? item.data : '';
    const dateStr = rawData ? rawData.split('-').reverse().join('/') : '—';
    const hasObs  = !!item.observacao?.trim();

    d.setFont('helvetica', 'bold'); d.setFontSize(9.5);
    const descLines = d.splitTextToSize(String(item.docDescricao || '—'), TW - 8);
    d.setFont('helvetica', 'normal'); d.setFontSize(7.5);
    const obsLines = hasObs ? d.splitTextToSize(String(item.observacao || ''), TW - 8) : [];

    const topH    = 7.5;
    const descPad = 3.5;
    const descH   = descLines.length * 5.5;
    const obsH    = hasObs ? 2 + obsLines.length * 4 : 0;
    const botPad  = 3.5;
    const footH   = 10;
    const contentH = topH + descPad + descH + obsH + botPad;
    const totalH   = contentH + footH;

    // Card shell
    d.setFillColor(252, 253, 255);
    d.setDrawColor(...bordaCard);
    d.setLineWidth(0.25);
    d.roundedRect(TX, y, TW, totalH, 2, 2, 'FD');

    // Top metadata strip
    d.setFillColor(240, 245, 252);
    d.roundedRect(TX + 0.25, y + 0.25, TW - 0.5, topH, 2, 2, 'F');
    d.rect(TX + 0.25, y + topH - 1.5, TW - 0.5, 1.5, 'F');
    d.setLineWidth(0.15); d.setDrawColor(...bordaCard);
    d.line(TX, y + topH, TX + TW, y + topH);

    // "ITEM N" label
    d.setFont('helvetica', 'bold'); d.setFontSize(7); d.setTextColor(...azulIFSC);
    d.text(`ITEM ${rowNum}`, TX + 4, y + 5.3);

    // "Data:" label + value
    d.setFont('helvetica', 'normal'); d.setFontSize(7); d.setTextColor(130, 148, 175);
    d.text('Data:', TX + TW - 33, y + 5.3);
    d.setFont('helvetica', 'bold'); d.setFontSize(7); d.setTextColor(50, 75, 112);
    d.text(dateStr, TX + TW - 3, y + 5.3, { align: 'right' });
    if (pageLabel) {
      d.setFont('helvetica', 'normal'); d.setFontSize(6); d.setTextColor(130, 148, 175);
      d.text('Páginas:', TX + 55, y + 5.3);
      d.setFont('helvetica', 'bold'); d.setFontSize(6); d.setTextColor(...azulIFSC);
      d.text(pageLabel, TX + 70, y + 5.3);
    }

    // Description (bold)
    d.setFont('helvetica', 'bold'); d.setFontSize(9.5); d.setTextColor(...textoCor);
    d.text(descLines, TX + 4, y + topH + descPad + 4.5);

    // Observação
    if (hasObs) {
      const obsY = y + topH + descPad + descH + 2 + 3.5;
      d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(100, 115, 135);
      d.text(obsLines, TX + 4, obsY);
    }

    // Score footer — three equal columns
    const fY = y + contentH;
    d.setFillColor(228, 238, 255);
    d.roundedRect(TX + 0.25, fY, TW - 0.5, footH - 0.25, 2, 2, 'F');
    d.rect(TX + 0.25, fY, TW - 0.5, 2, 'F');
    d.setLineWidth(0.15); d.setDrawColor(...bordaCard);
    d.line(TX, fY, TX + TW, fY);

    const bW = TW / 3;
    d.setLineWidth(0.2); d.setDrawColor(198, 216, 242);
    d.line(TX + bW,     fY + 1.5, TX + bW,     fY + footH - 1.5);
    d.line(TX + bW * 2, fY + 1.5, TX + bW * 2, fY + footH - 1.5);

    const lY = fY + 3.5;
    const vY = fY + 8;
    const cx = [TX + bW / 2, TX + bW * 1.5, TX + bW * 2.5];

    [
      ['QUANTIDADE', qtyStr,           cx[0]],
      ['FATOR',      String(crit.fator), cx[1]],
      ['PONTOS',     pts,               cx[2]],
    ].forEach(([lbl, val, x]) => {
      d.setFont('helvetica', 'normal'); d.setFontSize(6.5); d.setTextColor(108, 125, 152);
      d.text(lbl, x, lY, { align: 'center' });
      d.setFont('helvetica', 'bold');
      d.setFontSize(lbl === 'PONTOS' ? 10 : 8.5);
      d.setTextColor(...azulIFSC);
      d.text(val, x, vY, { align: 'center' });
    });

    return totalH + 3;
  };

  // ── Phase 1: Pre-load all files to count pages per item ───────────────
  const groupPreData = [];
  for (const group of dirGroups) {
    const critStats = {};
    for (const { item, crit } of group.entries) {
      if (!critStats[crit.codigo]) critStats[crit.codigo] = { count: 0, total: 0 };
      critStats[crit.codigo].count++;
      critStats[crit.codigo].total += parseFloat(item.quantidade || '0') * crit.fator;
    }
    const entriesData = [];
    for (const { item, crit } of group.entries) {
      const loadedFiles = [];
      let filePageCount = 0;
      for (const file of (item.files || [])) {
        const buffer = await file.arrayBuffer();
        if (file.type === 'application/pdf') {
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          filePageCount += pdfDoc.getPageCount();
          loadedFiles.push({ type: 'pdf', doc: pdfDoc });
        } else if (file.type.startsWith('image/')) {
          const imgEmbed = file.type === 'image/png'
            ? await finalPdf.embedPng(buffer)
            : await finalPdf.embedJpg(buffer);
          filePageCount++;
          loadedFiles.push({ type: 'image', img: imgEmbed });
        }
      }
      entriesData.push({ item, crit, loadedFiles, filePageCount });
    }
    groupPreData.push({ group, entries: entriesData, critStats });
  }

  // ── Phase 2: Simulate sumário page count (mirrors actual loop) ─────────
  const totalItems = groupPreData.reduce((sum, g) => sum + g.entries.length, 0);
  let simSumY = 40, sumPageCount = 1;
  for (let i = 0; i < totalItems; i++) {
    if (simSumY > 275) { sumPageCount++; simSumY = 40; }
    simSumY += 16;
  }

  // ── Phase 3: Simulate cover page count per group ───────────────────────
  const simDoc = new JPDF();
  for (const gd of groupPreData) {
    let coverPageCount = 1, tableY = 40, lastCodigo = null;
    for (const { item, crit } of gd.entries) {
      if (crit.codigo !== lastCodigo) {
        if (tableY + 21 > 275) { coverPageCount++; tableY = 40; }
        tableY += 21; // drawCritSubHdr always returns 21
        lastCodigo = crit.codigo;
      }
      const cardH = estimateCardH(simDoc, item);
      if (tableY + cardH - 3 > 275) { coverPageCount++; tableY = 40; }
      tableY += cardH + 3;
    }
    gd.coverPageCount = coverPageCount;
  }

  // ── Phase 4: Compute exact page numbers for each item's attached files ─
  let pageCounter = 1 + (decPdf ? 1 : 0) + (temDeclarante ? 1 : 0) + sumPageCount;
  for (const gd of groupPreData) {
    pageCounter += gd.coverPageCount;
    for (const entry of gd.entries) {
      entry.fileStartPage = entry.filePageCount > 0 ? pageCounter + 1 : null;
      pageCounter += entry.filePageCount;
      entry.fileEndPage   = entry.filePageCount > 0 ? pageCounter : null;
    }
  }

  // ── Phase 5: Draw cover pages with page labels, build groupMetas ────────
  const itemMetas  = [];
  const groupMetas = [];

  for (const { group, entries, critStats } of groupPreData) {
    const hdrTitle = `Diretriz ${group.diretriz}`;
    const coverDoc = new JPDF();
    drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
    drawPageFooter(coverDoc);
    let tableY = 40, lastCodigo = null, rowNum = 0;

    for (const { item, crit, fileStartPage, fileEndPage, filePageCount } of entries) {
      rowNum++;
      if (crit.codigo !== lastCodigo) {
        if (tableY + 21 > 275) {
          coverDoc.addPage();
          drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
          drawPageFooter(coverDoc);
          tableY = 40;
        }
        const stats = critStats[crit.codigo];
        tableY += drawCritSubHdr(coverDoc, tableY, crit, stats.count, stats.total);
        lastCodigo = crit.codigo;
      }
      const pageLabel = (filePageCount > 0 && fileStartPage && fileEndPage)
        ? (fileStartPage === fileEndPage ? `Página ${fileStartPage}` : `Páginas ${fileStartPage}–${fileEndPage}`)
        : null;
      const cardH = estimateCardH(coverDoc, item);
      if (tableY + cardH - 3 > 275) {
        coverDoc.addPage();
        drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
        drawPageFooter(coverDoc);
        tableY = 40;
      }
      tableY += drawItemCard(coverDoc, tableY, rowNum, item, crit, pageLabel);

      itemMetas.push({
        index: itemMetas.length + 1,
        title: `Diretriz ${crit.diretriz} — Critério ${crit.codigo}`,
        docDesc: item.docDescricao,
        startPage: fileStartPage,
        endPage: fileEndPage,
        filePageCount,
      });
    }

    const coverPdf = await PDFDocument.load(coverDoc.output('arraybuffer'));
    groupMetas.push({ coverPdf, entries: entries.map(e => ({ loadedFiles: e.loadedFiles })) });
  }

  // Sumário
  onProgress?.('Gerando sumário...');
  const sumDoc = new JPDF();
  drawPageHeader(sumDoc, 'SUMÁRIO', logoWhiteDataUrl, logoNatW, logoNatH);
  drawPageFooter(sumDoc);
  let sumY = 40;
  for (const meta of itemMetas) {
    if (sumY > 275) {
      sumDoc.addPage();
      drawPageHeader(sumDoc, 'SUMÁRIO', logoWhiteDataUrl, logoNatW, logoNatH);
      drawPageFooter(sumDoc);
      sumY = 40;
    }
    const pageText = !meta.startPage
      ? 'Sem comprovante'
      : (meta.startPage === meta.endPage ? `Página ${meta.startPage}` : `Páginas ${meta.startPage} a ${meta.endPage}`);
    sumDoc.setFont('helvetica', 'bold'); sumDoc.setTextColor(30, 30, 30); sumDoc.setFontSize(11);
    sumDoc.text(`Item ${meta.index}: ${meta.title}`, 20, sumY);
    const rawDesc = (meta.docDesc && typeof meta.docDesc === 'string') ? meta.docDesc : '';
    const td = rawDesc.length > 55 ? rawDesc.substring(0, 52) + '...' : rawDesc;
    sumDoc.setFont('helvetica', 'normal'); sumDoc.setFontSize(9); sumDoc.setTextColor(100, 100, 100);
    sumDoc.text(td || 'Sem descrição', 20, sumY + 5);
    sumDoc.setFontSize(11); sumDoc.setTextColor(...azulIFSC); sumDoc.setFont('helvetica', 'bold');
    sumDoc.text(pageText, 160, sumY + 2);
    sumDoc.setDrawColor(230, 230, 230); sumDoc.line(20, sumY + 8, 190, sumY + 8);
    sumY += 16;
  }
  const sumPdf = await PDFDocument.load(sumDoc.output('arraybuffer'));

  // Declaração de Confere com o Original — omitida se declarante não preenchido
  let decSimplesPdf = null;
  if (!temDeclarante) {
    // skip
  } else {
  const decDocSimples = new JPDF();
  drawPageHeader(decDocSimples, 'DECLARAÇÃO DE CONFERE COM O ORIGINAL', logoWhiteDataUrl, logoNatW, logoNatH);
  drawPageFooter(decDocSimples);
  const declaranteNome   = safeStr(dados.declaranteNome);
  const declaranteSiape  = safeStr(dados.declaranteSiape);
  const cidade           = safeStr(dados.cidade);

  decDocSimples.setFont('helvetica', 'normal'); decDocSimples.setFontSize(11); decDocSimples.setTextColor(30, 30, 30);

  // Parágrafo 1
  const p1 = `Eu, ${declaranteNome || '—'}, portador(a) do SIAPE nº ${declaranteSiape || '—'}, declaro, para os devidos fins de direito, que os documentos constantes do presente memorial foram devidamente conferidos com seus respectivos originais, estando em plena conformidade com estes.`;
  const p1Lines = decDocSimples.splitTextToSize(p1, 170);
  decDocSimples.text(p1Lines, 20, 40);
  let dY = 40 + p1Lines.length * 6.5 + 14;

  // Parágrafo 2
  const p2 = 'Por ser expressão da verdade, firmo a presente declaração para que produza os efeitos legais cabíveis.';
  const p2Lines = decDocSimples.splitTextToSize(p2, 170);
  decDocSimples.text(p2Lines, 20, dY);
  dY += p2Lines.length * 6.5 + 28;

  // Local e data
  const mesesDec = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const hojeDec  = new Date();
  const cidadeDec = cidade.trim();
  const dataDec = `${cidadeDec ? cidadeDec + ', ' : ''}${hojeDec.getDate()} de ${mesesDec[hojeDec.getMonth()]} de ${hojeDec.getFullYear()}.`;
  decDocSimples.text(dataDec, 105, dY, { align: 'center' });
  dY += 37;

  // Linha de assinatura
  decDocSimples.text('__________________________________________', 105, dY, { align: 'center' });
  dY += 7;
  decDocSimples.setFont('helvetica', 'bold'); decDocSimples.setFontSize(11);
  decDocSimples.text('Assinatura Autenticável', 105, dY, { align: 'center' });
  dY += 6;
  decDocSimples.setFont('helvetica', 'normal'); decDocSimples.setFontSize(9); decDocSimples.setTextColor(80, 80, 80);
  decDocSimples.text('(Gov.br ou ICP-Edu/IFSC)', 105, dY, { align: 'center' });
  dY += 9;
  decDocSimples.setFont('helvetica', 'bold'); decDocSimples.setFontSize(11); decDocSimples.setTextColor(...azulIFSC);
  decDocSimples.text(declaranteNome || '—', 105, dY, { align: 'center' });
  dY += 6;
  decDocSimples.setFont('helvetica', 'normal'); decDocSimples.setFontSize(10); decDocSimples.setTextColor(30, 30, 30);
  decDocSimples.text(`SIAPE nº ${declaranteSiape || '—'}`, 105, dY, { align: 'center' });


  // Nota informativa (caixa cinza acima do rodapé)
  const noteText = 'Deve-se providenciar a juntada de toda a documentação, inclusive da presente declaração, em um único arquivo no formato PDF. Somente após essa unificação o documento deverá ser assinado digitalmente pelo DECLARANTE (servidor responsável pela conferência). Consideram-se válidas assinaturas digitais que possam ser verificadas em plataformas reconhecidas, tais como ICPEdu/IFSC ou portal Gov.br.';
  decDocSimples.setFont('helvetica', 'normal'); decDocSimples.setFontSize(7.5); decDocSimples.setTextColor(70, 85, 110);
  const noteLines = decDocSimples.splitTextToSize(noteText, 173);
  const noteH = noteLines.length * 3.8 + 8;  // height fitted to text
  const noteY = 284 - noteH - 2;              // 2mm above footer
  decDocSimples.setFillColor(245, 247, 250); decDocSimples.setDrawColor(200, 210, 225); decDocSimples.setLineWidth(0.3);
  decDocSimples.roundedRect(15, noteY, 180, noteH, 2, 2, 'FD');
  decDocSimples.text(noteLines, 18.5, noteY + 5);

  decSimplesPdf = await PDFDocument.load(decDocSimples.output('arraybuffer'));
  } // end if temDeclarante

  // Merge
  onProgress?.('Unificando PDF...');
  const addPages = async (src) => {
    if (!src) return;
    const ps = await finalPdf.copyPages(src, src.getPageIndices());
    ps.forEach(p => finalPdf.addPage(p));
  };
  await addPages(capaPdf);
  if (decPdf) await addPages(decPdf);
  if (decSimplesPdf) await addPages(decSimplesPdf);
  await addPages(sumPdf);
  for (const group of groupMetas) {
    await addPages(group.coverPdf);
    for (const entry of group.entries) {
      for (const f of entry.loadedFiles) {
        if (f.type === 'pdf') {
          await addPages(f.doc);
        } else {
          const page = finalPdf.addPage([595.28, 841.89]);
          const dims = f.img.scaleToFit(500, 750);
          page.drawImage(f.img, { x: (595.28 - dims.width) / 2, y: (841.89 - dims.height) / 2, ...dims });
        }
      }
    }
  }

  // Capa de encerramento
  const nome            = safeStr(dados.nome);
  const siape           = safeStr(dados.siape);
  const nivelPretendido = safeStr(dados.nivelPretendido);
  const endDoc = new JPDF();
  endDoc.setFillColor(...azulIFSC); endDoc.rect(0, 0, 210, 297, 'F');
  endDoc.setFillColor(...verdeIFSC); endDoc.rect(205, 0, 5, 297, 'F');
  endDoc.setFillColor(28, 124, 59); endDoc.rect(0, 0, 205, 3, 'F');
  if (logoWhiteDataUrl) {
    const elW = 63.2; const elH = elW * (logoNatH / logoNatW);
    try { endDoc.addImage(logoWhiteDataUrl, 'PNG', 105 - elW / 2, 22, elW, elH, 'logo-w', 'FAST'); } catch {}
  }
  endDoc.setDrawColor(255, 255, 255); endDoc.setLineWidth(0.4); endDoc.line(40, 78, 170, 78);
  endDoc.setFont('helvetica', 'bold'); endDoc.setFontSize(36); endDoc.setTextColor(255, 255, 255);
  endDoc.text('MEMORIAL RSC', 105, 102, { align: 'center' });
  endDoc.setFont('helvetica', 'normal'); endDoc.setFontSize(13); endDoc.setTextColor(180, 210, 255);
  endDoc.text('Reconhecimento de Saberes e Competências', 105, 115, { align: 'center' });
  endDoc.setDrawColor(...verdeIFSC); endDoc.setLineWidth(2); endDoc.line(60, 126, 150, 126);
  endDoc.setFont('helvetica', 'bold'); endDoc.setFontSize(14); endDoc.setTextColor(255, 255, 255);
  endDoc.text(nome || '—', 105, 144, { align: 'center' });
  endDoc.setFont('helvetica', 'normal'); endDoc.setFontSize(10); endDoc.setTextColor(180, 210, 255);
  endDoc.text(`SIAPE nº ${siape || '—'}`, 105, 154, { align: 'center' });
  endDoc.text(`Nível Pretendido: ${nivelPretendido || '—'}`, 105, 164, { align: 'center' });
  endDoc.setFillColor(11, 46, 100); endDoc.roundedRect(60, 182, 90, 22, 3, 3, 'F');
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const today  = new Date();
  endDoc.setFontSize(7.5); endDoc.setTextColor(150, 185, 230);
  endDoc.text('Data de Geração do Documento', 105, 190, { align: 'center' });
  endDoc.setFont('helvetica', 'bold'); endDoc.setFontSize(10); endDoc.setTextColor(255, 255, 255);
  endDoc.text(`${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`, 105, 199, { align: 'center' });
  endDoc.setFont('helvetica', 'normal'); endDoc.setFontSize(7.5); endDoc.setTextColor(100, 140, 200);
  endDoc.text('Instituto Federal de Santa Catarina (IFSC)', 105, 267, { align: 'center' });
  endDoc.text('Comissão Permanente de Pessoal Docente (CPPD)', 105, 271, { align: 'center' });
  endDoc.text('Sistema de Geração de Memorial RSC (SGRSC)', 105, 275, { align: 'center' });
  await addPages(await PDFDocument.load(endDoc.output('arraybuffer')));

  // Carimbo lateral
  const pages = finalPdf.getPages();
  const total = pages.length;
  const dateStr = today.toLocaleDateString('pt-BR');
  for (let i = 1; i < total - 1; i++) {
    pages[i].drawText(
      `Gerado em: ${dateStr} | Servidor(a): ${nome || '—'} | SIAPE: ${siape || '—'} | Página ${i + 1} de ${total}`,
      { x: 15, y: 72, size: 8, font: helvetica, color: rgb(0.5, 0.5, 0.5), rotate: degrees(90) }
    );
  }

  onProgress?.('Salvando arquivo...');
  const bytes = await finalPdf.save();
  const blob  = new Blob([bytes], { type: 'application/pdf' });
  window.saveAs(blob, `Memorial_RSC_${siape || 'sem_siape'}.pdf`);

  return itemMetas.map(m => ({ startPage: m.startPage, endPage: m.endPage }));
}
