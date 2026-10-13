import { FuncaoElenco } from '@/src/types/basquete';

export interface ResultadoEvento {
  novoOvr: number;
  novaQuimica: number;
  novaConfianca: number;
  mensagem: string;
  statusEspecial?: string;
}

export interface TemplateEvento {
  titulo: string;
  descricao: string;
  opcao1Texto: string;
  opcao2Texto: string;
  efeitoOpcao1: (ovr: number, quimica: number, confianca: number) => ResultadoEvento;
  efeitoOpcao2: (ovr: number, quimica: number, confianca: number) => ResultadoEvento;
}

export const BANCO_DE_EVENTOS: TemplateEvento[] = [
  // ==========================================
  // 💉 SAÚDE, FÍSICO E TRATAMENTOS EXPERIMENTAIS
  // ==========================================
  {
    titulo: "Proposta de Suplemento Experimental",
    descricao: "O departamento médico oferece um tratamento de recuperação avançada para potenciar o seu físico, mas há riscos de punição no antidoping.",
    opcao1Texto: "Consumir (+4 OVR, Risco de Suspensão e Perda de Química)",
    opcao2Texto: "Recusar (Manter jogo limpo, +5% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => {
      const pegoNoDoping = Math.random() < 0.28;
      if (pegoNoDoping) {
        return { 
          novoOvr: ovr, 
          novaQuimica: Math.max(0, quimica - 25), 
          novaConfianca: Math.max(15, confianca - 30),
          mensagem: "⚠️ Pego no antidoping! Suspenso e a confiança da comissão caiu drasticamente.", 
          statusEspecial: "SUSP 🚫" 
        };
      }
      return { 
        novoOvr: Math.min(99, ovr + 4), 
        novaQuimica: quimica, 
        novaConfianca: confianca,
        mensagem: "⚡ O tratamento funcionou perfeitamente! OVR aumentou em +4." 
      };
    },
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: Math.min(100, quimica + 5),
      novaConfianca: confianca,
      mensagem: "Decidiste manter a integridade. O grupo respeitou a tua decisão."
    })
  },
  {
    titulo: "Cirurgia Preventiva na Off-Season",
    descricao: "Você sente dores crônicas no joelho. Os médicos sugerem uma cirurgia preventiva que pode resolver o problema ou tirar sua explosão física.",
    opcao1Texto: "Fazer a cirurgia (Risco de -4 OVR ou +3 OVR permanente)",
    opcao2Texto: "Jogar com dores e fazer fisioterapia leve (Estagnação)",
    efeitoOpcao1: (ovr, quimica, confianca) => {
      const deuErrado = Math.random() < 0.42;
      if (deuErrado) {
        return {
          novoOvr: Math.max(50, ovr - 4),
          novaQuimica: quimica,
          novaConfianca: Math.max(20, confianca - 10),
          mensagem: "🏥 A cirurgia teve complicações e você perdeu explosão física (-4 OVR).",
          statusEspecial: "Cirurgia Complicada 🩹"
        };
      }
      return {
        novoOvr: Math.min(99, ovr + 3),
        novaQuimica: quimica,
        novaConfianca: Math.min(100, confianca + 10),
        mensagem: "⚡ Cirurgia foi um sucesso total! As dores sumiram e você evoluiu +3 de OVR."
      };
    },
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: quimica,
      novaConfianca: confianca,
      mensagem: "Tratou com gelo. As dores continuam e seu rendimento ficou estagnado neste ano."
    })
  },

  // ==========================================
  // 🗣️ VESTIÁRIO, CONFLITOS E LIDERANÇA
  // ==========================================
  {
    titulo: "Crise de Balneário e Ego",
    descricao: "O principal ala titular do clube reclama que você está acaparando arremessos. Como deseja lidar com a situação?",
    opcao1Texto: "Bater de frente (-2 OVR, -20% Química)",
    opcao2Texto: "Focar no coletivo e passar a bola (+1 OVR, +15% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: Math.max(50, ovr - 2),
      novaQuimica: Math.max(0, quimica - 20),
      novaConfianca: Math.max(20, confianca - 15),
      mensagem: "🔥 O clima azedou no balneário! A química da equipa despencou."
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 1),
      novaQuimica: Math.min(100, quimica + 15),
      novaConfianca: Math.min(100, confianca + 10),
      mensagem: "🤝 Postura de líder! O balneário uniu-se e a química subiu consideravelmente."
    })
  },
  {
    titulo: "Discussão com o Treinador sobre Minutagem",
    descricao: "Achando que merecia ser titular absoluto, você questiona publicamente as rotações da comissão técnica.",
    opcao1Texto: "Exigir mais minutos publicamente (-25 Confiança, -10% Química)",
    opcao2Texto: "Trabalhar em silêncio nos treinos (+15 Confiança, +8% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: Math.max(0, quimica - 10),
      novaConfianca: Math.max(0, confianca - 25),
      mensagem: "🗣️ O treinador não gostou da cobrança e você perdeu espaço na rotação!"
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 1),
      novaQuimica: Math.min(100, quimica + 8),
      novaConfianca: Math.min(100, confianca + 15),
      mensagem: "🏋️ A comissão técnica valorizou o teu empenho e aumentou a tua rodagem no elenco."
    })
  },
  {
    titulo: "Churrasco de Confraternização do Elenco",
    descricao: "Os veteranos do time organizam um jantar de folga para unir o elenco antes dos playoffs.",
    opcao1Texto: "Comparecer e pagar a conta do grupo (+15% Química)",
    opcao2Texto: "Ficar em casa descansando sozinho (+1 OVR, -5% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: Math.min(100, quimica + 15),
      novaConfianca: confianca,
      mensagem: "🍖 Sucesso total! A resenha fortaleceu a união do vestiário."
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 1),
      novaQuimica: Math.max(0, quimica - 5),
      novaConfianca: confianca,
      mensagem: "Descansou o corpo, mas o grupo achou você distante da equipe."
    })
  },

  // ==========================================
  // 🔥 MOMENTOS DECISIVOS E JOGOS CLÁSSICOS
  // ==========================================
  {
    titulo: "Arremesso da Vitória em Clássico Decisivo",
    descricao: "Faltam 5 segundos no cronômetro do jogo mais importante do ano. O treinador desenha a jogada para você.",
    opcao1Texto: "Chamar a responsabilidade e arremessar (Teste de Clutch)",
    opcao2Texto: "Passar para o companheiro livre (+18% Química, +5 Confiança)",
    efeitoOpcao1: (ovr, quimica, confianca) => {
      const acertou = Math.random() < (ovr >= 75 ? 0.60 : 0.35);
      if (acertou) {
        return {
          novoOvr: Math.min(99, ovr + 1),
          novaQuimica: Math.min(100, quimica + 12),
          novaConfianca: Math.min(100, confianca + 20),
          mensagem: "🏀 CESTA NO ESTOURO DO CRONÔMETRO! Você virou o herói do clássico!",
          statusEspecial: "Clutch Hero 🔥"
        };
      }
      return {
        novoOvr: ovr,
        novaQuimica: Math.max(0, quimica - 5),
        novaConfianca: Math.max(0, confianca - 10),
        mensagem: "❌ Errou o arremesso decisivo... A imprensa e o técnico criticaram a escolha."
      };
    },
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: Math.min(100, quimica + 18),
      novaConfianca: Math.min(100, confianca + 5),
      mensagem: "🤝 A assistência gerou a cesta da vitória e o grupo celebrou a visão coletiva!"
    })
  },

  // ==========================================
  // 💵 NEGÓCIOS, AGENTES E EXTRA-CAMPO
  // ==========================================
  {
    titulo: "Dilema do Empresário Ganancioso",
    descricao: "Seu agente quer forçar uma transferência para um time rico de elite para ganhar comissão, mas onde você será apenas o 12º jogador do banco.",
    opcao1Texto: "Aceitar o contrato milionário (-25 Confiança, Risco de Flop)",
    opcao2Texto: "Demitir o agente e focar no desenvolvimento (+15 Confiança, +10% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: Math.max(50, ovr - 1),
      novaQuimica: Math.max(10, quimica - 20),
      novaConfianca: Math.max(15, confianca - 25),
      mensagem: "💰 Você garantiu o dinheiro, mas virou reserva esquecido no banco. Seu desenvolvimento estagnou!"
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 1),
      novaQuimica: Math.min(100, quimica + 10),
      novaConfianca: Math.min(100, confianca + 15),
      mensagem: "🧠 Priorizou o basquete! A comissão e a torcida admiraram sua maturidade."
    })
  },
  {
    titulo: "Festas e Desfoco na Vida Noturna",
    descricao: "Seu nome começou a aparecer com frequência em páginas de fofoca por noitadas na véspera de jogos.",
    opcao1Texto: "Ignorar as críticas e continuar saindo (-3 OVR, -30 Confiança)",
    opcao2Texto: "Contratar um personal trainer e se isolar (+2 OVR, +15 Confiança)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: Math.max(50, ovr - 3),
      novaQuimica: Math.max(10, quimica - 15),
      novaConfianca: Math.max(15, confianca - 30),
      mensagem: "📉 O ritmo de vida cobrou seu preço. Você perdeu condicionamento e a confiança do técnico."
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 2),
      novaQuimica: Math.min(100, quimica + 5),
      novaConfianca: Math.min(100, confianca + 15),
      mensagem: "💪 Foco total resgatado! Você voltou na sua melhor forma física."
    })
  },
  {
    titulo: "Treinador Particular na Off-Season",
    descricao: "Um renomado treinador de arremessos oferece treinos intensivos individuais durante as férias.",
    opcao1Texto: "Pagar o Treinador Particular (+3 OVR)",
    opcao2Texto: "Treinar com os companheiros da equipa (+1 OVR, +10% Química)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 3),
      novaQuimica: quimica,
      novaConfianca: confianca,
      mensagem: "🎯 Mecânica de arremesso aprimorada! Seu OVR subiu +3."
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 1),
      novaQuimica: Math.min(100, quimica + 10),
      novaConfianca: Math.min(100, confianca + 5),
      mensagem: "Treinou junto da equipa nas férias! Uniu o grupo e evoluiu."
    })
  },

  // ==========================================
  // 🇧🇷 SELEÇÃO NACIONAL E DESTAQUE INTERNACIONAL
  // ==========================================
  {
    titulo: "Convocação para a Seleção Nacional",
    descricao: "Você foi pré-convocado para representar o seu país em um torneio internacional de verão.",
    opcao1Texto: "Aceitar a convocação (+2 OVR, +15 Confiança)",
    opcao2Texto: "Pedir dispensa para descansar o corpo (+10% Química no clube)",
    efeitoOpcao1: (ovr, quimica, confianca) => ({
      novoOvr: Math.min(99, ovr + 2),
      novaQuimica: quimica,
      novaConfianca: Math.min(100, confianca + 15),
      mensagem: "🇧🇷 Ganhou experiência enfrentando os melhores do mundo com a camisa do país!",
      statusEspecial: "Seleção 🇧🇷"
    }),
    efeitoOpcao2: (ovr, quimica, confianca) => ({
      novoOvr: ovr,
      novaQuimica: Math.min(100, quimica + 10),
      novaConfianca: confianca,
      mensagem: "Ficou no clube fazendo a pré-temporada completa com seus companheiros."
    })
  }
];