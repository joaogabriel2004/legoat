export interface TemplateEvento {
  titulo: string;
  descricao: string;
  opcao1Texto: string;
  opcao2Texto: string;
  efeitoOpcao1: (ovrAtual: number) => { novoOvr: number; mensagem: string; statusEspecial?: string };
  efeitoOpcao2: (ovrAtual: number) => { novoOvr: number; mensagem: string; statusEspecial?: string };
}

export const BANCO_DE_EVENTOS: TemplateEvento[] = [
  {
    titulo: "Proposta de Suplemento Experimental",
    descricao: "O departamento médico oferece um tratamento de recuperação avançada para potenciar o seu físico, mas há riscos de punição no antidoping.",
    opcao1Texto: "Consumir (+4 OVR, Risco de Suspensão)",
    opcao2Texto: "Recusar (Manter jogo limpo)",
    efeitoOpcao1: (ovr) => {
      const pegoNoDoping = Math.random() < 0.28;
      if (pegoNoDoping) {
        return { novoOvr: ovr, mensagem: "⚠️ Foste pego no antidoping e levaste uma suspensão de 1 época!", statusEspecial: "SUSP 🚫" };
      }
      return { novoOvr: Math.min(99, ovr + 4), mensagem: "⚡ O tratamento funcionou perfeitamente! OVR aumentou em +4." };
    },
    efeitoOpcao2: (ovr) => {
      return { novoOvr: ovr, mensagem: "Decidiste manter a integridade e recusaste o suplemento. Segues limpo." };
    }
  },
  {
    titulo: "Crise de Balneário e Ego",
    descricao: "O principal ala titular do clube está a reclamar que você está a acaparar demasiados arremessos. Como deseja lidar com a situação?",
    opcao1Texto: "Bater de frente e exigir protagonismo (-2 OVR por conflito)",
    opcao2Texto: "Focar no coletivo e dividir a bola (+1 OVR, Química alta)",
    efeitoOpcao1: (ovr) => {
      return { novoOvr: Math.max(50, ovr - 2), mensagem: "🔥 O ambiente azedou no balneário. A diretoria multou-te e o rendimento caiu temporariamente." };
    },
    efeitoOpcao2: (ovr) => {
      return { novoOvr: Math.min(99, ovr + 1), mensagem: "🤝 A liderança agregou o grupo! O time performou melhor e o seu jogo coletivo evoluiu." };
    }
  },
  {
    titulo: "Convite para Campanha Publicitária Global",
    descricao: "Uma grande marca de material desportivo quer patrocinar-te, mas exige treinos de marketing que reduzem o tempo de descanso.",
    opcao1Texto: "Aceitar Contrato (Ganho de Prestígio, -1 OVR por Cansaço)",
    opcao2Texto: "Recusar e Focar 100% nas Quadras (+1 OVR por Treino Extra)",
    efeitoOpcao1: (ovr) => {
      return { novoOvr: Math.max(50, ovr - 1), mensagem: "💰 Contrato publicitário assinado! Ficou rico de mídia, mas o cansaço reduziu o OVR levemente." };
    },
    efeitoOpcao2: (ovr) => {
      return { novoOvr: Math.min(99, ovr + 1), mensagem: "Treinou em dobro nos dias livres! OVR subiu +1 pela dedicação." };
    }
  },
  {
    titulo: "Proposta de Treinador Particular na Off-Season",
    descricao: "Um renomado treinador de arremessos da NBA oferece treinos intensivos durante as férias, mas o custo financeiro é elevado.",
    opcao1Texto: "Contratar o Treinador (+3 OVR)",
    opcao2Texto: "Poupar Dinheiro e Treinar Sozinho (Sem alteração)",
    efeitoOpcao1: (ovr) => {
      return { novoOvr: Math.min(99, ovr + 3), mensagem: "🎯 Os treinos de mecânica de arremesso foram cirúrgicos! Sua pontaria e OVR dispararam." };
    },
    efeitoOpcao2: (ovr) => {
      return { novoOvr: ovr, mensagem: "Treinou sozinho no ginásio local com intensidade normal." };
    }
  },
  {
    titulo: "Pressão da Adeptos e Imprensa",
    descricao: "Após uma sequência de maus resultados da equipa, a imprensa questiona se você tem nível para liderar o projeto.",
    opcao1Texto: "Responder com arrogância na entrevista (Risco de instabilidade)",
    opcao2Texto: "Manter a humildade e trabalhar em silêncio (+1 OVR)",
    efeitoOpcao1: (ovr) => {
      const deuRuim = Math.random() < 0.5;
      if (deuRuim) {
        return { novoOvr: Math.max(50, ovr - 1), mensagem: "🎙️ A declaração gerou um clima péssimo com a diretoria. OVR caiu ligeiramente." };
      }
      return { novoOvr: Math.min(99, ovr + 2),mensagem: "🔥 A declaração gerou enorme repercussão e motivou a equipa a vencer os próximos jogos!" };
    },
    efeitoOpcao2: (ovr) => {
      return { novoOvr: Math.min(99, ovr + 1), mensagem: "A postura profissional blindou o balneário e focou o grupo nos objetivos." };
    }
  }
];