import { Atleta } from '@/src/types/basquete';
import { simularTemporadaAtual, calcularValorMercado, obterClubeInicial } from '@/src/utils/simulador';

export function rodarTestesDetalhado(numeroDeCarreiras: number = 3) {
  console.log(`===========================================================`);
  console.log(`🚀 INICIANDO AUDITORIA DETALHADA PARA ${numeroDeCarreiras} ATLETAS`);
  console.log(`===========================================================\n`);

  let totalAnosSimulados = 0;
  let somaOvrFinais = 0;
  let somaOvrPicos = 0;
  let somaPontosCarreira = 0;
  let totalTitulosCarreira = 0;
  let totalMvpsCarreira = 0;

  for (let i = 0; i < numeroDeCarreiras; i++) {
    const atleta: Atleta = {
      nome: `Atleta Prodígio #${i + 1}`,
      numero: `${Math.floor(Math.random() * 99) + 1}`,
      nacionalidade: 'Brasil',
      maoDominante: 'Destro',
      posicao: i % 2 === 0 ? 'Armador (PG)' : 'Pivô (C)',
      mentalidade: 'Fominha de Treino (Gym Rat)'
    };

    let idade = 16;
    let clube = obterClubeInicial();
    let ovr = 68;
    let quimica = 45;
    let confianca = 60;
    let ovrPico = ovr;
    let pontosCarreiraAtleta = 0;
    let titulosAtleta = 0;
    let mvpsAtleta = 0;
    let anosAtivos = 0;

    const historicoTemporadasAtleta: any[] = [];

    console.group(`🏀 CARREIRA DO ATLETA ${i + 1}: ${atleta.nome} (${atleta.posicao})`);

    while (idade < 39) {
      const resultado = simularTemporadaAtual(atleta, idade, clube, ovr, quimica, confianca);

      if (resultado.aposentado) {
        console.log(`🛑 APOSENTADO aos ${idade} anos (OVR Final: ${ovr})`);
        break;
      }

      anosAtivos++;
      totalAnosSimulados++;
      pontosCarreiraAtleta += resultado.novaTemporada.pontosTotais;
      
      if (resultado.novoOvr > ovrPico) ovrPico = resultado.novoOvr;
      if (resultado.novaTemporada.titulos > 0) titulosAtleta++;
      if (resultado.novaTemporada.status?.includes('MVP')) mvpsAtleta++;

      const valMercado = calcularValorMercado(ovr, idade);

      historicoTemporadasAtleta.push({
        Idade: `${idade}y`,
        Clube: clube,
        'OVR Pos-Ano': resultado.novoOvr,
        'Função (Role)': resultado.novaTemporada.funcao,
        'Conf. Técnico': `${resultado.novaConfianca}%`,
        'Química': `${resultado.novaQuimica}%`,
        'MPG': resultado.novaTemporada.mpg,
        'PPG': resultado.novaTemporada.ppg,
        'RPG': resultado.novaTemporada.rpg,
        'APG': resultado.novaTemporada.apg,
        'Clutch Score': resultado.novaTemporada.desempenhoClutch,
        'Jogos': resultado.novaTemporada.jogos,
        'PTS Totais': resultado.novaTemporada.pontosTotais,
        'Valor Merc.': `€${valMercado}M`,
        'Status': resultado.novaTemporada.status || 'Regular'
      });

      ovr = resultado.novoOvr;
      quimica = resultado.novaQuimica;
      confianca = resultado.novaConfianca;
      idade++;
    }

    console.table(historicoTemporadasAtleta);
    
    console.log(`📊 Totais do Atleta: ${pontosCarreiraAtleta} Pontos | ${titulosAtleta} Anéis 💍 | ${mvpsAtleta} MVPs 🏆 | OVR Pico: ${ovrPico}`);
    console.groupEnd();
    console.log(`\n-----------------------------------------------------------\n`);

    somaOvrFinais += ovr;
    somaOvrPicos += ovrPico;
    somaPontosCarreira += pontosCarreiraAtleta;
    totalTitulosCarreira += titulosAtleta;
    totalMvpsCarreira += mvpsAtleta;
  }

  const relatorioGeral = {
    AtletasSimulados: numeroDeCarreiras,
    MediaIdadeAposentadoria: (16 + (totalAnosSimulados / numeroDeCarreiras)).toFixed(1),
    MediaOvrPicoMaximo: (somaOvrPicos / numeroDeCarreiras).toFixed(1),
    MediaOvrFinalCarreira: (somaOvrFinais / numeroDeCarreiras).toFixed(1),
    MediaPontosCarreira: Math.round(somaPontosCarreira / numeroDeCarreiras),
    MediaTitulosPorCarreira: (totalTitulosCarreira / numeroDeCarreiras).toFixed(1),
    MediaMvpsPorCarreira: (totalMvpsCarreira / numeroDeCarreiras).toFixed(1),
  };

  console.log(`📈 RELATÓRIO DE BALANCEAMENTO GERAL (${numeroDeCarreiras} SIMULAÇÕES)`);
  console.table(relatorioGeral);

  return relatorioGeral;
}