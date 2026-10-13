import { Atleta, TemporadaHistorico, FuncaoElenco, NoticiaImprensa, EstatisticasFase, TorneioSelecao, RelatorioHallDaFama, FocoTreino, ClássicoRivalidade } from '@/src/types/basquete';
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

export function calcularIndiceEficiencia(ppg: number, rpg: number, apg: number, spg: number, tov: number): number {
  const per = ppg + (rpg * 1.2) + (apg * 1.4) + (spg * 2.0) - (tov * 1.2);
  return Number(per.toFixed(1));
}

export function calcularHallDaFama(historico: TemporadaHistorico[], totais: any): RelatorioHallDaFama {
  let pts = 0;
  
  pts += totais.titulos * 150;
  pts += totais.mvps * 250;
  pts += (totais.dpoy || 0) * 180;
  pts += Math.floor(totais.pontosTotais / 100);
  pts += Math.floor(totais.assistenciasTotais / 50);

  const maiorOvr = Math.max(...historico.map(h => h.ovr), 60);
  pts += (maiorOvr - 60) * 20;

  const medalhas = historico.filter(h => h.torneioSelecao?.posicaoFinal.includes('Ouro')).length;
  pts += medalhas * 180;

  let tierLegado: RelatorioHallDaFama['tierLegado'] = 'Promessa Incompleta 📉';
  let descricaoLegado = '';

  if (pts >= 2300) {
    tierLegado = 'Lenda Imortal (GOAT) 👑';
    descricaoLegado = 'Sua carreira redefiniu o basquetebol mundial. Colecionou MVP, prêmios defensivos e títulos lendários.';
  } else if (pts >= 1600) {
    tierLegado = 'Membro do Hall da Fama 🏛️';
    descricaoLegado = 'Presença garantida no Hall da Fama do Basquete. Dominou a sua era com excelência em ambas as pontas da quadra.';
  } else if (pts >= 950) {
    tierLegado = 'Ídolo de Franquia ⭐️';
    descricaoLegado = 'Um nome gravado na memória dos torcedores. Camisa aposentada e anos de protagonismo no topo.';
  } else if (pts >= 480) {
    tierLegado = 'Carreira Respeitada 📊';
    descricaoLegado = 'Um profissional exemplar que construiu uma trajetória sólida e longa pelas ligas mundiais.';
  } else {
    descricaoLegado = 'Sua carreira teve momentos de brilho, mas ficou marcada por desgaste físico ou inconstâncias.';
  }

  const titulosSelecao = historico
    .filter(h => h.torneioSelecao?.posicaoFinal.includes('Ouro'))
    .map(h => `${h.torneioSelecao?.nomeTorneio} (${h.idade}y)`);

  return { pontosLegado: pts, tierLegado, descricaoLegado, titulosSelecao };
}

export function simularTorneioSelecao(idade: number, ovr: number): TorneioSelecao | undefined {
  if (idade % 2 !== 0 || ovr < 74) return undefined;

  const eOlimpiadas = idade % 4 === 0;
  const nomeTorneio = eOlimpiadas ? 'Jogos Olímpicos 🥇' : 'Copa do Mundo FIBA 🏀';
  
  const rand = Math.random();
  let posicaoFinal = 'Quartos de Final';
  if (ovr >= 85 && rand < 0.40) posicaoFinal = 'Medalha de Ouro 🥇';
  else if (ovr >= 80 && rand < 0.60) posicaoFinal = 'Medalha de Prata 🥈';
  else if (rand < 0.40) posicaoFinal = 'Medalha de Bronze 🥉';

  const ppgSelecao = Number((12 + (ovr - 70) * 0.4 + (Math.random() * 4 - 2)).toFixed(1));

  return { nomeTorneio, posicaoFinal, ppgSelecao };
}

