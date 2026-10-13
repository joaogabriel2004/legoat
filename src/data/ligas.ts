export interface RegraLiga {
  nome: string;
  jogosTemporadaRegular: number;
  jogosMaximosPlayoffs: number;
  temPlayoffs: boolean;
}

export const REGRAS_LIGAS: Record<string, RegraLiga> = {
  "NBA": {
    nome: "NBA",
    jogosTemporadaRegular: 82,
    jogosMaximosPlayoffs: 28,
    temPlayoffs: true
  },
  "NBB": {
    nome: "NBB",
    jogosTemporadaRegular: 36,
    jogosMaximosPlayoffs: 15,
    temPlayoffs: true
  },
  "Liga ACB": {
    nome: "Liga ACB",
    jogosTemporadaRegular: 34,
    jogosMaximosPlayoffs: 13,
    temPlayoffs: true
  },
  "Greek Basket League": {
    nome: "Greek Basket League",
    jogosTemporadaRegular: 22,
    jogosMaximosPlayoffs: 10,
    temPlayoffs: true
  },
  "Basketbol Süper Ligi": {
    nome: "Basketbol Süper Ligi",
    jogosTemporadaRegular: 30,
    jogosMaximosPlayoffs: 13,
    temPlayoffs: true
  },
  "KLS": {
    nome: "KLS",
    jogosTemporadaRegular: 30,
    jogosMaximosPlayoffs: 10,
    temPlayoffs: true
  },
  "LKL": {
    nome: "LKL",
    jogosTemporadaRegular: 30,
    jogosMaximosPlayoffs: 12,
    temPlayoffs: true
  },
  "NBL": {
    nome: "NBL",
    jogosTemporadaRegular: 28,
    jogosMaximosPlayoffs: 9,
    temPlayoffs: true
  },
  "CBA": {
    nome: "CBA",
    jogosTemporadaRegular: 52,
    jogosMaximosPlayoffs: 17,
    temPlayoffs: true
  },
  "Liga Nacional": {
    nome: "Liga Nacional",
    jogosTemporadaRegular: 38,
    jogosMaximosPlayoffs: 15,
    temPlayoffs: true
  },
  "LNBP": {
    nome: "LNBP",
    jogosTemporadaRegular: 32,
    jogosMaximosPlayoffs: 12,
    temPlayoffs: true
  },
  "PBA": {
    nome: "PBA",
    jogosTemporadaRegular: 22,
    jogosMaximosPlayoffs: 11,
    temPlayoffs: true
  }
};

export function calcularJogosDaTemporada(
  nomeLiga: string,
  ovrAtual: number,
  ganhouTitulo: boolean,
  quimicaAtual: number = 50
): { jogosDisputados: number; chegouAosPlayoffs: boolean } {
  const regra = REGRAS_LIGAS[nomeLiga] || {
    nome: nomeLiga,
    jogosTemporadaRegular: 36,
    jogosMaximosPlayoffs: 12,
    temPlayoffs: true
  };

  let jogosBase = regra.jogosTemporadaRegular;

  if (ovrAtual < 68) {
    jogosBase = Math.floor(jogosBase * (0.35 + Math.random() * 0.3));
  } else {
    const jogosDescanso = regra.jogosTemporadaRegular === 82 ? Math.floor(Math.random() * 7) + 2 : (Math.random() > 0.75 ? 2 : 0);
    jogosBase = Math.max(12, jogosBase - jogosDescanso);
  }

  let jogosPlayoffs = 0;
  let chegouAosPlayoffs = false;

  if (regra.temPlayoffs && ovrAtual >= 70) {
    const fatorQuimica = quimicaAtual / 100;
    const chancePlayoffs = Math.min(0.92, ((ovrAtual - 65) * 0.03) * (0.7 + fatorQuimica * 0.6));
    chegouAosPlayoffs = Math.random() < chancePlayoffs;

    if (chegouAosPlayoffs) {
      if (ganhouTitulo) {
        jogosPlayoffs = Math.floor(regra.jogosMaximosPlayoffs * (0.85 + Math.random() * 0.15));
      } else {
        jogosPlayoffs = Math.floor(regra.jogosMaximosPlayoffs * (0.3 + Math.random() * 0.45));
      }
    }
  }

  return {
    jogosDisputados: jogosBase + jogosPlayoffs,
    chegouAosPlayoffs
  };
}