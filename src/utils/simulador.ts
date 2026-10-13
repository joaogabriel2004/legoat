import { Atleta, TemporadaHistorico, FuncaoElenco, NoticiaImprensa } from '@/src/types/basquete';
import { BANCO_DE_CLUBES } from '@/src/data/clubes';
import { BANCO_DE_EVENTOS, TemplateEvento } from '@/src/data/eventos';
import { calcularJogosDaTemporada } from '@/src/data/ligas';

export function obterClubeInicial(): string {
  const iniciais = BANCO_DE_CLUBES.filter(c => c.reputacao <= 2 && c.pais === "Brasil");
  const sorteado = iniciais[Math.floor(Math.random() * iniciais.length)];
  return sorteado ? sorteado.nome : "Pato Basquete";
}

export function determinarFuncaoElenco(idade: number, ovr: number, confianca: number, reputacaoClube: number): FuncaoElenco {
  if (idade >= 32) return 'Veterano / Mentor 👴';
  if (confianca < 35) return 'Reserva Aquece-Banco 🪑';

  const ovrMinimoEstrela = 62 + (reputacaoClube * 4.0);
  const ovrMinimoTitular = 55 + (reputacaoClube * 3.5);

  if (ovr >= ovrMinimoEstrela && confianca >= 55) return 'Líder da Franquia 👑';
  if (ovr >= ovrMinimoTitular && confianca >= 45) return 'Sexto Homem ⚡';
  return 'Promessa 🐣';
}

export function obterProjecaoImprensa(potencial: string, ovr: number): string {
  if (ovr >= 88) return '🌟 Estrela de Calibre Mundial';
  if (potencial === 'GeracaoUnica') return '🔥 Fenômeno com Teto Ilimitado';
  if (potencial === 'JogadorSolido') return '🏀 Promessa com Futuro Promissor';
  return '⚠️ Jogador com Teto Questionável';
}

function gerarMancheteImprensa(
  nomeAtleta: string,
  ovr: number,
  status: string | undefined,
  clutch: number,
  mpg: number,
  funcao: FuncaoElenco
): NoticiaImprensa {
  const veiculos = ['BasketNews', 'Globo Esporte', 'ESPN Central', 'HoopCentral', 'DraftExpress'];
  const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];

  if (status?.includes('MVP')) {
    return { manchete: `👑 TEMPORADA LENDÁRIA! ${nomeAtleta} domina a liga e conquista o prêmio de MVP!`, veiculo, tipo: 'sucesso' };
  }
  if (status?.includes('Campeão')) {
    return { manchete: `💍 ANEL NO DEDO! ${nomeAtleta} brilha nas finais e levanta a taça!`, veiculo, tipo: 'sucesso' };
  }
  if (clutch >= 75) {
    return { manchete: `🔥 SANGUE FRIO! Analistas destacam a capacidade decisiva de ${nomeAtleta} nos momentos finais.`, veiculo, tipo: 'sucesso' };
  }
  if (funcao === 'Reserva Aquece-Banco 🪑' || mpg < 10) {
    return { manchete: `📉 FORA DOS PLANOS? Sem minutos de quadra, futuro de ${nomeAtleta} vira incerteza.`, veiculo, tipo: 'crise' };
  }
  if (ovr >= 82) {
    return { manchete: `⭐ NÍVEL ALL-STAR: ${nomeAtleta} firma-se entre os melhores atletas da sua posição.`, veiculo, tipo: 'sucesso' };
  }
  if (ovr <= 65 && mpg > 20) {
    return { manchete: `⚠️ DIFICULDADES EM QUADRA: Mídia critica baixo aproveitamento nos arremessos de ${nomeAtleta}.`, veiculo, tipo: 'alerta' };
  }

  return { manchete: `📊 DESEMPENHO SÓLIDO: ${nomeAtleta} cumpre papel na rotação e mantém estabilidade.`, veiculo, tipo: 'neutro' };
}

