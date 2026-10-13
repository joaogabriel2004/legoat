"use client";

import React, { useState } from 'react';
import { Atleta, TemporadaHistorico, EventoAleatorio, TotaisCarreira, FocoTreino } from '@/src/types/basquete';
import { simularTemporadaAtual, gerarOfertasTransferencia, calcularValorMercado, obterClubeInicial } from '@/src/utils/simulador';
import FormularioIdentidade from '@/src/components/CriacaoAtleta/FormularioIdentidade';
import SeletorNacionalidade from '@/src/components/CriacaoAtleta/SeletorNacionalidade';
import SeletorPosicao from '@/src/components/CriacaoAtleta/SeletorPosicao';
import TelaResumo from '@/src/components/ResumoCarreira/TelaResumo';

export default function Home() {
  const [fasePrincipal, setFasePrincipal] = useState<'criacao' | 'carreira'>('criacao');
  const [faseSub, setFaseSub] = useState<'carreira' | 'evento' | 'transferencia' | 'aposentado'>('carreira');

  const [atleta, setAtleta] = useState<Atleta>({
    nome: '', numero: '8', nacionalidade: 'Brasil', maoDominante: 'Destro', posicao: 'Armador (PG)', arquetipo: 'Pass-First Maestro 🧠', mentalidade: 'Fominha de Treino (Gym Rat)', focoTreinoAtual: 'equilibrado'
  });

  const [idadeAtual, setIdadeAtual] = useState(16);
  const [clubeAtual, setClubeAtual] = useState('');
  const [ovrAtual, setOvrAtual] = useState(60);
  const [quimica, setQuimica] = useState(45);
  const [confianca, setConfianca] = useState(60);
  const [historico, setHistorico] = useState<TemporadaHistorico[]>([]);
  
  const [totais, setTotais] = useState<TotaisCarreira>({
    titulos: 0, mvps: 0, dpoy: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0
  });

  const [eventoAtivo, setEventoAtivo] = useState<EventoAleatorio | null>(null);
  const [ofertasTransferencia, setOfertasTransferencia] = useState<string[]>([]);

  const handleAtualizarAtleta = (dados: Partial<Atleta>) => {
    setAtleta(prev => ({ ...prev, ...dados }));
  };

  const handleMudarFocoTreino = (novoFoco: FocoTreino) => {
    setAtleta(prev => ({ ...prev, focoTreinoAtual: novoFoco }));
  };

  const iniciarCarreira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atleta.nome.trim()) return;

    setIdadeAtual(16);
    setClubeAtual(obterClubeInicial());
    setOvrAtual(60);
    setQuimica(45);
    setConfianca(60);
    setHistorico([]);
    setTotais({ titulos: 0, mvps: 0, dpoy: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0 });
    setFasePrincipal('carreira');
    setFaseSub('carreira');
  };

  const avancarTemporada = () => {
    const ovrTemporadaAnterior = historico[0]?.ovr;
    
    const { novaTemporada, novoOvr, novaQuimica, novaConfianca, eventoSorteado, aposentado } = simularTemporadaAtual(
      atleta, idadeAtual, clubeAtual, ovrAtual, quimica, confianca, atleta.focoTreinoAtual, ovrTemporadaAnterior
    );

    if (aposentado) {
      setFaseSub('aposentado');
      alert("🛑 A carreira chegou ao fim! O atleta pendurou as sapatilhas.");
      return;
    }

    setHistorico(prev => [novaTemporada, ...prev]);
    setOvrAtual(novoOvr);
    setQuimica(novaQuimica);
    setConfianca(novaConfianca);

    setTotais(prev => ({
      titulos: prev.titulos + novaTemporada.titulos,
      mvps: prev.mvps + (novaTemporada.status?.includes('MVP') ? 1 : 0),
      dpoy: prev.dpoy + (novaTemporada.premiacoesIndividuais.includes('Defensor do Ano (DPOY) 🛡️') ? 1 : 0),
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
          const resultado = eventoSorteado.efeitoOpcao1(novoOvr, novaQuimica, novaConfianca);
          setOvrAtual(resultado.novoOvr);
          setQuimica(resultado.novaQuimica);
          setConfianca(resultado.novaConfianca);
          
          if (resultado.statusEspecial) {
            setHistorico(prev => [{ ...prev[0], status: resultado.statusEspecial }, ...prev.slice(1)]);
          }
          alert(resultado.mensagem);
          fecharEventoEAbrirTransferencias();
        },
        acaoOpcao2: () => {
          const resultado = eventoSorteado.efeitoOpcao2(novoOvr, novaQuimica, novaConfianca);
          setOvrAtual(resultado.novoOvr);
          setQuimica(resultado.novaQuimica);
          setConfianca(resultado.novaConfianca);
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
    const ofertas = gerarOfertasTransferencia(ovrAtual, clubeAtual);
    setOfertasTransferencia(ofertas);
    setFaseSub('transferencia');
  };

  const selecionarNovoClube = (novoClube: string) => {
    if (novoClube !== clubeAtual) {
      setQuimica(40);
      setConfianca(ovrAtual >= 80 ? 75 : 60);
    }
    setClubeAtual(novoClube);
    setFaseSub('carreira');
  };

  const resetForm = () => {
    setFasePrincipal('criacao');
    setFaseSub('carreira');
    setAtleta({ nome: '', numero: '8', nacionalidade: 'Brasil', maoDominante: 'Destro', posicao: 'Armador (PG)', arquetipo: 'Pass-First Maestro 🧠', mentalidade: 'Fominha de Treino (Gym Rat)', focoTreinoAtual: 'equilibrado' });
    setHistorico([]);
    setTotais({ titulos: 0, mvps: 0, dpoy: 0, jogosTotais: 0, pontosTotais: 0, assistenciasTotais: 0 });
  };

  const valorMercado = calcularValorMercado(ovrAtual, idadeAtual);

  return (
    <main style={{ height: '100vh', background: '#0a0c0c', color: '#fff', fontFamily: 'Helvetica Neue, sans-serif', display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden', boxSizing: 'border-box' }}>
      {fasePrincipal === 'criacao' ? (
        <form onSubmit={iniciarCarreira} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', minHeight: 0 }}>
          
          {/* GRID TRIPLO DE CRIAÇÃO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.3fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
            <FormularioIdentidade atleta={atleta} onChange={handleAtualizarAtleta} />
            <SeletorNacionalidade atleta={atleta} onChange={handleAtualizarAtleta} />
            <SeletorPosicao atleta={atleta} onChange={handleAtualizarAtleta} />
          </div>

          {/* BOTÃO PRINCIPAL DE INICIAR */}
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(to right, #ff8800, #f97316)', 
              color: '#070908', 
              fontWeight: '900', 
              padding: '1.1rem', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1rem', 
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 8px 20px -5px rgba(255, 136, 0, 0.4)',
              flexShrink: 0
            }}
          >
            🚀 INICIAR CARREIRA PROFISSIONAL
          </button>
        </form>
      ) : (
        <TelaResumo 
          atleta={atleta} 
          idadeAtual={idadeAtual}
          clubeAtual={clubeAtual}
          ovrAtual={ovrAtual}
          quimica={quimica}
          confianca={confianca}
          valorMercado={valorMercado}
          historico={historico} 
          totais={totais} 
          faseSub={faseSub}
          eventoAtivo={eventoAtivo}
          ofertasTransferencia={ofertasTransferencia}
          onAvancarTemporada={avancarTemporada}
          onSelecionarClube={selecionarNovoClube}
          onReset={resetForm}
          onMudarFocoTreino={handleMudarFocoTreino}
        />
      )}
    </main>
  );
}