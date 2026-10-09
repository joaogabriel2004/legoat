import { Atleta, TemporadaHistorico } from '@/src/types/basquete';
import { BANCO_DE_EVENTOS, TemplateEvento } from '@/src/data/eventos';

export const CLUBES_NACIONAIS = [
  "Franca Basquete", "Flamengo Basquete", "Minas Tênis Clube", "São Paulo FC", "Paulistano", "Bauru Basket"
];

export const CLUBES_CONTINENTAIS = [
  "Olimpia Milano (Itália)", "Anadolu Efes (Turquia)", "Virtus Bologna (Itália)", "Fenerbahçe (Turquia)", "Sydney Kings (Austrália)"
];

export const CLUBES_GLOBAIS = [
  "Real Madrid (Espanha)", "FC Barcelona (Espanha)", "Los Angeles Pro (EUA)"
];

// Função para gerar propostas realistas baseadas no OVR do atleta
export function gerarOfertasTransferencia(ovrAtual: number, clubeAtual: string): string[] {
  let poolDisponivel: string[] = [];

  if (ovrAtual < 72) {
    // Jogadores em início de carreira ou OVR baixo só recebem ofertas nacionais
    poolDisponivel = CLUBES_NACIONAIS;
  } else if (ovrAtual >= 72 && ovrAtual < 82) {
    // Jogadores medianos atraem equipas continentais e algumas nacionais fortes
    poolDisponivel = [...CLUBES_NACIONAIS, ...CLUBES_CONTINENTAIS];
  } else {
    // Superestrelas (82+) atraem elites globais e continentais
    poolDisponivel = [...CLUBES_CONTINENTAIS, ...CLUBES_GLOBAIS];
  }

  // Filtrar o clube atual para não duplicar na lista imediata
  const filtrados = poolDisponivel.filter(c => c !== clubeAtual);
  
  // Escolher 2 equipas aleatórias do pool compatível
  const oferta1 = filtrados[Math.floor(Math.random() * filtrados.length)] || CLUBES_NACIONAIS[0];
  const oferta2 = filtrados[Math.floor(Math.random() * filtrados.length)] || CLUBES_CONTINENTAIS[0];

  return [clubeAtual, oferta1, oferta2];
}

// Calcular Valor de Mercado em Milhões de Euros (€M)
export function calcularValorMercado(ovr: number, idade: number): number {
  if (ovr < 65) return Number((1.5 + Math.random()).toFixed(1));
  const base = Math.pow(ovr - 60, 2.2) * 0.4;
  const fatorIdade = idade <= 25 ? 1.4 : (idade > 32 ? 0.5 : 1.0);
  return Math.max(2, Math.round(base * fatorIdade));
}

