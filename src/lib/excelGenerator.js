import { getCriterios } from './engine';

// ── ARGB Color Palette ────────────────────────────────────────────────────
const C = {
  DARK_BLUE:  'FF0B3A75',
  GOVBR_BLUE: 'FF1351B4',
  IFSC_GREEN: 'FF1C7C3B',
  GREEN_DK:   'FF155B2B',
  PALE_BLUE:  'FFEBF1FC',
  PALE_GREEN: 'FFE4F4EB',
  LIGHT_BG:   'FFF4F7FB',
  CREAM:      'FFFFFDE7',
  AMBER:      'FFCC8800',
  WHITE:      'FFFFFFFF',
  DARK_TEXT:  'FF1A2E50',
  MID_TEXT:   'FF5A6A85',
  BLU_BDR:    'FFC7D7F8',
  GRN_BDR:    'FFB2DCC0',
  AMB_BDR:    'FFDDBB44',
  GRAY_BDR:   'FFD0D8E8',
};

// ── Border + style helpers ────────────────────────────────────────────────
const bd  = (rgb, s = 'thin') => ({ style: s, color: { rgb } });
const all = (rgb, s = 'thin') => ({ top: bd(rgb, s), bottom: bd(rgb, s), left: bd(rgb, s), right: bd(rgb, s) });

function mkS(bg, fgRgb, sz, bold, halign, valign, wrap, borderRgb, italic) {
  const s = {
    fill: { patternType: 'solid', fgColor: { rgb: bg } },
    font: { sz: sz || 9, name: 'Arial', color: { rgb: fgRgb || C.DARK_TEXT } },
    alignment: { horizontal: halign || 'left', vertical: valign || 'center', wrapText: !!wrap },
  };
  if (bold)   s.font.bold   = true;
  if (italic) s.font.italic = true;
  if (borderRgb) s.border = all(borderRgb);
  return s;
}

// ── Style library ─────────────────────────────────────────────────────────
const S = {
  // Title bar
  logoBlk:  mkS(C.DARK_BLUE, C.WHITE,     20, true,  'center', 'center', false, C.DARK_BLUE),
  titleTxt: mkS(C.DARK_BLUE, C.WHITE,     13, true,  'center', 'center', false, C.DARK_BLUE),
  subtitTx: mkS(C.DARK_BLUE, 'FFA8C4F0',  9, false,  'center', 'center', false, C.DARK_BLUE, true),
  sep:      mkS(C.IFSC_GREEN, C.IFSC_GREEN, 2, false, 'center', 'center', false, C.IFSC_GREEN),

  // Info rows - label (dark blue) / candidate value / evaluator value
  infoLbl:  mkS(C.DARK_BLUE, C.WHITE,    8, true,  'center', 'center', true,  C.DARK_BLUE),
  infoValL: mkS(C.WHITE,     C.DARK_TEXT, 10, true, 'left',   'center', false, C.BLU_BDR),
  infoValC: mkS(C.WHITE,     C.DARK_TEXT, 10, true, 'center', 'center', false, C.BLU_BDR),
  evalLbl:  mkS(C.DARK_BLUE, C.WHITE,    8, true,  'center', 'center', true,  C.DARK_BLUE),
  evalValL: { ...mkS(C.CREAM, C.AMBER,  9, false, 'left',   'center', false, C.AMB_BDR, true),  protection: { locked: false } },
  evalValC: { ...mkS(C.CREAM, C.AMBER,  9, false, 'center', 'center', false, C.AMB_BDR, true),  protection: { locked: false } },

  // Column headers by section
  hdrG: mkS(C.IFSC_GREEN,  C.WHITE, 8, true, 'center', 'center', true, C.IFSC_GREEN),
  hdrB: mkS(C.GOVBR_BLUE,  C.WHITE, 8, true, 'center', 'center', true, C.GOVBR_BLUE),
  hdrA: mkS(C.AMBER,       C.WHITE, 8, true, 'center', 'center', true, C.AMBER),

  // Data cells
  dLookL: mkS(C.LIGHT_BG, C.DARK_TEXT, 9, false, 'left',   'center', true,  C.GRAY_BDR),
  dLookC: mkS(C.LIGHT_BG, C.DARK_TEXT, 9, false, 'center', 'center', false, C.GRAY_BDR),
  dPreL:  mkS(C.PALE_GREEN, 'FF1A4A28', 9, false, 'left',  'center', true,  C.GRN_BDR),
  dPreC:  mkS(C.PALE_GREEN, 'FF1A4A28', 9, false, 'center','center', false, C.GRN_BDR),
  dScore: mkS(C.PALE_BLUE,  C.DARK_BLUE, 9, true, 'center','center', false, C.BLU_BDR),
  dEvalC: { ...mkS(C.CREAM, C.AMBER, 9, false, 'center', 'center', false, C.AMB_BDR, true), protection: { locked: false } },
  dEvalL: { ...mkS(C.CREAM, C.AMBER, 9, false, 'left',  'center', true,  C.AMB_BDR, true), protection: { locked: false } },

  // Summary section
  sumTitle: mkS(C.DARK_BLUE,  C.WHITE,      10, true, 'center', 'center', false, C.DARK_BLUE),
  sumHdr:   mkS(C.GOVBR_BLUE, C.WHITE,       9, true, 'center', 'center', true,  C.GOVBR_BLUE),
  sumLbl:   mkS(C.PALE_BLUE,  C.DARK_BLUE,   9, true, 'left',   'center', false, C.BLU_BDR),
  sumCnt:   mkS(C.LIGHT_BG,   C.MID_TEXT,    9, false,'center', 'center', false, C.GRAY_BDR),
  sumReq:   mkS(C.PALE_BLUE,  C.GOVBR_BLUE,  9, true, 'center', 'center', false, C.BLU_BDR),
  sumDef:   mkS(C.CREAM,      C.AMBER,        9, true, 'center', 'center', false, C.AMB_BDR),
  sumDiff:  mkS(C.LIGHT_BG,   C.MID_TEXT,    9, false,'center', 'center', false, C.GRAY_BDR),
  sumTotal: mkS(C.DARK_BLUE,  C.WHITE,       10, true, 'center', 'center', false, C.DARK_BLUE),

  // Compliance / verification section
  cmpTitle:  mkS(C.IFSC_GREEN, C.WHITE,      10, true, 'center', 'center', false, C.IFSC_GREEN),
  cmpMin:    mkS(C.PALE_BLUE,  C.GOVBR_BLUE,  9, true, 'center', 'center', false, C.BLU_BDR),
  cmpSts:    mkS(C.CREAM,      C.AMBER,        9, true, 'center', 'center', true,  C.AMB_BDR),
  cmpStsT:   mkS(C.DARK_BLUE,  C.WHITE,       10, true, 'center', 'center', true,  C.DARK_BLUE),
  cmpDir1:   mkS(C.PALE_BLUE,  C.GOVBR_BLUE,  9, false,'center', 'center', false, C.BLU_BDR),
  cmpDir2:   mkS(C.PALE_GREEN, 'FF1A4A28',    9, false,'center', 'center', false, C.GRN_BDR),
  cmpDir3:   mkS(C.CREAM,      C.AMBER,        9, false,'center', 'center', false, C.AMB_BDR),
  cmpDirT:   mkS(C.LIGHT_BG,   C.DARK_TEXT,   9, true, 'center', 'center', false, C.GRAY_BDR),
  cmpNote:   mkS(C.LIGHT_BG,   C.MID_TEXT,    8, false,'left',   'center', true,  C.GRAY_BDR, true),

  // Auxiliar sheet
  auxHdr:  mkS(C.DARK_BLUE, C.WHITE, 9, true, 'center', 'center'),
  auxData: mkS(C.WHITE, C.DARK_TEXT, 9),
  auxDataC:mkS(C.LIGHT_BG, C.DARK_TEXT, 9, false, 'center'),
};

