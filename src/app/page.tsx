"use client";

import React, { useState } from 'react';
import { Atleta, TemporadaHistorico, EventoAleatorio, TotaisCarreira } from '@/src/types/basquete';
import { simularTemporadaAtual, gerarOfertasTransferencia, calcularValorMercado, CLUBES_NACIONAIS } from '@/src/utils/simulador';
import FormularioIdentidade from '@/src/components/CriacaoAtleta/FormularioIdentidade';
import SeletorNacionalidade from '@/src/components/CriacaoAtleta/SeletorNacionalidade';
import SeletorPosicao from '@/src/components/CriacaoAtleta/SeletorPosicao';
import TelaResumo from '@/src/components/ResumoCarreira/TelaResumo';

import { rodarTestesDeBalanceamento } from '@/src/utils/testarSimulacao';

const CORES = {
  bgGeral: '#0a0c0c',
  destaque: '#ff8800',
  bgGeralEscuro: '#070908',
};

export default function Home() {
  const [fasePrincipal, setFasePrincipal] = useState<'criacao' | 'carreira'>('criacao');
  const [faseSub, setFaseSub] = useState<'carreira' | 'evento' | 'transferencia' | 'aposentado'>('carreira');

  const [atleta, setAtleta] = useState<Atleta>({
    nome: '', numero: '8', nacionalidade: 'Brasil', maoDominante: 'Destro', posicao: 'Armador (PG)', mentalidade: 'Fominha de Treino (Gym Rat)'
  });

  const [idadeAtual, setIdadeAtual] = useState(16);
  const [clubeAtual, setClubeAtual] = useState('');
  const [ovrAtual, setOvrAtual] = useState(68);
  const [historico, setHistorico] = useState<TemporadaHistorico[]>([]);
  
  const [totais, setTotais] = useState<TotaisCarreira>({
    titulos: 0, mvps: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0
  });

  const [eventoAtivo, setEventoAtivo] = useState<EventoAleatorio | null>(null);
  const [ofertasTransferencia, setOfertasTransferencia] = useState<string[]>([]);

  const handleAtualizarAtleta = (dados: Partial<Atleta>) => {
    setAtleta(prev => ({ ...prev, ...dados }));
  };

  const iniciarCarreira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atleta.nome.trim()) return;

    setIdadeAtual(16);
    setClubeAtual(CLUBES_NACIONAIS[Math.floor(Math.random() * CLUBES_NACIONAIS.length)]);
    setOvrAtual(68);
    setHistorico([]);
    setTotais({ titulos: 0, mvps: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0 });
    setFasePrincipal('carreira');
    setFaseSub('carreira');
  };

  const avancarTemporada = () => {
    const { novaTemporada, novoOvr, eventoSorteado, aposentado } = simularTemporadaAtual(atleta, idadeAtual, clubeAtual, ovrAtual);

    if (aposentado) {
      setFaseSub('aposentado');
      alert("🛑 A carreira chegou ao fim! O atleta pendurou as sapatilhas.");
      return;
    }

    setHistorico(prev => [novaTemporada, ...prev]);
    setOvrAtual(novoOvr);

    setTotais(prev => ({
      titulos: prev.titulos + novaTemporada.titulos,
      mvps: prev.mvps + (novaTemporada.status?.includes('MVP') ? 1 : 0),
      jogosTotais: prev.jogosTotais + novaTemporada.jogos,
      pontosTotais: prev.pontosTotais + novaTemporada.pontosTotais,
      assistenciasTotais: prev.assistenciasTotais + novaTemporada.assistenciasTotais
    }));

    if (eventoSorteado) {
      setEventoAtivo({
        titulo: eventoSorteado.titulo,
        descricao: eventoSorteado.descricao,
        opcao1Texto: eventoSorteado.opcao1Texto,
        opcao2Texto: eventoSorteado.opcao2Texto,
        acaoOpcao1: () => {
          const resultado = eventoSorteado.efeitoOpcao1(ovrAtual);
          setOvrAtual(resultado.novoOvr);
          
          if (resultado.statusEspecial) {
            setHistorico(prev => [{ ...prev[0], status: resultado.statusEspecial }, ...prev.slice(1)]);
          }
          alert(resultado.mensagem);
          fecharEventoEAbrirTransferencias();
        },
        acaoOpcao2: () => {
          const resultado = eventoSorteado.efeitoOpcao2(ovrAtual);
          setOvrAtual(resultado.novoOvr);
          alert(resultado.mensagem);
          fecharEventoEAbrirTransferencias();
        }
      });
      setFaseSub('evento');
    } else {
      abrirJanelaTransferencias();
    }
  };

  const fecharEventoEAbrirTransferencias = () => {
    setEventoAtivo(null);
    abrirJanelaTransferencias();
  };

  const abrirJanelaTransferencias = () => {
    setIdadeAtual(prev => prev + 1);
    // Usa o novo sistema de propostas inteligente baseado no OVR atual
    const ofertas = gerarOfertasTransferencia(ovrAtual, clubeAtual);
    setOfertasTransferencia(ofertas);
    setFaseSub('transferencia');
  };

  const selecionarNovoClube = (novoClube: string) => {
    setClubeAtual(novoClube);
    setFaseSub('carreira');
  };

  const resetForm = () => {
    setFasePrincipal('criacao');
    setFaseSub('carreira');
    setAtleta({ nome: '', numero: '8', nacionalidade: 'Brasil', maoDominante: 'Destro', posicao: 'Armador (PG)', mentalidade: 'Fominha de Treino (Gym Rat)' });
    setHistorico([]);
    setTotais({ titulos: 0, mvps: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0 });
  };

  // Valor de mercado dinâmico para exibir na tela
  const valorMercado = calcularValorMercado(ovrAtual, idadeAtual);

  return (
    <main style={{
      height: '100vh', background: CORES.bgGeral, color: '#fff',
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', display: 'flex',
      flexDirection: 'column', padding: '1.5rem', overflow: 'hidden', boxSizing: 'border-box'
    }}>
      
      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; background: #101313; }
        ::-webkit-scrollbar-thumb { background: #2e3737; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff8800; }
      `}</style>

      {fasePrincipal === 'criacao' ? (
        <form onSubmit={iniciarCarreira} style={{
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', minHeight: 0
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
            <FormularioIdentidade atleta={atleta} onChange={handleAtualizarAtleta} />
            <SeletorNacionalidade atleta={atleta} onChange={handleAtualizarAtleta} />
            <SeletorPosicao atleta={atleta} onChange={handleAtualizarAtleta} />
          </div>

          <button type="submit" style={{
            width: '100%', background: CORES.destaque, color: CORES.bgGeralEscuro,
            fontWeight: '900', padding: '1.15rem', borderRadius: '4px', border: 'none',
            cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase',
            letterSpacing: '0.05em', fontFamily: 'inherit', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}>
            Iniciar Carreira 🚀
          </button>
        </form>
      ) : (
        <TelaResumo 
          atleta={atleta} 
          idadeAtual={idadeAtual}
          clubeAtual={clubeAtual}
          ovrAtual={ovrAtual}
          valorMercado={valorMercado}
          historico={historico} 
          totais={totais} 
          faseSub={faseSub}
          eventoAtivo={eventoAtivo}
          ofertasTransferencia={ofertasTransferencia}
          onAvancarTemporada={avancarTemporada}
          onSelecionarClube={selecionarNovoClube}
          onReset={resetForm} 
        />
      )}

      <button onClick={() => rodarTestesDeBalanceamento()} style={{ background: '#34d399', color: '#000', padding: '10px' }}>
        🧪 Executar Teste de Simulação (Console)
      </button>

    </main>
  );
}