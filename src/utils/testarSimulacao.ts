import { Atleta } from '@/src/types/basquete';
import { simularTemporadaAtual, CLUBES_NACIONAIS } from '@/src/utils/simulador';

export function rodarTestesDeBalanceamento() {
  const numeroDeCarreiras = 100;
  let totalAnosSimulados = 0;
  let somaOvrFinais = 0;
  let somaPontosCarreira = 0;
  let totalTitulosCarreira = 0;
  let totalMvpsCarreira = 0;

  const estatisticasPorIdade: { [idade: number]: { somatoriaPpg: number; contador: number } } = {};

  console.log(`🚀 Iniciando simulação de teste para ${numeroDeCarreiras} atletas...`);

  for (let i = 0; i < numeroDeCarreiras; i++) {
    // Criar atleta de teste
    let atleta: Atleta = {
      nome: `Atleta Teste ${i + 1}`,
      numero: '23',
      nacionalidade: 'Brasil',
      maoDominante: 'Destro',
      posicao: 'Armador (PG)',
      mentalidade: 'Fominha de Treino (Gym Rat)'
    };

    let idade = 19;
    let clube = CLUBES_NACIONAIS[0];
    let ovr = 68;
    let pontosCarreiraAtleta = 0;
    let titulosAtleta = 0;
    let mvpsAtleta = 0;
    let anosAtleta = 0;

    // Simula a carreira até aposentar ou atingir o limite
    while (idade < 39) {
      const resultado = simularTemporadaAtual(atleta, idade, clube, ovr);
      
      if (resultado.aposentado) {
        break;
      }

      anosAtleta++;
      totalAnosSimulados++;
      pontosCarreiraAtleta += resultado.novaTemporada.pontosTotais;
      if (resultado.novaTemporada.titulos > 0) titulosAtleta++;
      if (resultado.novaTemporada.status?.includes('MVP')) mvpsAtleta++;

      // Guardar média por idade para auditoria
      if (!estatisticasPorIdade[idade]) {
        estatisticasPorIdade[idade] = { somatoriaPpg: 0, contador: 0 };
      }
      estatisticasPorIdade[idade].somatoriaPpg += resultado.novaTemporada.ppg;
      estatisticasPorIdade[idade].contador++;

      ovr = resultado.novoOvr;
      idade++;
    }

    somaOvrFinais += ovr;
    somaPontosCarreira += pontosCarreiraAtleta;
    totalTitulosCarreira += titulosAtleta;
    totalMvpsCarreira += mvpsAtleta;
  }

  // Resultados consolidados
  const relatorio = {
    carreirasTestadas: numeroDeCarreiras,
    mediaOvrFinal: (somaOvrFinais / numeroDeCarreiras).toFixed(1),
    mediaPontosPorCarreira: Math.round(somaPontosCarreira / numeroDeCarreiras),
    mediaTitulosPorCarreira: (totalTitulosCarreira / numeroDeCarreiras).toFixed(1),
    mediaMvpsPorCarreira: (totalMvpsCarreira / numeroDeCarreiras).toFixed(1),
    mediaAnosAtivos: (totalAnosSimulados / numeroDeCarreiras).toFixed(1),
  };

  console.table(relatorio);
  console.log("📊 Médias de PPG por Idade nas simulações:");
  
  const mediasPorIdadeFormatadas: any = {};
  Object.keys(estatisticasPorIdade).forEach(idadeStr => {
    const id = Number(idadeStr);
    const dados = estatisticasPorIdade[id];
    mediasPorIdadeFormatadas[id] = {
      PPG_Medio: (dados.somatoriaPpg / dados.contador).toFixed(1)
    };
  });
  console.table(mediasPorIdadeFormatadas);

  return relatorio;
}