function simularClassicoRivalidade(ovr: number, clutch: number): ClássicoRivalidade {
  const rivaisLocais = ['Sesi Franca', 'Flamengo', 'Real Madrid', 'Boston Celtics', 'Maccabi Tel Aviv'];
  const rivalSorteado = rivaisLocais[Math.floor(Math.random() * rivaisLocais.length)];
  const venceu = Math.random() < (ovr >= 78 ? 0.60 : 0.40);

  let destaqueAtleta = 'Atuação discreta no clássico.';
  if (clutch >= 75 && venceu) destaqueAtleta = '🔥 Herói do Clássico! Cesta decisiva no estouro do cronômetro!';
  else if (venceu) destaqueAtleta = 'Dominou o jogo e garantiu a vitória rival!';
  else destaqueAtleta = 'Sofreu com a marcação pressão do rival.';

  return {
    nomeRival: rivalSorteado,
    resultadoJogo: venceu ? 'Vitoria 🏆' : 'Derrota ❌',
    destaqueAtleta
  };
}

function calcularPercepcaoMidia(ovr: number, ppg: number, status?: string): string {
  if (status?.includes('MVP')) return '👑 Estrela Suprema da Liga';
  if (status?.includes('DPOY')) return '🛡️ Âncora Defensiva do Ano';
  if (status?.includes('Campeão')) return '💍 Campeão Aclamado';
  if (ovr >= 86) return '⭐ Nível Superstar NBA/EuroLiga';
  if (ovr >= 78) return '🔥 Titular Consistente de Elite';
  if (ovr >= 70 && ppg >= 10) return '📈 Promessa em Ascensão';
  if (ovr <= 65 && ppg < 6) return '⚠️ Sob Risco de Descarte';
  return '📊 Peça de Rotação Padrão';
}