export function gerarOfertasTransferencia(ovrAtual: number, clubeAtualNome: string): string[] {
  let repMax = 2;

  if (ovrAtual >= 84) repMax = 5;      // Titular/Estrela NBA
  else if (ovrAtual >= 78) repMax = 4; // EuroLiga / Reserva NBA
  else if (ovrAtual >= 71) repMax = 3; // NBB Top / CBA
  else repMax = 2;                     // NBB Base / Ligas Locais

  const disponiveis = BANCO_DE_CLUBES.filter(c => c.reputacao <= repMax && c.nome !== clubeAtualNome);
  const embaralhados = [...disponiveis].sort(() => 0.5 - Math.random());
  const oferta1 = embaralhados[0]?.nome || "Pinheiros";
  const oferta2 = embaralhados[1]?.nome || "Botafogo";

  return [clubeAtualNome, oferta1, oferta2];
}

export function calcularValorMercado(ovr: number, idade: number): number {
  if (ovr < 60) return Number((0.5 + Math.random() * 0.4).toFixed(1));
  const base = Math.pow(ovr - 58, 2.0) * 0.22;
  const fatorIdade = idade <= 23 ? 1.2 : (idade > 31 ? 0.4 : 0.9);
  return Math.max(1, Math.round(base * fatorIdade));
}

