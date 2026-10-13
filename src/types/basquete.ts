export interface Atleta {
  nome: string;
  numero: string;
  nacionalidade: string;
  maoDominante: string;
  posicao: string;
  mentalidade: string;
  potencialSecreto?: 'GeracaoUnica' | 'JogadorSolido' | 'RiscoFlop';
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
  percepcaoMercado: string; // Ex: "Estrela do Ano", "Em Afirmação", "Sob Pressão"
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
  pontosTotais: number;
  rebotesTotais: number;
  assistenciasTotais: number;
  titulos: number;
  status?: string;
  noticiaImprensa?: NoticiaImprensa;
  
  // Detalhamento por Fase
  faseRegular: EstatisticasFase;
  playoffs?: EstatisticasFase & { resultadoCampanha: string };
  premiacoesIndividuais: string[];
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
  jogosTotais: number;
  pontosTotais: number;
  assistenciasTotais: number;
}