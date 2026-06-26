# Sistema de Geração de Memorial RSC (SGRSC)

Ferramenta web para organização de comprovantes e geração automática do **Memorial de Reconhecimento de Saberes e Competências (RSC)** para docentes da Rede Federal, conforme o Anexo III da **Resolução CONSUP nº 29/2014** e suas retificações pelas Resoluções CONSUP nº 13/2017 e nº 48/2018, no âmbito do **IFSC — Instituto Federal de Santa Catarina**.

---

## Funcionalidades

| Recurso | Descrição |
|---|---|
| **Cálculo automático** | Pontuação por critério, por diretriz e por nível de RSC em tempo real |
| **Validação** | Campos obrigatórios, limites de quantidade e documentos anexados obrigatórios |
| **Memorial PDF** | Arquivo PDF unificado com capa, memorial descritivo, declaração, sumário e comprovantes |
| **Formulário XLSX** | Planilha de avaliação pré-preenchida para a comissão avaliadora |
| **Privacidade** | Todo o processamento ocorre localmente no navegador — nenhum dado é enviado a servidores externos |

---

## Tecnologias

| Biblioteca | Versão | Uso |
|---|---|---|
| React | 19 | Interface de usuário |
| Vite | 8 | Bundler / dev server |
| jsPDF | 2.5 | Geração de páginas PDF |
| pdf-lib | 1.17 | Mesclagem do PDF final |
| xlsx-js-style | 1.2 | Geração da planilha XLSX com estilos |
| FileSaver.js | 2.0 | Download dos arquivos gerados |
| flatpickr | 4.6 | Seletor de datas |

As bibliotecas de PDF e planilha são carregadas via CDN no `index.html` para evitar limitações do bundler com arquivos binários grandes.

---

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Instalação e execução

```bash
# Clonar / extrair o projeto
cd memorial-rsc-react

# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build
npm run preview
```

---

## Estrutura do projeto

```
memorial-rsc-react/
├── public/
│   ├── logo-ifsc.png          # Logo oficial do IFSC
│   └── favicon.png            # Ícone da aba do navegador
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Cabeçalho com logo
│   │   ├── Footer.jsx         # Rodapé institucional
│   │   ├── IdentificationForm.jsx  # Formulário de identificação do servidor
│   │   ├── ItemAdder.jsx      # Seletor de critério + botão "Adicionar"
│   │   ├── ItemList.jsx       # Lista de comprovantes lançados
│   │   ├── ItemCard.jsx       # Card de um comprovante (acordeão)
│   │   ├── ScorePanel.jsx     # Painel de pontuação simultânea
│   │   ├── MessageModal.jsx   # Modal de confirmação / alerta
│   │   ├── Toast.jsx          # Notificação temporária
│   │   ├── AlertBanner.jsx    # Banner informativo
│   │   ├── HowToUse.jsx       # Seção de instruções de uso
│   │   └── LibErrorBanner.jsx # Aviso de bibliotecas CDN não carregadas
│   ├── lib/
│   │   ├── engine.js          # Motor de cálculo + dados dos critérios (protegido)
│   │   ├── pdfGenerator.js    # Geração do Memorial PDF unificado
│   │   └── excelGenerator.js  # Geração do Formulário de Avaliação XLSX
│   ├── App.jsx                # Componente raiz + gerenciamento de estado
│   ├── main.jsx               # Ponto de entrada React
│   └── index.css              # Estilos globais (Design System Gov.br)
└── index.html                 # HTML raiz com CDN das bibliotecas de PDF/XLSX
```

---

## Fluxo de uso

1. **Preencher identificação** — nome, SIAPE, nível de RSC pretendido, e-mail, celular e data limite dos documentos.
2. **Lançar comprovantes** — selecionar o critério, descrever o documento, informar data e quantidade e anexar o PDF comprobatório.
3. **Acompanhar pontuação** — o painel atualiza em tempo real os dois critérios regulamentares:
   - Critério 1: total geral ≥ 50 pontos
   - Critério 2: nível pretendido ≥ 25 pontos
4. **Gerar Memorial PDF** — produz um arquivo único com: capa, memorial descritivo, declaração de confere com o original, sumário e todos os comprovantes anexados.
5. **Gerar Formulário XLSX** — produz a planilha de avaliação pré-preenchida para a comissão avaliadora. As colunas **Pontuação Deferida** e **Observação / Indeferimento** ficam desbloqueadas para o(a) avaliador(a). Gere o PDF antes do XLSX para que as colunas **Página Inicial** e **Página Final** sejam preenchidas automaticamente.

---

## Proteção da planilha

A planilha gerada é protegida com senha. As únicas células editáveis são:

- **Linha do(a) Avaliador(a)** — nome e data da avaliação
- **Coluna N** — Pontuação Deferida (uma célula por item)
- **Coluna O** — Observação / Indeferimento (uma célula por item)

---

## Critérios e regulamento

Os dados dos critérios estão embutidos em `src/lib/engine.js`, codificados conforme o **Anexo III da Resolução CONSUP nº 29/2014**. O motor calcula automaticamente:

- Pontuação por item (`fator × quantidade`, respeitando `limiteDiretriz`)
- Total por nível de RSC e por diretriz
- Verificação dos dois critérios mínimos regulamentares

---

## Privacidade e segurança

- Nenhum dado pessoal, arquivo ou pontuação é enviado a servidores externos.
- Todo o processamento (cálculos, PDF e planilha) ocorre inteiramente no navegador do usuário.
- Os arquivos anexados são lidos localmente via `File API` e descartados ao fechar a aba.

---

## Limitações conhecidas

| Limitação | Descrição |
|---|---|
| Logo na planilha | A edição comunitária do xlsx-js-style não suporta incorporação de imagens; o logo aparece apenas no PDF. |
| PDFs criptografados | Arquivos PDF protegidos por senha podem não ser mesclados corretamente. |
| Memória do navegador | Volumes muito grandes de comprovantes PDF podem exceder os limites de memória disponíveis. |

---

## Licença

Uso restrito ao âmbito do IFSC. Desenvolvido para apoio à Comissão Permanente de Pessoal Docente (CPPD).