export function simularTemporadaAtual(
  atleta: Atleta,
  idadeAtual: number,
  clubeAtual: string,
  ovrAtual: number,
  quimicaAtual: number,
  confiancaAtual: number
): {
  novaTemporada: TemporadaHistorico;
  novoOvr: number;
  novaQuimica: number;
  novaConfianca: number;
  eventoSorteado?: TemplateEvento;
  aposentado?: boolean;
} {
  
  // 1. Aposentadoria Automática
  const chanceAposentar = idadeAtual >= 37 ? 0.8 : (idadeAtual >= 32 && ovrAtual < 64 ? 0.6 : (ovrAtual < 52 ? 0.95 : 0));
  
  if (Math.random() < chanceAposentar || idadeAtual >= 39) {
    const temporadaVazia: TemporadaHistorico = {
      idade: idadeAtual,
      clube: 'Aposentado 🛑',
      ovr: ovrAtual,
      funcao: 'Veterano / Mentor 👴',
      confiancaTreinador: confiancaAtual,
      mpg: 0,
      jogos: 0,
      ppg: 0,
      rpg: 0,
      apg: 0,
      spg: 0,
      tpm: 0,
      tov: 0,
      desempenhoClutch: 0,
      pontosTotais: 0,
      rebotesTotais: 0,
      assistenciasTotais: 0,
      titulos: 0,
      status: 'Fim de Carreira 🏅'
    };
    return { novaTemporada: temporadaVazia, novoOvr: ovrAtual, novaQuimica: quimicaAtual, novaConfianca: confiancaAtual, aposentado: true };
  }

  // 2. Potencial Secreto
  let potencial = atleta.potencialSecreto || 'JogadorSolido';

  // 3. Clube e Dificuldade
  const clubeObjeto = BANCO_DE_CLUBES.find(c => c.nome === clubeAtual);
  const reputacaoClube = clubeObjeto ? clubeObjeto.reputacao : 2;
  const nomeLiga = clubeObjeto ? clubeObjeto.liga : "NBB";

  const fatorDificuldadeLiga = 0.70 + (reputacaoClube * 0.15);

  // 4. Função no Elenco
  const funcao = determinarFuncaoElenco(idadeAtual, ovrAtual, confiancaAtual, reputacaoClube);

  // 5. Minutagem (MPG)
  let mpgBase = 10;
  if (funcao === 'Líder da Franquia 👑') mpgBase = 30 + (confiancaAtual / 100) * 5;
  else if (funcao === 'Sexto Homem ⚡') mpgBase = 21 + (confiancaAtual / 100) * 4;
  else if (funcao === 'Veterano / Mentor 👴') mpgBase = 14 + (confiancaAtual / 100) * 4;
  else if (funcao === 'Reserva Aquece-Banco 🪑') mpgBase = Math.max(3, 7 + (confiancaAtual / 100) * 3);
  else mpgBase = Math.max(6, 13 + (confiancaAtual / 100) * 4);

  const mpg = Number(Math.min(38, Math.max(3, mpgBase)).toFixed(1));

  // 6. Ajuste de Química
  let varQuimica = 5;
  if (funcao === 'Veterano / Mentor 👴') varQuimica += 4;
  if (funcao === 'Reserva Aquece-Banco 🪑') varQuimica -= 6;
  const quimicaCalculada = Math.min(100, Math.max(10, quimicaAtual + varQuimica));
  const fatorQuimica = quimicaCalculada / 100;

  // 7. Performance Clutch
  const desempenhoClutch = Math.min(100, Math.max(15, Math.round(((ovrAtual / fatorDificuldadeLiga) * 0.68) + (confiancaAtual * 0.20) + (Math.random() * 12))));

  const ganhouMvp = ovrAtual >= (76 + reputacaoClube * 2) && desempenhoClutch >= 72 && Math.random() < 0.20; 

  // 8. POTENCIAL DINÂMICO (Romper o teto ou flopar com base nas temporadas)
  if (desempenhoClutch >= 78 && confiancaAtual >= 80 && potencial === 'JogadorSolido' && Math.random() < 0.18) {
    atleta.potencialSecreto = 'GeracaoUnica'; // Promovido a estrela!
    potencial = 'GeracaoUnica';
  } else if (confiancaAtual < 40 && mpg < 10 && potencial === 'JogadorSolido' && Math.random() < 0.25) {
    atleta.potencialSecreto = 'RiscoFlop'; // Rebaixado a risco de flop
    potencial = 'RiscoFlop';
  }

  // 9. Calendário e Playoffs
  const { jogosDisputados, chegouAosPlayoffs } = calcularJogosDaTemporada(nomeLiga, ovrAtual, false, quimicaCalculada);
  const ganhouTitulo = ovrAtual >= (66 + reputacaoClube * 2) && chegouAosPlayoffs && Math.random() < ((ovrAtual >= 80 ? 0.22 : 0.10) * (0.5 + fatorQuimica * 0.7));

  // 10. Confiança do Treinador
  let varConfianca = 2;
  if (desempenhoClutch >= 68) varConfianca += 3;
  if (mpg < 10) varConfianca -= 4;
  const confiancaCalculada = Math.min(100, Math.max(15, confiancaAtual + varConfianca));

  // 11. Lesões
  let jogosEfetivos = jogosDisputados;
  const chanceLesaoGrave = 0.05;
  const sofreuLesaoGrave = Math.random() < chanceLesaoGrave;
  const sofreuLesaoComum = !sofreuLesaoGrave && Math.random() < (idadeAtual > 30 ? 0.16 : 0.08);

  let statusLesao = '';
  let perdaOvrLesao = 0;

  if (sofreuLesaoGrave) {
    jogosEfetivos = Math.max(5, Math.floor(jogosDisputados * 0.25));
    perdaOvrLesao = Math.floor(Math.random() * 3) + 2;
    statusLesao = 'Lesão Grave 🩹';
  } else if (sofreuLesaoComum) {
    const jogosPerdidos = Math.floor(Math.random() * 18) + 6;
    jogosEfetivos = Math.max(8, jogosEfetivos - jogosPerdidos);
    statusLesao = 'Lesionado 🏥';
  }

  // 12. Médias
  const fatorMinutos = mpg / 36;
  const fatorRendimentoOvr = Math.max(0, (ovrAtual - 52) / 40);
  const rendimentoAjustadoLiga = fatorRendimentoOvr / (fatorDificuldadeLiga * 0.88);

  let ppgBase = (5 + (rendimentoAjustadoLiga * 22)) * fatorMinutos; 
  let rpgBase = (1.2 + (fatorRendimentoOvr * 6.0)) * fatorMinutos;
  let apgBase = (1.0 + (fatorRendimentoOvr * 6.0)) * fatorMinutos * (0.85 + fatorQuimica * 0.25);

  if (atleta.posicao.includes('Armador (PG)')) {
    apgBase *= 1.35;
    rpgBase *= 0.55;
  } else if (atleta.posicao.includes('Pivô (C)')) {
    rpgBase *= 1.6;
    apgBase *= 0.45;
    ppgBase *= 0.9;
  }

  const ppg = Number(Math.max(0.8, ppgBase + (Math.random() * 1.8 - 0.9)).toFixed(1));
  const rpg = Number(Math.max(0.2, rpgBase + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const apg = Number(Math.max(0.2, apgBase + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const spg = Number((0.2 + (fatorRendimentoOvr * 0.9) * fatorMinutos).toFixed(1));
  const tpm = Number((0.2 + (fatorRendimentoOvr * 1.8) * fatorMinutos).toFixed(1));
  const tov = Number((0.8 + (Math.random() * 1.0)).toFixed(1));

  const pontosTotais = Math.round(ppg * jogosEfetivos);
  const rebotesTotais = Math.round(rpg * jogosEfetivos);
  const assistenciasTotais = Math.round(apg * jogosEfetivos);

  let statusTemporada = statusLesao;
  if (!statusTemporada) {
    if (ganhouMvp) statusTemporada = 'MVP 👑';
    else if (ganhouTitulo) statusTemporada = 'Campeão 💍';
    else if (chegouAosPlayoffs) statusTemporada = 'Playoffs 🏀';
  }

  // GERAR MANCHETE DA IMPRENSA DA ÉPOCA
  const noticiaImprensa = gerarMancheteImprensa(
    atleta.nome || 'O Atleta',
    ovrAtual,
    statusTemporada,
    desempenhoClutch,
    mpg,
    funcao
  );

  const novaTemporada: TemporadaHistorico = {
    idade: idadeAtual,
    clube: clubeAtual,
    ovr: ovrAtual,
    funcao,
    confiancaTreinador: confiancaCalculada,
    mpg,
    jogos: jogosEfetivos,
    ppg,
    rpg,
    apg,
    spg,
    tpm,
    tov,
    desempenhoClutch,
    pontosTotais,
    rebotesTotais,
    assistenciasTotais,
    titulos: ganhouTitulo ? 1 : 0,
    status: statusTemporada,
    noticiaImprensa
  };

  // 13. CURVA DE OVR RECALIBRADA
  let alteracaoOvr = 0;
  const bonusGymRat = atleta.mentalidade === 'Fominha de Treino (Gym Rat)' ? 1 : 0;

  if (idadeAtual <= 21) {
    if (potencial === 'RiscoFlop') {
      alteracaoOvr = Math.random() < 0.5 ? 1 : 0;
    } else if (potencial === 'GeracaoUnica') {
      alteracaoOvr = Math.floor(Math.random() * 2) + 2 + bonusGymRat;
    } else {
      alteracaoOvr = Math.floor(Math.random() * 2) + 1 + (Math.random() < 0.5 ? 1 : 0);
    }
  } else if (idadeAtual <= 28) {
    if (potencial === 'GeracaoUnica') {
      if (ovrAtual >= 92) {
        alteracaoOvr = Math.random() < 0.35 ? 1 : 0;
      } else {
        alteracaoOvr = Math.floor(Math.random() * 2) + 1 + (confiancaCalculada >= 70 ? 1 : 0);
      }
    } else if (potencial === 'JogadorSolido') {
      if (ovrAtual >= 82) {
        alteracaoOvr = Math.random() < 0.30 ? 1 : 0;
      } else {
        alteracaoOvr = Math.random() < 0.65 ? 1 : 2;
      }
    } else {
      alteracaoOvr = ovrAtual >= 70 ? (Math.random() < 0.2 ? 1 : 0) : (Math.random() < 0.5 ? 1 : 0);
    }
  } else if (idadeAtual <= 31) {
    if (ovrAtual >= 90) {
      alteracaoOvr = Math.random() < 0.20 ? 1 : 0;
    } else {
      alteracaoOvr = Math.random() < 0.45 ? 1 : 0;
    }
  } else {
    alteracaoOvr = -Math.floor(Math.random() * 2) - 1;
  }

  alteracaoOvr -= perdaOvrLesao;

  const novoOvr = Math.min(99, Math.max(45, ovrAtual + alteracaoOvr));

  // 14. Eventos
  let eventoSorteado: TemplateEvento | undefined = undefined;
  if (idadeAtual < 36 && BANCO_DE_EVENTOS.length > 0 && Math.random() < 0.38) {
    const indexAleatorio = Math.floor(Math.random() * BANCO_DE_EVENTOS.length);
    eventoSorteado = BANCO_DE_EVENTOS[indexAleatorio];
  }

  return {
    novaTemporada,
    novoOvr,
    novaQuimica: quimicaCalculada,
    novaConfianca: confiancaCalculada,
    eventoSorteado,
    aposentado: false
  };
}