function gerarMancheteImprensa(
  nomeAtleta: string,
  ovr: number,
  status: string | undefined,
  clutch: number,
  mpg: number,
  ppg: number,
  funcao: FuncaoElenco
): NoticiaImprensa {
  const veiculos = ['BasketNews', 'Globo Esporte', 'ESPN Central', 'HoopCentral', 'DraftExpress'];
  const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
  const percepcaoMercado = calcularPercepcaoMidia(ovr, ppg, status);

  if (status?.includes('MVP')) {
    return { manchete: `👑 TEMPORADA LENDÁRIA! ${nomeAtleta} domina a liga e conquista o prêmio de MVP!`, veiculo, tipo: 'sucesso', percepcaoMercado };
  }
  if (status?.includes('DPOY')) {
    return { manchete: `🛡️ MURALHA DEFENSIVA! ${nomeAtleta} é eleito o Defensor do Ano (DPOY)!`, veiculo, tipo: 'sucesso', percepcaoMercado };
  }
  if (status?.includes('Campeão')) {
    return { manchete: `💍 ANEL NO DEDO! ${nomeAtleta} brilha nos playoffs e levanta a taça!`, veiculo, tipo: 'sucesso', percepcaoMercado };
  }
  if (clutch >= 75) {
    return { manchete: `🔥 SANGUE FRIO! Analistas destacam a capacidade decisiva de ${nomeAtleta} nos momentos finais.`, veiculo, tipo: 'sucesso', percepcaoMercado };
  }
  if (funcao === 'Reserva Aquece-Banco 🪑' || mpg < 10) {
    return { manchete: `📉 FORA DOS PLANOS? Sem minutos de quadra, futuro de ${nomeAtleta} vira incerteza.`, veiculo, tipo: 'crise', percepcaoMercado };
  }

  return { manchete: `📊 DESEMPENHO SÓLIDO: ${nomeAtleta} cumpre papel na rotação e mantém estabilidade.`, veiculo, tipo: 'neutro', percepcaoMercado };
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
  confiancaAtual: number,
  focoTreino: FocoTreino = 'equilibrado',
  ovrTemporadaAnterior?: number
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
      liga: '—',
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
      nivelFadiga: 0,
      pontosTotais: 0,
      rebotesTotais: 0,
      assistenciasTotais: 0,
      titulos: 0,
      status: 'Fim de Carreira 🏅',
      faseRegular: { jogos: 0, ppg: 0, rpg: 0, apg: 0, spg: 0, tpm: 0, tov: 0 },
      premiacoesIndividuais: []
    };
    return { novaTemporada: temporadaVazia, novoOvr: ovrAtual, novaQuimica: quimicaAtual, novaConfianca: confiancaAtual, aposentado: true };
  }

  let potencial = atleta.potencialSecreto || 'JogadorSolido';

  const clubeObjeto = BANCO_DE_CLUBES.find(c => c.nome === clubeAtual);
  const reputacaoClube = clubeObjeto ? clubeObjeto.reputacao : 2;
  const nomeLiga = clubeObjeto ? clubeObjeto.liga : "NBB";

  const fatorDificuldadeLiga = 0.70 + (reputacaoClube * 0.15);

  const funcao = determinarFuncaoElenco(idadeAtual, ovrAtual, confiancaAtual, reputacaoClube);

  let mpgBase = 10;
  if (funcao === 'Líder da Franquia 👑') mpgBase = 30 + (confiancaAtual / 100) * 5;
  else if (funcao === 'Sexto Homem ⚡') mpgBase = 21 + (confiancaAtual / 100) * 4;
  else if (funcao === 'Veterano / Mentor 👴') mpgBase = 14 + (confiancaAtual / 100) * 4;
  else if (funcao === 'Reserva Aquece-Banco 🪑') mpgBase = Math.max(3, 7 + (confiancaAtual / 100) * 3);
  else mpgBase = Math.max(6, 13 + (confiancaAtual / 100) * 4);

  const mpg = Number(Math.min(38, Math.max(3, mpgBase)).toFixed(1));

  // 🩸 SISTEMA DE CANSAÇO E FADIGA
  // Jogar muitos minutos acumulados sem treino físico aumenta a fadiga
  const fatorMinutosFadiga = mpg / 36;
  let reducaoFadigaTreino = focoTreino === 'fisico' ? 25 : 5;
  const nivelFadiga = Math.min(100, Math.max(0, Math.round((fatorMinutosFadiga * 45) + (idadeAtual > 31 ? 15 : 0) - reducaoFadigaTreino)));

  // Modificadores por Foco de Treino
  let bônusClutchTreino = focoTreino === 'arremesso' ? 5 : 0;
  let bônusQuimicaTreino = focoTreino === 'iq' ? 6 : 0;
  let reduçãoLesaoTreino = focoTreino === 'fisico' ? 0.05 : 0;

  let varQuimica = 5 + bônusQuimicaTreino;
  if (funcao === 'Veterano / Mentor 👴') varQuimica += 4;
  if (funcao === 'Reserva Aquece-Banco 🪑') varQuimica -= 6;
  const quimicaCalculada = Math.min(100, Math.max(10, quimicaAtual + varQuimica));
  const fatorQuimica = quimicaCalculada / 100;

  const desempenhoClutch = Math.min(100, Math.max(15, Math.round(((ovrAtual / fatorDificuldadeLiga) * 0.68) + (confiancaAtual * 0.20) + bônusClutchTreino + (Math.random() * 12))));

  const { jogosDisputados, chegouAosPlayoffs } = calcularJogosDaTemporada(nomeLiga, ovrAtual, false, quimicaCalculada);
  const ganhouTitulo = ovrAtual >= (66 + reputacaoClube * 2) && chegouAosPlayoffs && Math.random() < ((ovrAtual >= 80 ? 0.22 : 0.10) * (0.5 + fatorQuimica * 0.7));

  // Lesões com Impacto da Fadiga e Mitigação do Treino Físico
  let jogosEfetivos = jogosDisputados;
  const chanceLesaoGrave = Math.max(0.01, (0.04 + (nivelFadiga * 0.0008)) - reduçãoLesaoTreino);
  const sofreuLesaoGrave = Math.random() < chanceLesaoGrave;
  const sofreuLesaoComum = !sofreuLesaoGrave && Math.random() < (idadeAtual > 30 ? 0.18 : 0.08);

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

  const fatorMinutos = mpg / 36;
  const fatorRendimentoOvr = Math.max(0, (ovrAtual - 52) / 40);
  const rendimentoAjustadoLiga = fatorRendimentoOvr / (fatorDificuldadeLiga * 0.88);

  let ppgBase = (5 + (rendimentoAjustadoLiga * 22)) * fatorMinutos; 
  let rpgBase = (1.2 + (fatorRendimentoOvr * 6.0)) * fatorMinutos;
  let apgBase = (1.0 + (fatorRendimentoOvr * 6.0)) * fatorMinutos * (0.85 + fatorQuimica * 0.25);
  let spgBase = (0.3 + (fatorRendimentoOvr * 1.2)) * fatorMinutos;

  // 🎯 INFLUÊNCIA DOS ARQUÉTIPOS
  const arquetipo = atleta.arquetipo || 'Pass-First Maestro 🧠';
  if (arquetipo === 'Cestinha Slasher ⚡') { ppgBase *= 1.25; apgBase *= 0.8; }
  else if (arquetipo === 'Pass-First Maestro 🧠') { apgBase *= 1.35; ppgBase *= 0.85; }
  else if (arquetipo === '3&D Especialista 🎯') { ppgBase *= 1.1; spgBase *= 1.3; }
  else if (arquetipo === 'Protetor de Garrafão / Rim Protector 🛡️') { rpgBase *= 1.5; ppgBase *= 0.75; }

  if (focoTreino === 'arremesso') ppgBase *= 1.1;
  if (focoTreino === 'iq') apgBase *= 1.15;
  if (focoTreino === 'fisico') rpgBase *= 1.12;

  const ppg = Number(Math.max(0.8, ppgBase + (Math.random() * 1.8 - 0.9)).toFixed(1));
  const rpg = Number(Math.max(0.2, rpgBase + (Math.random() * 1.0 - 0.5)).toFixed(1));
  const apg = Number(Math.max(0.2, apgBase + (Math.random() * 1.2 - 0.6)).toFixed(1));
  const spg = Number(Math.max(0.1, spgBase + (Math.random() * 0.4 - 0.2)).toFixed(1));
  const tpm = Number((0.2 + (fatorRendimentoOvr * 1.8) * fatorMinutos).toFixed(1));
  const tov = Number((0.8 + (Math.random() * 1.0)).toFixed(1));

  // 🏆 SISTEMA DE PRÊMIOS EXPANDIDO (MVP, DPOY, 6MOY, MIP)
  const indiceEficiencia = calcularIndiceEficiencia(ppg, rpg, apg, spg, tov);
  const premiacoesIndividuais: string[] = [];

  // MVP
  const candidatoMvp = indiceEficiencia >= 22.0 && ovrAtual >= (76 + reputacaoClube * 1.5) && chegouAosPlayoffs && desempenhoClutch >= 68;
  const probabilidadeMvp = candidatoMvp ? Math.min(0.85, ((indiceEficiencia - 20) * 0.03) + (desempenhoClutch * 0.004)) : 0;
  const ganhouMvp = Math.random() < probabilidadeMvp;
  if (ganhouMvp) premiacoesIndividuais.push('MVP da Época 👑');

  // DPOY (Defensor do Ano) - Exige Roubos de Bola + Ressaltos altos
  const candidatoDpoy = (spg >= 1.6 || rpg >= 8.5) && ovrAtual >= 75 && Math.random() < 0.25;
  if (candidatoDpoy && !ganhouMvp) premiacoesIndividuais.push('Defensor do Ano (DPOY) 🛡️');

  // Sexto Homem do Ano (6MOY)
  if (funcao === 'Sexto Homem ⚡' && ppg >= 13.0 && Math.random() < 0.35) {
    premiacoesIndividuais.push('Sexto Homem do Ano (6MOY) ⚡');
  }

  // Most Improved Player (MIP)
  if (ovrTemporadaAnterior && (ovrAtual - ovrTemporadaAnterior >= 4)) {
    premiacoesIndividuais.push('Jogador Que Mais Evoluiu (MIP) 📈');
  }

  // Quinteto Ideal
  if (indiceEficiencia >= 17.5 && ovrAtual >= (70 + reputacaoClube * 1.5) && Math.random() < 0.40) {
    premiacoesIndividuais.push('Quinteto Ideal (All-League) ⭐');
  }

  if (ganhouTitulo) premiacoesIndividuais.push('Campeão da Liga 💍');

  // 🤝 RIVALIDADES / CLÁSSICO DA TEMPORADA
  const classicoRivalidade = simularClassicoRivalidade(ovrAtual, desempenhoClutch);

  const pontosTotais = Math.round(ppg * jogosEfetivos);
  const rebotesTotais = Math.round(rpg * jogosEfetivos);
  const assistenciasTotais = Math.round(apg * jogosEfetivos);

  let statusTemporada = statusLesao;
  if (!statusTemporada) {
    if (ganhouMvp) statusTemporada = 'MVP 👑';
    else if (premiacoesIndividuais.includes('Defensor do Ano (DPOY) 🛡️')) statusTemporada = 'DPOY 🛡️';
    else if (ganhouTitulo) statusTemporada = 'Campeão 💍';
    else if (chegouAosPlayoffs) statusTemporada = 'Playoffs 🏀';
  }

  const torneioSelecao = simularTorneioSelecao(idadeAtual, ovrAtual);

  const jogosRegulares = chegouAosPlayoffs ? Math.floor(jogosEfetivos * 0.75) : jogosEfetivos;
  const jogosPlayoffs = chegouAosPlayoffs ? Math.max(4, jogosEfetivos - jogosRegulares) : 0;

  const faseRegular: EstatisticasFase = { jogos: jogosRegulares, ppg, rpg, apg, spg, tpm, tov };
  let playoffsData: (EstatisticasFase & { resultadoCampanha: string }) | undefined = undefined;

  if (chegouAosPlayoffs) {
    const ppgPlayoffs = Number((ppg * (ganhouTitulo ? 1.15 : 0.95)).toFixed(1));
    let campanha = 'Eliminado na 1ª Ronda ❌';
    if (ganhouTitulo) campanha = 'Campeão do Torneio 💍';
    else if (desempenhoClutch >= 70) campanha = 'Vice-Campeão nas Finais 🥈';
    else if (desempenhoClutch >= 50) campanha = 'Eliminado nas Semifinais 🥉';

    playoffsData = {
      jogos: jogosPlayoffs,
      ppg: ppgPlayoffs,
      rpg: Number((rpg * 1.05).toFixed(1)),
      apg: Number((apg * 1.05).toFixed(1)),
      spg,
      tpm,
      tov,
      resultadoCampanha: campanha
    };
  }

  const noticiaImprensa = gerarMancheteImprensa(
    atleta.nome || 'O Atleta', ovrAtual, statusTemporada, desempenhoClutch, mpg, ppg, funcao
  );

  const novaTemporada: TemporadaHistorico = {
    idade: idadeAtual,
    clube: clubeAtual,
    liga: nomeLiga,
    ovr: ovrAtual,
    funcao,
    confiancaTreinador: confiancaAtual,
    mpg,
    jogos: jogosEfetivos,
    ppg,
    rpg,
    apg,
    spg,
    tpm,
    tov,
    desempenhoClutch,
    nivelFadiga,
    pontosTotais,
    rebotesTotais,
    assistenciasTotais,
    titulos: ganhouTitulo ? 1 : 0,
    status: statusTemporada,
    noticiaImprensa,
    faseRegular,
    playoffs: playoffsData,
    torneioSelecao,
    classicoRivalidade,
    premiacoesIndividuais
  };

  // EVOLUÇÃO DE OVR
  let alteracaoOvr = 0;
  const bonusGymRat = atleta.mentalidade === 'Fominha de Treino (Gym Rat)' ? 1 : 0;

  if (idadeAtual <= 21) {
    alteracaoOvr = potencial === 'GeracaoUnica' ? Math.floor(Math.random() * 2) + 2 + bonusGymRat : 1;
  } else if (idadeAtual <= 28) {
    alteracaoOvr = Math.random() < 0.60 ? 1 : 2;
  } else if (idadeAtual <= 31) {
    alteracaoOvr = Math.random() < 0.30 ? 1 : 0;
  } else {
    // Declínio do veterano acelerado por alta fadiga
    alteracaoOvr = -Math.floor(Math.random() * 2) - (nivelFadiga >= 70 ? 2 : 1);
  }

  alteracaoOvr -= perdaOvrLesao;
  const novoOvr = Math.min(99, Math.max(45, ovrAtual + alteracaoOvr));

  let eventoSorteado: TemplateEvento | undefined = undefined;
  if (idadeAtual < 36 && BANCO_DE_EVENTOS.length > 0 && Math.random() < 0.38) {
    const indexAleatorio = Math.floor(Math.random() * BANCO_DE_EVENTOS.length);
    eventoSorteado = BANCO_DE_EVENTOS[indexAleatorio];
  }

  return {
    novaTemporada,
    novoOvr,
    novaQuimica: quimicaCalculada,
    novaConfianca: confiancaAtual,
    eventoSorteado,
    aposentado: false
  };
}