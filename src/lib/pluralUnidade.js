const PLURAL = {
  'Mês':                          ['mês',                          'meses'],
  'Evento':                       ['evento',                       'eventos'],
  'Atividade Concluída':          ['atividade concluída',          'atividades concluídas'],
  'Material':                     ['material',                     'materiais'],
  'Prêmio':                       ['prêmio',                       'prêmios'],
  'Curso Concluido':              ['curso concluído',              'cursos concluídos'],
  'Orientação Concluída':         ['orientação concluída',         'orientações concluídas'],
  'Processo':                     ['processo',                     'processos'],
  'Livro':                        ['livro',                        'livros'],
  'Projeto aprovado':             ['projeto aprovado',             'projetos aprovados'],
  'Concurso/Processos Seletivo':  ['concurso/processo seletivo',   'concursos/processos seletivos'],
  'Concurso':                     ['concurso',                     'concursos'],
  'Banca':                        ['banca',                        'bancas'],
  'Curso':                        ['curso',                        'cursos'],
  'Registro':                     ['registro',                     'registros'],
  'Depósito':                     ['depósito',                     'depósitos'],
  'Desenv. Concluido':            ['desenv. concluído',            'desenv. concluídos'],
  'Comissão':                     ['comissão',                     'comissões'],
  'PCC/PPC':                      ['PCC/PPC',                      'PCC/PPC'],
  'Projeto':                      ['projeto',                      'projetos'],
  'Contrato ou Licenciamento':    ['contrato ou licenciamento',    'contratos ou licenciamentos'],
  'Programa':                     ['programa',                     'programas'],
  'Protótipo':                    ['protótipo',                    'protótipos'],
  'PPC':                          ['PPC',                          'PPC'],
  'Projeto Concluido':            ['projeto concluído',            'projetos concluídos'],
  'Capítulo':                     ['capítulo',                     'capítulos'],
  'Artigo':                       ['artigo',                       'artigos'],
  'Relatório':                    ['relatório',                    'relatórios'],
  'Trabalho':                     ['trabalho',                     'trabalhos'],
  'Edital':                       ['edital',                       'editais'],
  'Unidade Curricular':           ['unidade curricular',           'unidades curriculares'],
  'Monografia Concluida':         ['monografia concluída',         'monografias concluídas'],
  'Dissertação Concluída':        ['dissertação concluída',        'dissertações concluídas'],
  'Semestre':                     ['semestre',                     'semestres'],
  'Trimestre':                    ['trimestre',                    'trimestres'],
};

export function pluralUnidade(unidade, quantidade) {
  const par = PLURAL[unidade];
  if (!par) return unidade.toLowerCase();
  return parseFloat(quantidade) === 1 ? par[0] : par[1];
}