// ── Utilities ─────────────────────────────────────────────────────────────
function setCell(ws, r, c, v, t, s, f) {
  const addr = window.XLSX.utils.encode_cell({ r, c });
  const cell = { v: (v === null || v === undefined) ? '' : v };
  cell.t = t ?? (typeof v === 'number' ? 'n' : 's');
  if (s) cell.s = s;
  if (f) { cell.f = f; if (cell.v === '') cell.v = 0; }
  ws[addr] = cell;
}

// Fill an entire row with style (for separator rows, blank eval rows, etc.)
function fillRow(ws, r, nCols, s) {
  for (let c = 0; c < nCols; c++) setCell(ws, r, c, '', 's', s);
}

function isoToDisplay(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : iso;
}
function todayDisplay() { return isoToDisplay(new Date().toISOString().split('T')[0]); }

// ── Column definitions (15 cols A–O) ──────────────────────────────────────
// [colIndex, header label, wch width, hdrStyle, dataStyleLeft, dataStyleCenter, isVlookup(0=no/N=colN), isPreFilled, isScore, isEval]
const COLS = [
  [0,  'Critério',                         10, 'hdrB', 'dPreC',  null,  0, true,  false, false],
  [1,  'Nome do Critério',                 50, 'hdrB', 'dPreL',  null,  2, false, false, false],
  [2,  'Fator de Pontuação',               10, 'hdrB', 'dPreC',  null,  3, false, false, false],
  [3,  'Unidade',                          14, 'hdrB', 'dPreC',  null,  4, false, false, false],
  [4,  'Quantidade Máxima de Unidades',    16, 'hdrB', 'dPreC',  null,  5, false, false, false],
  [5,  'Nível',                             8, 'hdrB', 'dPreC',  null,  6, false, false, false],
  [6,  'Diretriz',                         10, 'hdrB', 'dPreC',  null,  7, false, false, false],
  [7,  'Nome do Documento Comprobatório',  44, 'hdrB', 'dPreL',  null,  0, true,  false, false],
  [8,  'Data do Documento',                12, 'hdrB', 'dPreC',  null,  0, true,  false, false],
  [9,  'Página Inicial',                    8, 'hdrB', 'dPreC',  null,  0, false, false, false],
  [10, 'Página Final',                      8, 'hdrB', 'dPreC',  null,  0, false, false, false],
  [11, 'Quantidade Apresentada',           12, 'hdrB', 'dPreC',  null,  0, true,  false, false],
  [12, 'Pontuação Requerida',              14, 'hdrB', 'dPreC',  null,  0, false, true,  false],
  [13, 'Pontuação Deferida do(a) Avaliador(a)', 14, 'hdrA', 'dEvalC', null, 0, false, false, true],
  [14, 'Observação / Indeferimento',       32, 'hdrA', 'dEvalL', null,  0, false, false, true],
];
const NCOL = 14; // last col index (O)
const AUX  = "Auxiliar!$A$1:$G$140";

// ── Auxiliar (lookup) sheet ───────────────────────────────────────────────
function buildAuxiliarSheet(criterios) {
  const ws = {};
  const hdrs = ['Código', 'Nome do Critério', 'Fator', 'Unidade', 'Quantidade Máx.', 'Nível', 'Diretriz'];
  hdrs.forEach((h, c) => setCell(ws, 0, c, h, 's', S.auxHdr));

  const sorted = [...criterios].sort((a, b) => Number(a.codigo) - Number(b.codigo));
  sorted.forEach((cr, i) => {
    const r = i + 1;
    setCell(ws, r, 0, Number(cr.codigo),          'n', S.auxDataC);
    setCell(ws, r, 1, cr.descricao,               's', S.auxData);
    setCell(ws, r, 2, Number(cr.fator),            'n', S.auxDataC);
    setCell(ws, r, 3, cr.unidade,                 's', S.auxData);
    setCell(ws, r, 4, Number(cr.quantidadeMaxima), 'n', S.auxDataC);
    setCell(ws, r, 5, cr.nivel,                   's', S.auxDataC);
    setCell(ws, r, 6, cr.diretriz,                's', S.auxDataC);
  });

  const lastR = sorted.length;
  ws['!ref']  = window.XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastR, c: 6 } });
  ws['!cols'] = [{ wch: 8 }, { wch: 60 }, { wch: 8 }, { wch: 18 }, { wch: 12 }, { wch: 8 }, { wch: 10 }];
  return ws;
}

