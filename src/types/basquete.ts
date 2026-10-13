export type FocoTreino = 'arremesso' | 'iq' | 'fisico' | 'equilibrado';

export type ArquetipoAtleta = 
  | 'Pass-First Maestro 🧠' 
  | 'Cestinha Slasher ⚡' 
  | '3&D Especialista 🎯' 
  | 'Protetor de Garrafão / Rim Protector 🛡️';

export interface Atleta {
  nome: string;
  numero: string;
  nacionalidade: string;
  maoDominante: string;
  posicao: string;
  mentalidade: string;
  arquetipo?: ArquetipoAtleta;
  potencialSecreto?: 'GeracaoUnica' | 'JogadorSolido' | 'RiscoFlop';
  focoTreinoAtual?: FocoTreino;
}

export type FuncaoElenco = 
  | 'Promessa 🐣' 
  | 'Sexto Homem ⚡' 
  | 'Líder da Franquia 👑' 
  | 'Veterano / Mentor 👴' 
  | 'Reserva Aquece-Banco 🪑';

export interface NoticiaImprensa {
  manchete: string;
  veiculo: string;
  tipo: 'sucesso' | 'alerta' | 'crise' | 'neutro';
  percepcaoMercado: string;
}

export interface EstatisticasFase {
  jogos: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  tpm: number;
  tov: number;
}

export interface TorneioSelecao {
  nomeTorneio: string;
  posicaoFinal: string;
  ppgSelecao: number;
}

export interface ClássicoRivalidade {
  nomeRival: string;
  resultadoJogo: 'Vitoria 🏆' | 'Derrota ❌';
  destaqueAtleta: string;
}

export interface TemporadaHistorico {
  idade: number;
  clube: string;
  liga: string;
  ovr: number;
  funcao: FuncaoElenco;
  confiancaTreinador: number;
  mpg: number;
  jogos: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  tpm: number;
  tov: number;
  desempenhoClutch: number;
  nivelFadiga: number; // 0 a 100%
  pontosTotais: number;
  rebotesTotais: number;
  assistenciasTotais: number;
  titulos: number;
  status?: string;
  noticiaImprensa?: NoticiaImprensa;
  faseRegular: EstatisticasFase;
  playoffs?: EstatisticasFase & { resultadoCampanha: string };
  torneioSelecao?: TorneioSelecao;
  classicoRivalidade?: ClássicoRivalidade;
  premiacoesIndividuais: string[];
}

export interface RelatorioHallDaFama {
  pontosLegado: number;
  tierLegado: 'Lenda Imortal (GOAT) 👑' | 'Membro do Hall da Fama 🏛️' | 'Ídolo de Franquia ⭐️' | 'Carreira Respeitada 📊' | 'Promessa Incompleta 📉';
  descricaoLegado: string;
  titulosSelecao: string[];
}

export interface EventoAleatorio {
  titulo: string;
  descricao: string;
  opcao1Texto: string;
  opcao2Texto: string;
  acaoOpcao1: () => void;
  acaoOpcao2: () => void;
}

export interface TotaisCarreira {
  titulos: number;
  mvps: number;
  dpoy: number;
  jogosTotais: number;
  pontosTotais: number;
  assistenciasTotais: number;
}