export function simularTemporadaAtual(
  atleta: Atleta,
  idadeAtual: number,
  clubeAtual: string,
  ovrAtual: number
): { novaTemporada: TemporadaHistorico; novoOvr: number; eventoSorteado?: TemplateEvento; aposentado?: boolean } {
  const jogosAno = 82;
  
  // 1. Aposentadoria Automática
  if (idadeAtual >= 39 || ovrAtual < 58) {
    const temporadaVazia: TemporadaHistorico = {
      idade: idadeAtual,
      clube: 'Aposentado 🛑',
      ovr: ovrAtual,
      jogos: 0,
      ppg: 0,
      rpg: 0,
      apg: 0,
      spg: 0,
      tpm: 0,
      tov: 0,
      pontosTotais: 0,
      rebotesTotais: 0,
      assistenciasTotais: 0,
      titulos: 0,
      status: 'Fim de Carreira 🏅'
    };
    return { novaTemporada: temporadaVazia, novoOvr: ovrAtual, aposentado: true };
  }

  // 2. Lesões
  const sofreuLesao = Math.random() < (idadeAtual > 32 ? 0.14 : 0.06);
  let jogosEfetivos = jogosAno;
  let statusLesao = '';

  if (sofreuLesao) {
    const jogosLesionado = Math.floor(Math.random() * 30) + 12;
    jogosEfetivos = Math.max(20, jogosAno - jogosLesionado);
    statusLesao = 'Lesionado 🏥';
  }

  // 3. Médias por Jogo
  const fatorEstrela = (ovrAtual - 50) / 49;
  
  let ppgBase = 8 + (fatorEstrela * 22);
  let rpgBase = 3 + (fatorEstrela * 7);
  let apgBase = 2 + (fatorEstrela * 8);

  if (atleta.posicao.includes('Armador (PG)')) {
    apgBase *= 1.4;
    rpgBase *= 0.6;
  } else if (atleta.posicao.includes('Pivô (C)')) {
    rpgBase *= 1.6;
    apgBase *= 0.5;
    ppgBase *= 0.95;
  }

  const ppg = Number((ppgBase + (Math.random() * 4 - 2)).toFixed(1));
  const rpg = Number((rpgBase + (Math.random() * 2 - 1)).toFixed(1));
  const apg = Number((apgBase + (Math.random() * 2 - 1)).toFixed(1));
  const spg = Number((0.8 + (fatorEstrela * 1.2) + (Math.random() * 0.6)).toFixed(1));
  const tpm = Number((1.0 + (fatorEstrela * 2.5) + (Math.random() * 0.8)).toFixed(1));
  const tov = Number((1.5 + (Math.random() * 1.5)).toFixed(1));

  const pontosTotais = Math.round(ppg * jogosEfetivos);
  const rebotesTotais = Math.round(rpg * jogosEfetivos);
  const assistenciasTotais = Math.round(apg * jogosEfetivos);

  const eliteLiga = ovrAtual >= 82;
  const superEstrela = ovrAtual >= 88;

  const ganhouTitulo = eliteLiga && Math.random() > (ovrAtual >= 90 ? 0.25 : 0.6);
  const ganhouMvp = superEstrela && Math.random() > 0.5;
  
  let statusTemporada = statusLesao;
  if (!statusTemporada) {
    if (ganhouMvp) statusTemporada = 'MVP 👑';
    else if (ganhouTitulo) statusTemporada = 'Campeão 💍';
  }

  const novaTemporada: TemporadaHistorico = {
    idade: idadeAtual,
    clube: clubeAtual,
    ovr: ovrAtual,
    jogos: jogosEfetivos,
    ppg,
    rpg,
    apg,
    spg,
    tpm,
    tov,
    pontosTotais,
    rebotesTotais,
    assistenciasTotais,
    titulos: ganhouTitulo ? 1 : 0,
    status: statusTemporada
  };

  // 4. Progressão / Declínio de OVR
  let ganhoOvr = 0;
  const bonusMentalidade = atleta.mentalidade === 'Fominha de Treino (Gym Rat)' ? 1 : 0;

  if (idadeAtual <= 27) {
    ganhoOvr = Math.floor(Math.random() * 4) + 2 + bonusMentalidade;
  } else if (idadeAtual <= 31) {
    ganhoOvr = Math.random() > 0.5 ? 1 : 0;
  } else if (idadeAtual === 32) {
    ganhoOvr = -1;
  } else if (idadeAtual >= 33 && idadeAtual <= 35) {
    ganhoOvr = -Math.floor(Math.random() * 2) - 1;
  } else {
    ganhoOvr = -Math.floor(Math.random() * 3) - 2;
  }

  const novoOvr = Math.min(99, Math.max(45, ovrAtual + ganhoOvr));

  // 5. Evento Aleatório
  let eventoSorteado: TemplateEvento | undefined = undefined;
  if (idadeAtual < 38 && BANCO_DE_EVENTOS.length > 0 && Math.random() < 0.45) {
    const indexAleatorio = Math.floor(Math.random() * BANCO_DE_EVENTOS.length);
    eventoSorteado = BANCO_DE_EVENTOS[indexAleatorio];
  }

  return {
    novaTemporada,
    novoOvr,
    eventoSorteado,
    aposentado: false
  };
}