// ── Main sheet ────────────────────────────────────────────────────────────
function buildMainSheet(items, dados, criterios, pageMetas) {
  const ws      = {};
  const merges  = [];
  function merge(r1, c1, r2, c2) { merges.push({ s: { r: r1, c: c1 }, e: { r: r2, c: c2 } }); }

  // ── Row indices ──────────────────────────────────────────────────────────
  const R_LOGO  = 0;  // Brand block: IFSC + form title (merged)
  const R_SEP1  = 1;  // Green stripe
  const R_CAND  = 2;  // Candidate: Nome | SIAPE | Nível RSC
  const R_DATES = 3;  // Dates: Limite docs | Geração | Retr. Titulação
  const R_EVAL  = 4;  // Evaluator row (cream, editable)
  const R_SEP2  = 5;  // Green stripe
  const R_HDR   = 6;  // Column headers
  const R_DATA  = 7;  // Data rows begin

  // ── Row 0: Brand / Title bar ──────────────────────────────────────────────
  // [A-O] Barra de título completa — A1:O1 mesclado, logo sobreposta via drawing
  const sTit = mkS(C.DARK_BLUE, C.WHITE, 11, true, 'center', 'center', true, C.DARK_BLUE);
  setCell(ws, R_LOGO, 0,
    'FORMULÁRIO DE AVALIAÇÃO DO RSC — Reconhecimento de Saberes e Competências\nInstituto Federal de Santa Catarina (IFSC)  |  Res. CONSUP nº 29/2014',
    's', sTit);
  for (let c = 1; c <= NCOL; c++) setCell(ws, R_LOGO, c, '', 's', sTit);
  merge(R_LOGO, 0, R_LOGO, NCOL);

  // ── Row 1: Separator ──────────────────────────────────────────────────────
  fillRow(ws, R_SEP1, NCOL + 1, S.sep);
  merge(R_SEP1, 0, R_SEP1, NCOL);

  // ── Row 2: Candidate info (15 cols A–O) ──────────────────────────────────
  // [A-B] label | [C-I] nome | [J] label | [K-L] siape | [M-N] label | [O] nivel
  setCell(ws, R_CAND, 0, 'REQUERENTE', 's', S.infoLbl);
  setCell(ws, R_CAND, 1, '',           's', S.infoLbl);
  merge(R_CAND, 0, R_CAND, 1);

  setCell(ws, R_CAND, 2, dados?.nome || '', 's', S.infoValL);
  for (let c = 3; c <= 8; c++) setCell(ws, R_CAND, c, '', 's', S.infoValL);
  merge(R_CAND, 2, R_CAND, 8);

  setCell(ws, R_CAND, 9, 'SIAPE', 's', S.infoLbl);

  setCell(ws, R_CAND, 10, dados?.siape || '', 's', S.infoValC);
  setCell(ws, R_CAND, 11, '', 's', S.infoValC);
  merge(R_CAND, 10, R_CAND, 11);

  setCell(ws, R_CAND, 12, 'NÍVEL DE RSC', 's', S.infoLbl);
  setCell(ws, R_CAND, 13, '', 's', S.infoLbl);
  merge(R_CAND, 12, R_CAND, 13);

  setCell(ws, R_CAND, 14, dados?.nivelPretendido || '', 's', S.infoValC);

  // ── Row 3: Dates + RT (15 cols A–O) ─────────────────────────────────────
  // [A-B] label | [C-E] limitDate | [F-H] label | [I-K] genDate | [L-M] label | [N-O] rt
  setCell(ws, R_DATES, 0, 'DATA LIMITE DOS DOCUMENTOS', 's', S.infoLbl);
  setCell(ws, R_DATES, 1, '', 's', S.infoLbl);
  merge(R_DATES, 0, R_DATES, 1);

  const limitDate = dados?.dataLimite ? isoToDisplay(dados.dataLimite) : (dados?.dataLimite || '');
  setCell(ws, R_DATES, 2, limitDate, 's', S.infoValC);
  for (let c = 3; c <= 4; c++) setCell(ws, R_DATES, c, '', 's', S.infoValC);
  merge(R_DATES, 2, R_DATES, 4);

  setCell(ws, R_DATES, 5, 'DATA DE GERAÇÃO', 's', S.infoLbl);
  for (let c = 6; c <= 7; c++) setCell(ws, R_DATES, c, '', 's', S.infoLbl);
  merge(R_DATES, 5, R_DATES, 7);

  setCell(ws, R_DATES, 8, todayDisplay(), 's', S.infoValC);
  for (let c = 9; c <= 10; c++) setCell(ws, R_DATES, c, '', 's', S.infoValC);
  merge(R_DATES, 8, R_DATES, 10);

  setCell(ws, R_DATES, 11, 'RETRIBUIÇÃO POR TITULAÇÃO', 's', S.infoLbl);
  setCell(ws, R_DATES, 12, '', 's', S.infoLbl);
  merge(R_DATES, 11, R_DATES, 12);

  const rtVal = [dados?.rt, dados?.portariaRt].filter(Boolean).join(' — ') || '—';
  setCell(ws, R_DATES, 13, rtVal, 's', S.infoValC);
  setCell(ws, R_DATES, 14, '', 's', S.infoValC);
  merge(R_DATES, 13, R_DATES, 14);

  // ── Row 4: Evaluator info (15 cols A–O) ──────────────────────────────────
  // [A-B] label | [C-K] nome avaliador (editable) | [L-M] label | [N-O] data
  setCell(ws, R_EVAL, 0, 'AVALIADOR(A)', 's', S.evalLbl);
  setCell(ws, R_EVAL, 1, '',          's', S.evalLbl);
  merge(R_EVAL, 0, R_EVAL, 1);

  for (let c = 2; c <= 10; c++) setCell(ws, R_EVAL, c, '', 's', S.evalValL);
  merge(R_EVAL, 2, R_EVAL, 10);

  setCell(ws, R_EVAL, 11, 'DATA DA AVALIAÇÃO', 's', S.evalLbl);
  setCell(ws, R_EVAL, 12, '',                  's', S.evalLbl);
  merge(R_EVAL, 11, R_EVAL, 12);

  // Pre-populated with today; formula also recalculates on open
  setCell(ws, R_EVAL, 13, todayDisplay(), 's', S.evalValC,
    'TEXT(TODAY(),"DD/MM/")&TEXT(YEAR(TODAY()),"0000")');
  setCell(ws, R_EVAL, 14, '', 's', S.evalValC);
  merge(R_EVAL, 13, R_EVAL, 14);

  // ── Row 5: Separator ──────────────────────────────────────────────────────
  fillRow(ws, R_SEP2, NCOL + 1, S.sep);
  merge(R_SEP2, 0, R_SEP2, NCOL);

  // ── Row 6: Column headers ─────────────────────────────────────────────────
  COLS.forEach(([ci, hdr, , hdrStyleKey]) => setCell(ws, R_HDR, ci, hdr, 's', S[hdrStyleKey]));

  // ── Data rows (R_DATA+) ──────────────────────────────────────────────────
  const firstXL = R_DATA + 1; // 1-based first data row
  items.forEach((item, idx) => {
    const r   = R_DATA + idx;
    const rXL = r + 1; // 1-based for formula references
    const pm  = pageMetas?.[idx];

    // A: Critério (pre-filled)
    setCell(ws, r, 0, Number(item.codigo), 'n', S.dPreC);

    // B: Nome Critério (VLOOKUP 2)
    setCell(ws, r, 1, '', 's', S.dPreL, `IFERROR(VLOOKUP(A${rXL},${AUX},2,0),"")`);

    // C: Fator (VLOOKUP 3)
    setCell(ws, r, 2, 0, 'n', S.dPreC, `IFERROR(VLOOKUP(A${rXL},${AUX},3,0),"")`);

    // D: Unidade (VLOOKUP 4)
    setCell(ws, r, 3, '', 's', S.dPreL, `IFERROR(VLOOKUP(A${rXL},${AUX},4,0),"")`);

    // E: Quantidade Máxima (VLOOKUP 5)
    setCell(ws, r, 4, 0, 'n', S.dPreC, `IFERROR(VLOOKUP(A${rXL},${AUX},5,0),"")`);

    // F: Nível (VLOOKUP 6)
    setCell(ws, r, 5, '', 's', S.dPreC, `IFERROR(VLOOKUP(A${rXL},${AUX},6,0),"")`);

    // G: Diretriz (VLOOKUP 7)
    setCell(ws, r, 6, '', 's', S.dPreC, `IFERROR(VLOOKUP(A${rXL},${AUX},7,0),"")`);

    // H: Nome do Documento Comprobatório (pre-filled)
    setCell(ws, r, 7, item.docDescricao || '', 's', S.dPreL);

    // I: Data do Documento (pre-filled)
    setCell(ws, r, 8, isoToDisplay(item.data), 's', S.dPreC);

    // J: Página Inicial (from PDF generation)
    setCell(ws, r, 9, pm?.startPage ?? '', pm?.startPage ? 'n' : 's', S.dPreC);

    // K: Página Final (from PDF generation)
    setCell(ws, r, 10, pm?.endPage ?? '', pm?.endPage ? 'n' : 's', S.dPreC);

    // L: Quantidade Apresentada (pre-filled)
    const qty = (item.quantidade !== '' && item.quantidade !== undefined)
      ? Number(item.quantidade) : 0;
    setCell(ws, r, 11, qty, 'n', S.dPreC);

    // M: Pontuação Requerida — MIN(Fator × Qtde, Fator × QtdeMax)
    setCell(ws, r, 12, 0, 'n', S.dPreC,
      `IFERROR(IF(C${rXL}*L${rXL}>=C${rXL}*E${rXL},C${rXL}*E${rXL},C${rXL}*L${rXL}),0)`);

    // N: Pontuação Deferida (avaliador preenche — itálico âmbar)
    setCell(ws, r, 13, '', 's', S.dEvalC);

    // O: Observação / Indeferimento (avaliador preenche — vazio)
    setCell(ws, r, 14, '', 's', S.dEvalL);
  });

  // ── Summary / Comparison section ──────────────────────────────────────────
  const lastDataR  = R_DATA + items.length - 1;
  const lastDataXL = lastDataR + 1;                  // 1-based
  const F_RNG = `$F$${firstXL}:$F$${lastDataXL}`;  // Nível (col F, index 5)
  const K_RNG = `$M$${firstXL}:$M$${lastDataXL}`;  // Pontuação Requerida (col M, index 12)
  const L_RNG = `$N$${firstXL}:$N$${lastDataXL}`;  // Pontuação Deferida (col N, index 13)

  const R_SUM_BLANK1 = lastDataR + 1;
  const R_SUM_BLANK2 = lastDataR + 2;
  const R_SUM_TITLE  = lastDataR + 3;
  const R_SUM_HDR    = lastDataR + 4;
  const R_SUM_RSC1   = lastDataR + 5;
  const R_SUM_RSC2   = lastDataR + 6;
  const R_SUM_RSC3   = lastDataR + 7;
  const R_SUM_SEP    = lastDataR + 8;
  const R_SUM_TOTAL  = lastDataR + 9;

  // Blank separator rows
  fillRow(ws, R_SUM_BLANK1, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));
  fillRow(ws, R_SUM_BLANK2, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));

  // Summary title (full width)
  setCell(ws, R_SUM_TITLE, 0, 'QUADRO COMPARATIVO DE PONTUAÇÃO DO RSC', 's', S.sumTitle);
  for (let c = 1; c <= NCOL; c++) setCell(ws, R_SUM_TITLE, c, '', 's', S.sumTitle);
  merge(R_SUM_TITLE, 0, R_SUM_TITLE, NCOL);

  // Summary column headers (15 cols A–O)
  // [A-D] Nível RSC | [E-F] Nº Itens | [G-J] Pts Requerida | [K-N] Pts Deferida | [O] Diferença
  const sumHdrCols = [
    [0,  3,  'Nível de RSC'],
    [4,  5,  'Nº de Itens'],
    [6,  9,  'Pontuação do(a) Requerente'],
    [10, 13, 'Pontuação Deferida do(a) Avaliador(a)'],
    [14, 14, 'Diferença'],
  ];
  sumHdrCols.forEach(([c1, c2, label]) => {
    setCell(ws, R_SUM_HDR, c1, label, 's', S.sumHdr);
    for (let c = c1 + 1; c <= c2; c++) setCell(ws, R_SUM_HDR, c, '', 's', S.sumHdr);
    if (c2 > c1) merge(R_SUM_HDR, c1, R_SUM_HDR, c2);
  });

  // Summary data rows per RSC level
  const levels = ['RSC I', 'RSC II', 'RSC III'];
  const sumRows = [R_SUM_RSC1, R_SUM_RSC2, R_SUM_RSC3];
  levels.forEach((lvl, li) => {
    const r = sumRows[li];
    const rXL = r + 1;
    // Label [A-D]
    setCell(ws, r, 0, lvl, 's', S.sumLbl);
    for (let c = 1; c <= 3; c++) setCell(ws, r, c, '', 's', S.sumLbl);
    merge(r, 0, r, 3);
    // Nº Itens [E-F]
    setCell(ws, r, 4, 0, 'n', S.sumCnt, `COUNTIF(${F_RNG},"${lvl}")`);
    setCell(ws, r, 5, '', 's', S.sumCnt);
    merge(r, 4, r, 5);
    // Pts Requerida [G-J]
    setCell(ws, r, 6, 0, 'n', S.sumReq, `SUMIF(${F_RNG},"${lvl}",${K_RNG})`);
    for (let c = 7; c <= 9; c++) setCell(ws, r, c, '', 's', S.sumReq);
    merge(r, 6, r, 9);
    // Pts Deferida [K-N]
    setCell(ws, r, 10, 0, 'n', S.sumDef, `SUMIF(${F_RNG},"${lvl}",${L_RNG})`);
    for (let c = 11; c <= 13; c++) setCell(ws, r, c, '', 's', S.sumDef);
    merge(r, 10, r, 13);
    // Diferença [O]
    setCell(ws, r, 14, 0, 'n', S.sumDiff, `IFERROR(G${rXL}-K${rXL},0)`);
  });

  // Separator row before total
  fillRow(ws, R_SUM_SEP, NCOL + 1, S.sep);
  merge(R_SUM_SEP, 0, R_SUM_SEP, NCOL);

  // TOTAL row
  const rTotalXL = R_SUM_TOTAL + 1;
  setCell(ws, R_SUM_TOTAL, 0, 'TOTAL GERAL', 's', S.sumTotal);
  for (let c = 1; c <= 3; c++) setCell(ws, R_SUM_TOTAL, c, '', 's', S.sumTotal);
  merge(R_SUM_TOTAL, 0, R_SUM_TOTAL, 3);

  setCell(ws, R_SUM_TOTAL, 4, 0, 'n', S.sumTotal, `SUM(E${R_SUM_RSC1+1}:E${R_SUM_RSC3+1})`);
  setCell(ws, R_SUM_TOTAL, 5, '', 's', S.sumTotal);
  merge(R_SUM_TOTAL, 4, R_SUM_TOTAL, 5);

  setCell(ws, R_SUM_TOTAL, 6, 0, 'n', S.sumTotal, `SUM(${K_RNG})`);
  for (let c = 7; c <= 9; c++) setCell(ws, R_SUM_TOTAL, c, '', 's', S.sumTotal);
  merge(R_SUM_TOTAL, 6, R_SUM_TOTAL, 9);

  setCell(ws, R_SUM_TOTAL, 10, 0, 'n', S.sumTotal, `SUM(${L_RNG})`);
  for (let c = 11; c <= 13; c++) setCell(ws, R_SUM_TOTAL, c, '', 's', S.sumTotal);
  merge(R_SUM_TOTAL, 10, R_SUM_TOTAL, 13);

  setCell(ws, R_SUM_TOTAL, 14, 0, 'n', S.sumTotal, `IFERROR(G${rTotalXL}-K${rTotalXL},0)`);

  // ── Avaliação de RSC por Nível e Diretriz ────────────────────────────────
  const G_RNG     = `$G$${firstXL}:$G$${lastDataXL}`;
  const MIN_NIVEL = 25;
  const MIN_TOTAL = 50;

  // helpers derived from criterios
  const getDirs = (nivel) =>
    [...new Set(criterios.filter(c => c.nivel === nivel).map(c => c.diretriz))].sort();
  const maxForDir = (nivel, dir) => {
    const first = criterios.find(c => c.nivel === nivel && c.diretriz === dir);
    return first ? Number(first.limiteDiretriz) : 0;
  };
  const maxForNivel = (nivel) =>
    getDirs(nivel).reduce((s, dir) => s + maxForDir(nivel, dir), 0);
  const descForDir = (nivel, dir) => {
    const f = criterios.find(c => c.nivel === nivel && c.diretriz === dir);
    return f ? f.descricao : `Diretriz ${dir}`;
  };

  const sRowEven = mkS(C.WHITE,    C.DARK_TEXT, 9, false, 'left',   'center', true,  C.GRAY_BDR);
  const sRowOdd  = mkS(C.LIGHT_BG, C.DARK_TEXT, 9, false, 'left',   'center', true,  C.GRAY_BDR);
  const sMaxVal  = mkS(C.LIGHT_BG, C.MID_TEXT,  9, true,  'center', 'center', false, C.GRAY_BDR);
  const sResult  = mkS(C.WHITE,    C.GOVBR_BLUE,11, true,  'center', 'center', false, C.BLU_BDR);
  const sResultL = mkS(C.PALE_BLUE,C.DARK_BLUE, 10, true,  'center', 'center', false, C.BLU_BDR);
  const sTitles  = {
    'RSC I':   mkS(C.DARK_BLUE,  C.WHITE, 10, true, 'left', 'center', false, C.DARK_BLUE),
    'RSC II':  mkS('FF0B4F92',   C.WHITE, 10, true, 'left', 'center', false, 'FF0B4F92'),
    'RSC III': mkS(C.GOVBR_BLUE, C.WHITE, 10, true, 'left', 'center', false, C.GOVBR_BLUE),
  };

  let evlRow = R_SUM_TOTAL + 1;

  fillRow(ws, evlRow++, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));
  fillRow(ws, evlRow++, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));

  // Main section title
  setCell(ws, evlRow, 0, 'VERIFICAÇÃO DE ATENDIMENTO AO REGULAMENTO DO RSC', 's', S.cmpTitle);
  for (let c = 1; c <= NCOL; c++) setCell(ws, evlRow, c, '', 's', S.cmpTitle);
  merge(evlRow, 0, evlRow, NCOL);
  evlRow++;

  const nivelTotXL = {};  // stores 1-based row numbers of Total rows per nivel

  const niveisOrder = ['RSC I', 'RSC II', 'RSC III'];
  niveisOrder.forEach((nivel, ni) => {
    const dirs = getDirs(nivel);
    if (dirs.length === 0) return;

    // Section row: left = nivel title, right = column headers
    const sT = sTitles[nivel];
    setCell(ws, evlRow, 0, `RECONHECIMENTO DE SABERES E COMPETÊNCIAS — ${nivel}`, 's', sT);
    for (let c = 1; c <= 9; c++) setCell(ws, evlRow, c, '', 's', sT);
    merge(evlRow, 0, evlRow, 9);

    setCell(ws, evlRow, 10, 'Pontuação Máxima', 's', S.sumHdr);
    setCell(ws, evlRow, 11, '', 's', S.sumHdr);
    merge(evlRow, 10, evlRow, 11);

    setCell(ws, evlRow, 12, 'Pontuação do(a) Requerente', 's', S.sumHdr);

    setCell(ws, evlRow, 13, 'Pontuação Deferida do(a) Avaliador(a)', 's', S.sumHdr);
    setCell(ws, evlRow, 14, '', 's', S.sumHdr);
    merge(evlRow, 13, evlRow, 14);
    evlRow++;

    // Per-diretriz rows
    const dirStart = evlRow;
    dirs.forEach((dir, di) => {
      const maxScore  = maxForDir(nivel, dir);
      const dirLabel  = `${dir}  —  ${descForDir(nivel, dir)}`;
      const sRow      = di % 2 === 0 ? sRowEven : sRowOdd;

      setCell(ws, evlRow, 0, dirLabel, 's', sRow);
      for (let c = 1; c <= 9; c++) setCell(ws, evlRow, c, '', 's', sRow);
      merge(evlRow, 0, evlRow, 9);

      setCell(ws, evlRow, 10, maxScore, 'n', sMaxVal);
      setCell(ws, evlRow, 11, '', 's', sMaxVal);
      merge(evlRow, 10, evlRow, 11);

      setCell(ws, evlRow, 12, 0, 'n', S.sumReq,
        `SUMIFS(${K_RNG},${F_RNG},"${nivel}",${G_RNG},"${dir}")`);

      setCell(ws, evlRow, 13, 0, 'n', S.sumDef,
        `SUMIFS(${L_RNG},${F_RNG},"${nivel}",${G_RNG},"${dir}")`);
      setCell(ws, evlRow, 14, '', 's', S.sumDef);
      merge(evlRow, 13, evlRow, 14);
      evlRow++;
    });
    const dirEnd = evlRow - 1;

    // Total row per nivel
    const totalMax  = maxForNivel(nivel);
    nivelTotXL[nivel] = evlRow + 1;  // 1-based

    setCell(ws, evlRow, 0, 'Total', 's', S.sumTotal);
    for (let c = 1; c <= 9; c++) setCell(ws, evlRow, c, '', 's', S.sumTotal);
    merge(evlRow, 0, evlRow, 9);

    setCell(ws, evlRow, 10, totalMax, 'n', S.sumTotal);
    setCell(ws, evlRow, 11, '', 's', S.sumTotal);
    merge(evlRow, 10, evlRow, 11);

    const ds = dirStart + 1, de = dirEnd + 1;
    setCell(ws, evlRow, 12, 0, 'n', S.sumTotal, `SUM(M${ds}:M${de})`);

    setCell(ws, evlRow, 13, 0, 'n', S.sumTotal, `SUM(N${ds}:N${de})`);
    setCell(ws, evlRow, 14, '', 's', S.sumTotal);
    merge(evlRow, 13, evlRow, 14);
    evlRow++;

    // Blank between sections (not after last)
    if (ni < niveisOrder.length - 1) fillRow(ws, evlRow++, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));
  });

  // ── Summary / Resultado ───────────────────────────────────────────────────
  fillRow(ws, evlRow++, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));

  // Summary column headers
  setCell(ws, evlRow, 0, '', 's', S.sumHdr);
  for (let c = 1; c <= 11; c++) setCell(ws, evlRow, c, '', 's', S.sumHdr);
  merge(evlRow, 0, evlRow, 11);
  setCell(ws, evlRow, 12, 'Pontuação do(a) Requerente', 's', S.sumHdr);
  setCell(ws, evlRow, 13, 'Pontuação Deferida do(a) Avaliador(a)', 's', S.sumHdr);
  setCell(ws, evlRow, 14, '', 's', S.sumHdr);
  merge(evlRow, 13, evlRow, 14);
  evlRow++;

  // Per-nivel total rows
  const sumLblS = mkS(C.PALE_BLUE, C.DARK_BLUE, 9, true, 'right', 'center', false, C.BLU_BDR);
  niveisOrder.forEach((nivel) => {
    const totXL = nivelTotXL[nivel];
    setCell(ws, evlRow, 0, `Total de Pontos do ${nivel} =`, 's', sumLblS);
    for (let c = 1; c <= 11; c++) setCell(ws, evlRow, c, '', 's', sumLblS);
    merge(evlRow, 0, evlRow, 11);
    setCell(ws, evlRow, 12, 0, 'n', S.sumReq, totXL ? `M${totXL}` : `SUMIF(${F_RNG},"${nivel}",${K_RNG})`);
    setCell(ws, evlRow, 13, 0, 'n', S.sumDef, totXL ? `N${totXL}` : `SUMIF(${F_RNG},"${nivel}",${L_RNG})`);
    setCell(ws, evlRow, 14, '', 's', S.sumDef);
    merge(evlRow, 13, evlRow, 14);
    evlRow++;
  });

  // Separator
  fillRow(ws, evlRow, NCOL + 1, S.sep);
  merge(evlRow, 0, evlRow, NCOL);
  evlRow++;

  // Total Geral
  setCell(ws, evlRow, 0, 'Total Geral de Pontos do RSC =', 's', S.sumTotal);
  for (let c = 1; c <= 11; c++) setCell(ws, evlRow, c, '', 's', S.sumTotal);
  merge(evlRow, 0, evlRow, 11);
  setCell(ws, evlRow, 12, 0, 'n', S.sumTotal, `SUM(${K_RNG})`);
  setCell(ws, evlRow, 13, 0, 'n', S.sumTotal, `SUM(${L_RNG})`);
  setCell(ws, evlRow, 14, '', 's', S.sumTotal);
  merge(evlRow, 13, evlRow, 14);
  const totalGeralXL = evlRow + 1;
  evlRow++;

  // Resultado
  setCell(ws, evlRow, 0, 'Resultado', 's', sResultL);
  for (let c = 1; c <= 2; c++) setCell(ws, evlRow, c, '', 's', sResultL);
  merge(evlRow, 0, evlRow, 2);
  setCell(ws, evlRow, 3, '', 's', sResult,
    `IF(N${totalGeralXL}>=${MIN_TOTAL},` +
    `"✓  Pontuação suficiente. O total deferido foi de "&N${totalGeralXL}&" pontos.",` +
    `"✗  Pontuação insuficiente. Não alcançou total de ${MIN_TOTAL} pontos.")`);
  for (let c = 4; c <= NCOL; c++) setCell(ws, evlRow, c, '', 's', sResult);
  merge(evlRow, 3, evlRow, NCOL);
  evlRow++;

  // ── Per-Level compliance check (Mínimo do Regulamento) ───────────────────
  fillRow(ws, evlRow++, NCOL + 1, mkS(C.WHITE, C.WHITE, 8));

  // Sub-title
  setCell(ws, evlRow, 0, 'VERIFICAÇÃO DE PONTUAÇÃO MÍNIMA POR NÍVEL DE RSC', 's', S.sumHdr);
  for (let c = 1; c <= NCOL; c++) setCell(ws, evlRow, c, '', 's', S.sumHdr);
  merge(evlRow, 0, evlRow, NCOL);
  evlRow++;

  // Column headers
  const lvlHdrCols = [
    [0,  2,  'Nível de RSC'],
    [3,  6,  'Pontuação do(a) Requerente'],
    [7,  10, 'Pontuação Deferida do(a) Avaliador(a)'],
    [11, 12, 'Mínimo do Regulamento'],
    [13, 14, 'Situação (Requerente)'],
  ];
  lvlHdrCols.forEach(([c1, c2, lbl]) => {
    setCell(ws, evlRow, c1, lbl, 's', S.sumHdr);
    for (let c = c1 + 1; c <= c2; c++) setCell(ws, evlRow, c, '', 's', S.sumHdr);
    if (c2 > c1) merge(evlRow, c1, evlRow, c2);
  });
  evlRow++;

  [['RSC I', MIN_NIVEL], ['RSC II', MIN_NIVEL], ['RSC III', MIN_NIVEL]].forEach(([lvl, minVal]) => {
    const rXL = evlRow + 1;
    setCell(ws, evlRow, 0, lvl, 's', S.sumLbl);
    for (let c = 1; c <= 2; c++) setCell(ws, evlRow, c, '', 's', S.sumLbl);
    merge(evlRow, 0, evlRow, 2);

    setCell(ws, evlRow, 3, 0, 'n', S.sumReq, `SUMIF(${F_RNG},"${lvl}",${K_RNG})`);
    for (let c = 4; c <= 6; c++) setCell(ws, evlRow, c, '', 's', S.sumReq);
    merge(evlRow, 3, evlRow, 6);

    setCell(ws, evlRow, 7, 0, 'n', S.sumDef, `SUMIF(${F_RNG},"${lvl}",${L_RNG})`);
    for (let c = 8; c <= 10; c++) setCell(ws, evlRow, c, '', 's', S.sumDef);
    merge(evlRow, 7, evlRow, 10);

    setCell(ws, evlRow, 11, minVal, 'n', S.cmpMin);
    setCell(ws, evlRow, 12, '', 's', S.cmpMin);
    merge(evlRow, 11, evlRow, 12);

    setCell(ws, evlRow, 13, '', 's', S.cmpSts,
      `IF(D${rXL}>=${minVal},"✓  ATENDE","✗  INSUFICIENTE")`);
    setCell(ws, evlRow, 14, '', 's', S.cmpSts);
    merge(evlRow, 13, evlRow, 14);
    evlRow++;
  });

  // Level total
  fillRow(ws, evlRow, NCOL + 1, S.sep);
  merge(evlRow, 0, evlRow, NCOL);
  evlRow++;

  {
    const rXL = evlRow + 1;
    setCell(ws, evlRow, 0, 'TOTAL GERAL', 's', S.sumTotal);
    for (let c = 1; c <= 2; c++) setCell(ws, evlRow, c, '', 's', S.sumTotal);
    merge(evlRow, 0, evlRow, 2);

    setCell(ws, evlRow, 3, 0, 'n', S.sumTotal, `SUM(${K_RNG})`);
    for (let c = 4; c <= 6; c++) setCell(ws, evlRow, c, '', 's', S.sumTotal);
    merge(evlRow, 3, evlRow, 6);

    setCell(ws, evlRow, 7, 0, 'n', S.sumTotal, `SUM(${L_RNG})`);
    for (let c = 8; c <= 10; c++) setCell(ws, evlRow, c, '', 's', S.sumTotal);
    merge(evlRow, 7, evlRow, 10);

    setCell(ws, evlRow, 11, MIN_TOTAL, 'n', S.sumTotal);
    setCell(ws, evlRow, 12, '', 's', S.sumTotal);
    merge(evlRow, 11, evlRow, 12);

    setCell(ws, evlRow, 13, '', 's', S.cmpStsT,
      `IF(D${rXL}>=${MIN_TOTAL},"✓  ATENDE","✗  INSUFICIENTE")`);
    setCell(ws, evlRow, 14, '', 's', S.cmpStsT);
    merge(evlRow, 13, evlRow, 14);
    evlRow++;
  }

  // Footnote
  const noteText =
    'Nota: para aprovação são necessários ≥ 50 pontos no total E ≥ 25 pontos no nível RSC requerido ' +
    '(Res. CONSUP nº 29/2014). A coluna "Situação" verifica a pontuação requerente; o resultado final ' +
    'depende das Pontuações Deferidas pelo avaliador.';
  setCell(ws, evlRow, 0, noteText, 's', S.cmpNote);
  for (let c = 1; c <= NCOL; c++) setCell(ws, evlRow, c, '', 's', S.cmpNote);
  merge(evlRow, 0, evlRow, NCOL);
  const R_CMP_LAST = evlRow;

  // ── Worksheet metadata ────────────────────────────────────────────────────
  ws['!ref'] = window.XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: R_CMP_LAST, c: NCOL },
  });

  ws['!cols'] = COLS.map(([, , wch]) => ({ wch }));

  ws['!rows'] = [
    { hpt: 47 },  // R0  brand block (logo image + title, 2-line)
    { hpt:  4 },  // R1  separator
    { hpt: 22 },  // R2  candidate
    { hpt: 22 },  // R3  dates + RT
    { hpt: 22 },  // R4  evaluator (cream)
    { hpt:  4 },  // R5  separator
    { hpt: 20 },  // R6  column headers
  ];

  ws['!merges'] = merges;

  // Freeze: keep header + col A visible while scrolling data
  ws['!sheetViews'] = [{ state: 'frozen', xSplit: 1, ySplit: R_DATA }];

  // A4 landscape print setup
  ws['!pageSetup'] = {
    paperSize:    9,           // A4
    orientation:  'landscape',
    fitToPage:    true,
    fitToWidth:   1,
    fitToHeight:  0,
  };
  ws['!printOptions'] = { gridLines: false };
  ws['!margins'] = { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 };

  return ws;
}

