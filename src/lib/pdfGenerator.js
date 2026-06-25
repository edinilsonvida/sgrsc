import { getCriterio, calcular } from './engine';

const azulIFSC  = [11, 58, 117];
const verdeIFSC = [28, 124, 59];
const cinzaCard = [243, 247, 252];
const bordaCard = [197, 214, 235];
const labelCor  = [95, 115, 145];
const textoCor  = [22, 38, 68];

function drawPageHeader(doc, title, logoWhiteDataUrl, logoNatW, logoNatH) {
  doc.setFillColor(...azulIFSC); doc.rect(0, 0, 210, 22, 'F');
  const lH = 14, lW = lH * (logoNatW / logoNatH);
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 5, (22 - lH) / 2, lW, lH); } catch {}
  }
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  doc.text(title, 105, 14, { align: 'center' });
  doc.setFillColor(...verdeIFSC); doc.rect(0, 22, 210, 2.5, 'F');
}

function drawPageFooter(doc, logoWhiteDataUrl, logoNatW, logoNatH) {
  const fy = 284;
  doc.setFillColor(...azulIFSC); doc.rect(0, fy, 210, 13, 'F');
  const lH = 9, lW = lH * (logoNatW / logoNatH);
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 7, fy + 2, lW, lH); } catch {}
  }
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
  const val = (value && value.trim() && value !== 'Não informado' && value !== 'Não informada') ? value : '—';
  const wrapped = doc.splitTextToSize(val, w - 7);
  doc.text(wrapped[0], x + 3.5, y + 13.5);
}

async function getLogoDataUrls() {
  let logoDataUrl = null, logoWhiteDataUrl = null;
  let logoNatW = 1, logoNatH = 1;
  try {
    // Load SVG logo, rasterize to canvas for jsPDF embedding
    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        logoNatW = img.naturalWidth || 220;
        logoNatH = img.naturalHeight || 310;
        // Colored version
        const cv = document.createElement('canvas');
        cv.width = logoNatW * 2; cv.height = logoNatH * 2; // 2× for sharpness
        const ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        logoDataUrl = cv.toDataURL('image/png');
        // White version — force all opaque pixels to white
        const d = ctx.getImageData(0, 0, cv.width, cv.height);
        for (let i = 0; i < d.data.length; i += 4) {
          if (d.data[i + 3] > 10) { d.data[i] = 255; d.data[i+1] = 255; d.data[i+2] = 255; }
        }
        ctx.putImageData(d, 0, 0);
        logoWhiteDataUrl = cv.toDataURL('image/png');
        resolve();
      };
      img.onerror = resolve;
      img.src = '/logo-ifsc.png';
    });
  } catch { /* logo optional */ }
  return { logoDataUrl, logoWhiteDataUrl, logoNatW, logoNatH };
}

