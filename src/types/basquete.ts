export interface Atleta {
  nome: string;
  numero: string;
  nacionalidade: string;
  maoDominante: string;
  posicao: 'Armador (PG)' | 'Ala-Armador (SG)' | 'Ala (SF)' | 'Ala-Pivô (PF)' | 'Pivô (C)' | string;
  mentalidade?: 'Fominha de Treino (Gym Rat)' | 'Talento Natural' | 'Competitivo';
}

export interface TemporadaHistorico {
  idade: number;
  clube: string;
  ovr: number;
  jogos: number;
  // Médias por jogo (para exibição realista estilo basquete)
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  tpm: number; // Bolas de 3 convertidas por jogo
  tov: number; // Turnovers por jogo
  // Totais da época
  pontosTotais: number;
  rebotesTotais: number;
  assistenciasTotais: number;
  titulos: number;
  status?: string; // Ex: 'MVP 👑', 'Campeão 💍', 'SUSP 🚫', 'Lesionado 🏥'
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