// ── Public export ──────────────────────────────────────────────────────────
export async function generateExcel(items, dados, pageMetas) {
  if (!window.XLSX) throw new Error('SheetJS não carregado.');
  if (!items || items.length === 0) throw new Error('Adicione pelo menos um item antes de gerar o formulário.');

  const criterios = getCriterios();
  const wb = window.XLSX.utils.book_new();

  const wsMain = buildMainSheet(items, dados, criterios, pageMetas);
  window.XLSX.utils.book_append_sheet(wb, wsMain, 'Proposta de Pontuação-RSC');

  const wsAux = buildAuxiliarSheet(criterios);
  window.XLSX.utils.book_append_sheet(wb, wsAux, 'Auxiliar');

  // Hide Auxiliar sheet (lookup-only; evaluator doesn't need to see it)
  wb.Workbook = { Sheets: [{}, { Hidden: 1 }] };

  // Sheet protection — evaluator fills N (col 13) and O (col 14) in data rows,
  // and the evaluator-name area in R_EVAL (row 4, cols 2-10).
  // SheetJS community edition supports !protect for xlsx.
  wsMain['!protect'] = {
    password:           'Bl0que@d02026',
    sheet:              true,
    selectLockedCells:  true,
    selectUnlockedCells:true,
    formatCells:        false,
    formatColumns:      false,
    formatRows:         false,
    insertColumns:      false,
    insertRows:         false,
    deleteColumns:      false,
    deleteRows:         false,
    sort:               false,
    autoFilter:         false,
  };

  const candidateName = (dados?.nome || 'candidato')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').substring(0, 30);
  const fileName = `Formulario_RSC_${candidateName}.xlsx`;

  const xlsxBuf = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const finalBuf = await injectLogoIntoXlsx(xlsxBuf);
  window.saveAs(
    new Blob([finalBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    fileName
  );
}

// ── Logo injection via JSZip post-processing ───────────────────────────────
async function injectLogoIntoXlsx(xlsxBuffer) {
  if (!window.JSZip) return xlsxBuffer;

  let logoPngBytes, natW = 520, natH = 148;
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        natW = img.naturalWidth  || 520;
        natH = img.naturalHeight || 148;
        const cv = document.createElement('canvas');
        cv.width = natW; cv.height = natH;
        cv.getContext('2d').drawImage(img, 0, 0, natW, natH);
        cv.toBlob(
          blob => blob.arrayBuffer().then(buf => { logoPngBytes = buf; resolve(); }).catch(reject),
          'image/png'
        );
      };
      img.onerror = reject;
      img.src = '/logo-cppd-branca.png';
    });
  } catch {
    return xlsxBuffer;
  }

  const zip = await window.JSZip.loadAsync(xlsxBuffer);

  // 1. White logo PNG
  zip.file('xl/media/logo.png', logoPngBytes);

  // 2. Drawing XML — absoluteAnchor sized to preserve the logo's natural aspect ratio
  //    Row 0 height = 47pt (set in ws['!rows']); 1pt = 12700 EMU
  const MARGIN   = 70000;                       // ~5.5pt padding on all sides
  const imgH     = 47 * 12700 - MARGIN * 2;    // 456900 EMU
  const imgW     = Math.round(imgH * (natW / natH));

  const drawingXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"',
    '  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"',
    '  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    '  <xdr:absoluteAnchor>',
    `    <xdr:pos x="${MARGIN}" y="${MARGIN}"/>`,
    `    <xdr:ext cx="${imgW}" cy="${imgH}"/>`,
    '    <xdr:pic>',
    '      <xdr:nvPicPr>',
    '        <xdr:cNvPr id="2" name="Logo IFSC"/>',
    '        <xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr>',
    '      </xdr:nvPicPr>',
    '      <xdr:blipFill>',
    '        <a:blip r:embed="rId1"/>',
    '        <a:stretch><a:fillRect/></a:stretch>',
    '      </xdr:blipFill>',
    '      <xdr:spPr>',
    `        <a:xfrm><a:off x="${MARGIN}" y="${MARGIN}"/><a:ext cx="${imgW}" cy="${imgH}"/></a:xfrm>`,
    '        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>',
    '      </xdr:spPr>',
    '    </xdr:pic>',
    '    <xdr:clientData/>',
    '  </xdr:absoluteAnchor>',
    '</xdr:wsDr>',
  ].join('\n');
  zip.file('xl/drawings/drawing1.xml', drawingXml);

  // 3. Drawing relationships (image → logo.png)
  zip.file('xl/drawings/_rels/drawing1.xml.rels', [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '  <Relationship Id="rId1"',
    '    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"',
    '    Target="../media/logo.png"/>',
    '</Relationships>',
  ].join('\n'));

  // 4. Find first worksheet file and inject <drawing r:id="rId_logo"/>
  const sheetFiles = Object.keys(zip.files)
    .filter(f => /^xl\/worksheets\/sheet\d+\.xml$/.test(f))
    .sort();
  if (sheetFiles.length > 0) {
    let sheetXml = await zip.file(sheetFiles[0]).async('string');
    if (!sheetXml.includes('<drawing ')) {
      // Ensure r: namespace is present on the root element
      if (!sheetXml.includes('xmlns:r=')) {
        sheetXml = sheetXml.replace('<worksheet ', '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
      }
      sheetXml = sheetXml.replace('</worksheet>', '<drawing r:id="rId_logo"/></worksheet>');
    }
    zip.file(sheetFiles[0], sheetXml);

    // 5. Sheet relationships — add drawing entry
    const sheetRelsPath = sheetFiles[0].replace('xl/worksheets/', 'xl/worksheets/_rels/').replace('.xml', '.xml.rels');
    const drawingRel = '  <Relationship Id="rId_logo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>';
    const existingRels = zip.file(sheetRelsPath);
    if (existingRels) {
      let relsXml = await existingRels.async('string');
      if (!relsXml.includes('drawing1.xml')) {
        relsXml = relsXml.replace('</Relationships>', `${drawingRel}\n</Relationships>`);
      }
      zip.file(sheetRelsPath, relsXml);
    } else {
      zip.file(sheetRelsPath, [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        drawingRel,
        '</Relationships>',
      ].join('\n'));
    }
  }

  // 6. [Content_Types].xml — register PNG type and drawing part
  let ctXml = await zip.file('[Content_Types].xml').async('string');
  if (!ctXml.includes('Extension="png"')) {
    ctXml = ctXml.replace(/<Override /, '<Default Extension="png" ContentType="image/png"/><Override ');
  }
  if (!ctXml.includes('drawing1.xml')) {
    ctXml = ctXml.replace('</Types>',
      '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>');
  }
  zip.file('[Content_Types].xml', ctXml);

  return zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