function buildCapa(jsPDF, dados, logoWhiteDataUrl, logoNatW, logoNatH) {
  const { jsPDF: JPDF } = window.jspdf;
  const doc = new JPDF();
  const { nome: serverNome, siape: serverSiape, nivelPretendido: serverNivel,
          email, celular, rt, portariaRt, dataRt, dataLimite, declaranteNome,
          declaranteSiape, cidade } = dados;

  const logoCapaW = 22;
  const logoCapaH = logoCapaW * (logoNatH / logoNatW);
  const logoCapaY = (33 - logoCapaH) / 2;

  doc.setFillColor(...azulIFSC); doc.rect(0, 0, 210, 33, 'F');
  doc.setFillColor(...verdeIFSC); doc.rect(0, 33, 210, 3.5, 'F');
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 7, logoCapaY, logoCapaW, logoCapaH); } catch {}
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
  const cidadeStr = (cidade && cidade.trim()) ? cidade.trim() : '';
  const dataStr = `${cidadeStr ? cidadeStr + ', ' : ''}${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}.`;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...labelCor);
  doc.text(dataStr, 105, decCards + H + 10, { align: 'center' });

  // Footer bar fixed at bottom
  const footerY = 284;
  doc.setFillColor(...azulIFSC); doc.rect(0, footerY, 210, 13, 'F');
  const logoRodapeH = 9;
  const logoRodapeW = logoRodapeH * (logoNatW / logoNatH);
  if (logoWhiteDataUrl) {
    try { doc.addImage(logoWhiteDataUrl, 'PNG', 7, footerY + 2, logoRodapeW, logoRodapeH); } catch {}
  }
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
  const logoRodapeH = 11;
  const logoRodapeW = logoRodapeH * (logoNatW / logoNatH);

  const finalPdf   = await PDFDocument.create();
  const helvetica  = await finalPdf.embedFont(StandardFonts.Helvetica);

  onProgress?.('Gerando capa...');
  const capaDoc  = buildCapa(JPDF, dados, logoWhiteDataUrl, logoNatW, logoNatH);
  const capaBytes = capaDoc.output('arraybuffer');
  const capaPdf   = await PDFDocument.load(capaBytes);

  // Memorial descritivo
  let decPdf = null;
  if (dados.memorialTexto?.trim()) {
    const decDoc = new JPDF();
    drawPageHeader(decDoc, 'MEMORIAL DESCRITIVO', logoWhiteDataUrl, logoNatW, logoNatH);
    drawPageFooter(decDoc, logoWhiteDataUrl, logoNatW, logoNatH);
    decDoc.setFont('helvetica', 'normal'); decDoc.setFontSize(11); decDoc.setTextColor(30, 30, 30);
    const lines = decDoc.splitTextToSize(dados.memorialTexto, 170);
    decDoc.text(lines, 20, 33);

    // Local, data e assinatura
    const mesesMem = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const hojeMem  = new Date();
    const cidadeMem = (dados.cidade && dados.cidade.trim()) ? dados.cidade.trim() : '';
    const dataMem = `${cidadeMem ? cidadeMem + ', ' : ''}${hojeMem.getDate()} de ${mesesMem[hojeMem.getMonth()]} de ${hojeMem.getFullYear()}.`;
    let mY = 33 + lines.length * 6.5 + 28;
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
    decDoc.text(dados.nome || '—', 105, mY, { align: 'center' });
    mY += 6;
    decDoc.setFont('helvetica', 'normal'); decDoc.setFontSize(10); decDoc.setTextColor(30, 30, 30);
    decDoc.text(`SIAPE nº ${dados.siape || '—'}`, 105, mY, { align: 'center' });

    decPdf = await PDFDocument.load(decDoc.output('arraybuffer'));
  }

  onProgress?.('Processando comprovantes...');
  let currentTotalPages = 1 + (decPdf ? 1 : 0) + 2; // capa + memorial? + declaração + sumário

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

  // ── Table column x-positions (mm), table spans x=15 to x=185 (TW=170) ─
  const TX = 15, TW = 170;
  const C = { num: 15, cod: 22, dsc: 41, dat: 110, qty: 133, fac: 150, pts: 167 };

  const drawTblHeader = (d, y) => {
    d.setFillColor(...azulIFSC); d.rect(TX, y, TW, 7, 'F');
    d.setFont('helvetica', 'bold'); d.setFontSize(7.5); d.setTextColor(255, 255, 255);
    d.text('#',                      C.num + 3.5, y + 4.8, { align: 'center' });
    d.text('Critério',               C.cod + 9,   y + 4.8, { align: 'center' });
    d.text('Descrição do documento', C.dsc + 2,   y + 4.8);
    d.text('Data',                   C.dat + 11,  y + 4.8, { align: 'center' });
    d.text('Qtd',                    C.qty + 8,   y + 4.8, { align: 'center' });
    d.text('Fator',                  C.fac + 8,   y + 4.8, { align: 'center' });
    d.text('Pontos',                 TX + TW - 1, y + 4.8, { align: 'right' });
  };

  const drawCritSubHdr = (d, y, crit) => {
    d.setFillColor(228, 236, 250); d.rect(TX, y, TW, 6.5, 'F');
    d.setFont('helvetica', 'bold'); d.setFontSize(7.5); d.setTextColor(...azulIFSC);
    const desc = crit.descricao.length > 115 ? crit.descricao.slice(0, 112) + '...' : crit.descricao;
    d.text(`Critério ${crit.codigo} — ${desc}`, TX + 2, y + 4.5);
  };

  const drawItemRow = (d, y, rowNum, item, crit, isEven) => {
    const qty     = item.quantidade || '0';
    const pts     = (parseFloat(qty) * crit.fator).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const qtyStr  = `${qty} ${crit.unidade}(s)`;
    const dateStr = item.data ? item.data.split('-').reverse().join('/') : '—';
    d.setFont('helvetica', 'normal'); d.setFontSize(7.5);
    const descLines = d.splitTextToSize(item.docDescricao || '—', C.dat - C.dsc - 2);
    const obsLines  = item.observacao?.trim() ? d.splitTextToSize(`Obs.: ${item.observacao}`, TW - 6) : [];
    const rowH    = Math.max(7, descLines.length * 4.2 + 3.5);
    const obsH    = obsLines.length > 0 ? obsLines.length * 3.8 + 3 : 0;
    const totalH  = rowH + obsH;
    if (isEven) { d.setFillColor(242, 247, 255); d.rect(TX, y, TW, totalH, 'F'); }
    d.setDrawColor(210, 222, 238); d.setLineWidth(0.2);
    [C.cod, C.dsc, C.dat, C.qty, C.fac, C.pts].forEach(cx => d.line(cx, y, cx, y + totalH));
    d.line(TX, y + totalH, TX + TW, y + totalH);
    const midY = y + rowH / 2 + 1.5;
    d.setFont('helvetica', 'normal'); d.setFontSize(7); d.setTextColor(110, 110, 110);
    d.text(String(rowNum), C.num + 3.5, midY, { align: 'center' });
    d.setFont('helvetica', 'bold'); d.setFontSize(8); d.setTextColor(30, 30, 30);
    d.text(String(crit.codigo), C.cod + 9, midY, { align: 'center' });
    d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(30, 30, 30);
    d.text(descLines, C.dsc + 2, y + 4.5);
    d.text(dateStr, C.dat + 11, midY, { align: 'center' });
    d.setFont('helvetica', 'bold'); d.setFontSize(7.5); d.setTextColor(...azulIFSC);
    d.text(qtyStr, C.qty + 8, midY, { align: 'center' });
    d.text(String(crit.fator), C.fac + 8, midY, { align: 'center' });
    d.text(pts, TX + TW - 1, midY, { align: 'right' });
    if (obsLines.length > 0) {
      d.setFont('helvetica', 'italic'); d.setFontSize(7); d.setTextColor(90, 90, 90);
      d.text(obsLines, TX + 3, y + rowH + 3.5);
    }
    return totalH;
  };

  // ── One cover page per diretriz group with table of all its items ──────
  const itemMetas  = [];
  const groupMetas = [];

  for (const group of dirGroups) {
    const hdrTitle = `Diretriz ${group.diretriz}`;
    const coverDoc = new JPDF();
    drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
    drawPageFooter(coverDoc, logoWhiteDataUrl, logoNatW, logoNatH);
    const groupStartPage = currentTotalPages + 1;
    let coverPageCount   = 1;
    let tableY           = 30;

    drawTblHeader(coverDoc, tableY); tableY += 7;

    let lastCodigo = null, rowNum = 0;

    for (const { item, crit } of group.entries) {
      rowNum++;
      if (crit.codigo !== lastCodigo) {
        if (tableY + 6.5 > 273) {
          coverDoc.addPage();
          drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
          drawPageFooter(coverDoc, logoWhiteDataUrl, logoNatW, logoNatH);
          coverPageCount++; tableY = 30;
          drawTblHeader(coverDoc, tableY); tableY += 7;
        }
        drawCritSubHdr(coverDoc, tableY, crit); tableY += 6.5;
        lastCodigo = crit.codigo;
      }
      coverDoc.setFont('helvetica', 'normal'); coverDoc.setFontSize(7.5);
      const descEst   = coverDoc.splitTextToSize(item.docDescricao || '—', C.dat - C.dsc - 2);
      const obsEst    = item.observacao?.trim() ? coverDoc.splitTextToSize(`Obs.: ${item.observacao}`, TW - 6) : [];
      const rowHEst   = Math.max(7, descEst.length * 4.2 + 3.5);
      const totalHEst = rowHEst + (obsEst.length > 0 ? obsEst.length * 3.8 + 3 : 0);
      if (tableY + totalHEst > 273) {
        coverDoc.addPage();
        drawPageHeader(coverDoc, hdrTitle, logoWhiteDataUrl, logoNatW, logoNatH);
        drawPageFooter(coverDoc, logoWhiteDataUrl, logoNatW, logoNatH);
        coverPageCount++; tableY = 30;
        drawTblHeader(coverDoc, tableY); tableY += 7;
      }
      tableY += drawItemRow(coverDoc, tableY, rowNum, item, crit, rowNum % 2 === 0);
    }

    currentTotalPages += coverPageCount;
    const coverPdf = await PDFDocument.load(coverDoc.output('arraybuffer'));

    const groupEntries = [];
    for (const { item, crit } of group.entries) {
      const loadedFiles = [];
      for (const file of (item.files || [])) {
        const buffer = await file.arrayBuffer();
        if (file.type === 'application/pdf') {
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          currentTotalPages += pdfDoc.getPageCount();
          loadedFiles.push({ type: 'pdf', doc: pdfDoc });
        } else if (file.type.startsWith('image/')) {
          const imgEmbed = file.type === 'image/png'
            ? await finalPdf.embedPng(buffer)
            : await finalPdf.embedJpg(buffer);
          currentTotalPages++;
          loadedFiles.push({ type: 'image', img: imgEmbed });
        }
      }
      itemMetas.push({
        index: itemMetas.length + 1,
        title: `Diretriz ${crit.diretriz} — Critério ${crit.codigo}`,
        docDesc: item.docDescricao,
        startPage: groupStartPage,
        endPage: currentTotalPages,
      });
      groupEntries.push({ loadedFiles });
    }
    groupMetas.push({ coverPdf, entries: groupEntries });
  }

  // Sumário
  onProgress?.('Gerando sumário...');
  const sumDoc = new JPDF();
  drawPageHeader(sumDoc, 'SUMÁRIO', logoWhiteDataUrl, logoNatW, logoNatH);
  drawPageFooter(sumDoc, logoWhiteDataUrl, logoNatW, logoNatH);
  let sumY = 36;
  for (const meta of itemMetas) {
    if (sumY > 275) {
      sumDoc.addPage();
      drawPageHeader(sumDoc, 'SUMÁRIO', logoWhiteDataUrl, logoNatW, logoNatH);
      drawPageFooter(sumDoc, logoWhiteDataUrl, logoNatW, logoNatH);
      sumY = 33;
    }
    const pageText = meta.startPage === meta.endPage ? `Pág. ${meta.startPage}` : `Páginas ${meta.startPage} a ${meta.endPage}`;
    sumDoc.setFont('helvetica', 'bold'); sumDoc.setTextColor(30, 30, 30); sumDoc.setFontSize(11);
    sumDoc.text(`Item ${meta.index}: ${meta.title}`, 20, sumY);
    const td = meta.docDesc?.length > 55 ? meta.docDesc.substring(0, 52) + '...' : meta.docDesc;
    sumDoc.setFont('helvetica', 'normal'); sumDoc.setFontSize(9); sumDoc.setTextColor(100, 100, 100);
    sumDoc.text(td || 'Sem descrição', 20, sumY + 5);
    sumDoc.setFontSize(11); sumDoc.setTextColor(...azulIFSC); sumDoc.setFont('helvetica', 'bold');
    sumDoc.text(pageText, 160, sumY + 2);
    sumDoc.setDrawColor(230, 230, 230); sumDoc.line(20, sumY + 8, 190, sumY + 8);
    sumY += 16;
  }
  const sumPdf = await PDFDocument.load(sumDoc.output('arraybuffer'));

  // Declaração de Confere com o Original
  const decDocSimples = new JPDF();
  drawPageHeader(decDocSimples, 'DECLARAÇÃO DE CONFERE COM O ORIGINAL', logoWhiteDataUrl, logoNatW, logoNatH);
  drawPageFooter(decDocSimples, logoWhiteDataUrl, logoNatW, logoNatH);
  const { nome, siape, declaranteNome, declaranteSiape, cidade, nivelPretendido, dataLimite } = dados;

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
  const cidadeDec = (cidade && cidade.trim()) ? cidade.trim() : '';
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

  const decSimplesPdf = await PDFDocument.load(decDocSimples.output('arraybuffer'));

  // Merge
  onProgress?.('Unificando PDF...');
  const addPages = async (src) => {
    const ps = await finalPdf.copyPages(src, src.getPageIndices());
    ps.forEach(p => finalPdf.addPage(p));
  };
  await addPages(capaPdf);
  if (decPdf) await addPages(decPdf);
  await addPages(decSimplesPdf);
  await addPages(sumPdf);
  for (const meta of itemMetas) {
    await addPages(meta.itemCoverPdf);
    for (const f of meta.loadedFiles) {
      if (f.type === 'pdf') {
        await addPages(f.doc);
      } else {
        const page = finalPdf.addPage([595.28, 841.89]);
        const dims = f.img.scaleToFit(500, 750);
        page.drawImage(f.img, { x: (595.28 - dims.width) / 2, y: (841.89 - dims.height) / 2, ...dims });
      }
    }
  }

  // Capa de encerramento
  const endDoc = new JPDF();
  endDoc.setFillColor(...azulIFSC); endDoc.rect(0, 0, 210, 297, 'F');
  endDoc.setFillColor(...verdeIFSC); endDoc.rect(205, 0, 5, 297, 'F');
  endDoc.setFillColor(28, 124, 59); endDoc.rect(0, 0, 205, 3, 'F');
  if (logoWhiteDataUrl) {
    const elW = 43; const elH = elW * (logoNatH / logoNatW);
    try { endDoc.addImage(logoWhiteDataUrl, 'PNG', 105 - elW / 2, 22, elW, elH); } catch {}
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
}
