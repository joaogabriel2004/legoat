import React, { useState } from 'react';
import { Atleta, TemporadaHistorico, EventoAleatorio, TotaisCarreira, FocoTreino } from '@/src/types/basquete';
import { BANCO_DE_CLUBES } from '@/src/data/clubes';
import { determinarFuncaoElenco, calcularHallDaFama } from '@/src/utils/simulador';

interface Props {
  atleta: Atleta;
  idadeAtual: number;
  clubeAtual: string;
  ovrAtual: number;
  quimica: number;
  confianca: number;
  valorMercado: number;
  historico: TemporadaHistorico[];
  totais: TotaisCarreira;
  faseSub: 'carreira' | 'evento' | 'transferencia' | 'aposentado';
  eventoAtivo: EventoAleatorio | null;
  ofertasTransferencia: string[];
  onAvancarTemporada: () => void;
  onSelecionarClube: (clube: string) => void;
  onReset: () => void;
  onMudarFocoTreino?: (foco: FocoTreino) => void;
}

const CORES = {
  bgGeral: '#0a0c0c',
  bgCard: '#101313',
  bgInput: '#161919',
  borda: '#222828',
  textoPrincipal: '#ffffff',
  textoSecundario: '#8fa89b',
  destaque: '#ff8800',
};

export default function TelaResumo({
  atleta, idadeAtual, clubeAtual, ovrAtual, quimica, confianca, valorMercado, historico, totais,
  faseSub, eventoAtivo, ofertasTransferencia, onAvancarTemporada, onSelecionarClube, onReset, onMudarFocoTreino
}: Props) {
  const [modoExibicao, setModoExibicao] = useState<'medias' | 'totais' | 'imprensa' | 'conquistas'>('medias');
  const [temporadaDetalhada, setTemporadaDetalhada] = useState<TemporadaHistorico | null>(null);
  const [focoTreinoSelecao, setFocoTreinoSelecao] = useState<FocoTreino>(atleta.focoTreinoAtual || 'equilibrado');

  const idadesCarreira = Array.from({ length: 24 }, (_, i) => 16 + i);

  const ultimaTemporada = historico[0];
  const funcaoAtual = ultimaTemporada ? ultimaTemporada.funcao : 'Promessa 🐣';
  const fadigaAtual = ultimaTemporada ? ultimaTemporada.nivelFadiga : 15;
  
  const clubeAtualObj = BANCO_DE_CLUBES.find(c => c.nome === clubeAtual);
  const ligaAtual = clubeAtualObj ? clubeAtualObj.liga : 'NBB';

  const relatorioHof = faseSub === 'aposentado' ? calcularHallDaFama(historico, totais) : null;

  const todasPremiacoes = historico.flatMap(h => h.premiacoesIndividuais.map(p => ({ ano: h.idade, clube: h.clube, premio: p })));
  const todasSelecoes = historico.filter(h => h.torneioSelecao).map(h => ({ ano: h.idade, torneio: h.torneioSelecao?.nomeTorneio, posicao: h.torneioSelecao?.posicaoFinal }));

  const handleTreinoChange = (novoFoco: FocoTreino) => {
    setFocoTreinoSelecao(novoFoco);
    if (onMudarFocoTreino) onMudarFocoTreino(novoFoco);
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0, position: 'relative' }}>
      
      {/* MODAL DE DETALHES DA ÉPOCA */}
      {temporadaDetalhada && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: CORES.bgCard, border: `2px solid ${CORES.destaque}`, borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: CORES.destaque, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Relatório Completo • {temporadaDetalhada.idade} anos
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0.2rem 0 0 0' }}>
                  {temporadaDetalhada.clube} <span style={{ color: CORES.textoSecundario, fontSize: '1rem' }}>({temporadaDetalhada.liga})</span>
                </h2>
              </div>
              <button onClick={() => setTemporadaDetalhada(null)} style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, color: '#fff', width: '32px', height: '32px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            {/* RIVALIDADE & CLÁSSICO */}
            {temporadaDetalhada.classicoRivalidade && (
              <div style={{ background: '#191724', border: '1px solid #c4a7e7', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#c4a7e7', fontWeight: 'bold', textTransform: 'uppercase' }}>🔥 Clássico da Época vs {temporadaDetalhada.classicoRivalidade.nomeRival}</span>
                  <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '0.2rem' }}>{temporadaDetalhada.classicoRivalidade.destaqueAtleta}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '900', color: temporadaDetalhada.classicoRivalidade.resultadoJogo.includes('Vitoria') ? '#34d399' : '#f87171' }}>
                  {temporadaDetalhada.classicoRivalidade.resultadoJogo}
                </div>
              </div>
            )}

            {/* TABELA REGULAR vs PLAYOFFS */}
            <div style={{ display: 'grid', gridTemplateColumns: temporadaDetalhada.playoffs ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              <div style={{ background: CORES.bgInput, padding: '1rem', borderRadius: '10px', border: `1px solid ${CORES.borda}` }}>
                <h4 style={{ fontSize: '0.8rem', color: CORES.destaque, margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>🏀 Época Regular</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div>Jogos: <strong style={{ color: '#fff' }}>{temporadaDetalhada.faseRegular.jogos}</strong></div>
                  <div>Pontos (PPG): <strong style={{ color: '#34d399' }}>{temporadaDetalhada.faseRegular.ppg}</strong></div>
                  <div>Rebotes (RPG): <strong style={{ color: '#fff' }}>{temporadaDetalhada.faseRegular.rpg}</strong></div>
                  <div>Assistências (APG): <strong style={{ color: '#fff' }}>{temporadaDetalhada.faseRegular.apg}</strong></div>
                  <div>Roubos de Bola (SPG): <strong style={{ color: '#60a5fa' }}>{temporadaDetalhada.faseRegular.spg}</strong></div>
                </div>
              </div>

              {temporadaDetalhada.playoffs && (
                <div style={{ background: CORES.bgInput, padding: '1rem', borderRadius: '10px', border: `1px solid #fbbf24` }}>
                  <h4 style={{ fontSize: '0.8rem', color: '#fbbf24', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>🏆 Playoffs</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <div>Campanha: <strong style={{ color: '#fbbf24' }}>{temporadaDetalhada.playoffs.resultadoCampanha}</strong></div>
                    <div>Jogos: <strong style={{ color: '#fff' }}>{temporadaDetalhada.playoffs.jogos}</strong></div>
                    <div>Pontos (PPG): <strong style={{ color: '#34d399' }}>{temporadaDetalhada.playoffs.ppg}</strong></div>
                    <div>Assistências (APG): <strong style={{ color: '#fff' }}>{temporadaDetalhada.playoffs.apg}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setTemporadaDetalhada(null)} style={{ background: CORES.destaque, color: '#070908', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* GRID PRINCIPAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', overflowY: 'auto' }}>
          
          {/* CARD DE PERFIL */}
          <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #ff8800 0%, #cc5500 100%)', color: '#070908', width: '75px', height: '85px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '900', boxShadow: '0 8px 16px rgba(255,136,0,0.2)' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>OVR</span>
                <span style={{ fontSize: '2.2rem', lineHeight: '1' }}>{ovrAtual}</span>
              </div>

              <div style={{ flex: 1, marginLeft: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.1' }}>
                    {atleta.nome || 'Atleta'} <span style={{ color: CORES.destaque }}>#{atleta.numero}</span>
                  </h2>
                  <span style={{ background: '#16261d', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    €{valorMercado}M
                  </span>
                </div>
                <p style={{ color: CORES.textoSecundario, fontSize: '0.8rem', margin: '0.3rem 0' }}>
                  {atleta.posicao} • {atleta.arquetipo || 'Maestro'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#1e293b', color: '#fbbf24', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {funcaoAtual}
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: '600' }}>
                    📍 {clubeAtual} <span style={{ color: CORES.destaque, fontSize: '0.75rem' }}>({ligaAtual})</span> • {idadeAtual}y
                  </span>
                </div>
              </div>
            </div>

            {/* BARRA DE CANSAÇO E FADIGA */}
            <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: CORES.textoSecundario, textTransform: 'uppercase' }}>
                  🔋 Nível de Cansaço / Fadiga
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: fadigaAtual >= 65 ? '#f87171' : '#34d399' }}>
                  {fadigaAtual}%
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#0a0c0c', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${fadigaAtual}%`, height: '100%', background: fadigaAtual >= 65 ? '#f87171' : '#34d399', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* SELETOR DE FOCO DE TREINO NA OFF-SEASON */}
            {faseSub === 'carreira' && (
              <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: CORES.textoSecundario, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  🎯 Foco de Treino da Próxima Época:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem' }}>
                  {[
                    { id: 'equilibrado', label: 'Geral ⚖️' },
                    { id: 'arremesso', label: 'Arremesso 🎯' },
                    { id: 'iq', label: 'Passe / QI 🧠' },
                    { id: 'fisico', label: 'Físico 🏋️' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => handleTreinoChange(f.id as FocoTreino)}
                      style={{
                        background: focoTreinoSelecao === f.id ? CORES.destaque : 'transparent',
                        color: focoTreinoSelecao === f.id ? '#070908' : '#cbd5e1',
                        border: `1px solid ${focoTreinoSelecao === f.id ? CORES.destaque : CORES.borda}`,
                        borderRadius: '6px',
                        padding: '0.3rem 0.2rem',
                        fontSize: '0.62rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {faseSub === 'carreira' && (
              <button 
                onClick={onAvancarTemporada} 
                style={{ 
                  background: 'linear-gradient(to right, #ff8800, #f97316)', 
                  color: '#070908', 
                  fontWeight: '900', 
                  padding: '1rem', 
                  borderRadius: '10px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.95rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  boxShadow: '0 8px 20px -5px rgba(255, 136, 0, 0.4)'
                }}
              >
                ⚡ SIMULAR ÉPOCA {idadeAtual}
              </button>
            )}
          </div>

          {/* PAINÉIS DE EVENTO E TRANSFERÊNCIA */}
          {faseSub === 'evento' && eventoAtivo && (
            <div style={{ background: CORES.bgCard, border: `2px solid ${CORES.destaque}`, borderRadius: '16px', padding: '1.25rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '900', color: CORES.destaque, marginBottom: '0.25rem', textTransform: 'uppercase' }}>⚠️ {eventoAtivo.titulo}</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '0.85rem' }}>{eventoAtivo.descricao}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={eventoAtivo.acaoOpcao1} style={{ background: CORES.destaque, color: '#070908', fontWeight: 'bold', padding: '0.7rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'left' }}>
                  {eventoAtivo.opcao1Texto}
                </button>
                <button onClick={eventoAtivo.acaoOpcao2} style={{ background: CORES.bgInput, color: '#fff', border: `1px solid ${CORES.borda}`, fontWeight: 'bold', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'left' }}>
                  {eventoAtivo.opcao2Texto}
                </button>
              </div>
            </div>
          )}

          {/* TOTAIS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '10px', textAlign: 'center', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.6rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>TÍTULOS</span>
              <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fbbf24', margin: '0.1rem 0 0 0' }}>💍 {totais.titulos}</p>
            </div>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '10px', textAlign: 'center', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.6rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>MVPs</span>
              <p style={{ fontSize: '1.4rem', fontWeight: '900', color: CORES.destaque, margin: '0.1rem 0 0 0' }}>🏆 {totais.mvps}</p>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA */}
        <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexShrink: 0 }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: CORES.textoSecundario, margin: 0 }}>
              {modoExibicao === 'imprensa' ? '📰 Feed de Notícias' : (modoExibicao === 'conquistas' ? '🏆 Vitrine de Conquistas' : 'Linha do Tempo da Carreira')}
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '6px', display: 'flex', padding: '2px' }}>
                <button onClick={() => setModoExibicao('medias')} style={{ background: modoExibicao === 'medias' ? CORES.destaque : 'transparent', color: modoExibicao === 'medias' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}>MÉDIAS</button>
                <button onClick={() => setModoExibicao('conquistas')} style={{ background: modoExibicao === 'conquistas' ? CORES.destaque : 'transparent', color: modoExibicao === 'conquistas' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}>🏆 PRÊMIOS</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '0.25rem' }}>
            {idadesCarreira.map(idade => {
              const temporadaAno = historico.find(t => t.idade === idade);
              const jaPassou = temporadaAno !== undefined;
              const ehAtual = idade === idadeAtual && faseSub !== 'aposentado';

              return (
                <div key={idade} onClick={() => jaPassou && setTemporadaDetalhada(temporadaAno)} style={{ background: ehAtual ? '#1c1f1f' : (jaPassou ? CORES.bgInput : '#0d0f0f'), border: `1px solid ${ehAtual ? CORES.destaque : CORES.borda}`, borderRadius: '8px', padding: '0.55rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: jaPassou || ehAtual ? 1 : 0.4, cursor: jaPassou ? 'pointer' : 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: '900', color: ehAtual || jaPassou ? CORES.destaque : CORES.textoSecundario, fontSize: '0.8rem', width: '38px' }}>{idade}y</span>
                    <span style={{ color: '#fff', fontSize: '0.8rem' }}>{jaPassou ? temporadaAno.clube : (ehAtual ? clubeAtual : '—')}</span>
                  </div>

                  <div style={{ color: CORES.textoSecundario, fontSize: '0.72rem', display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                    {jaPassou ? (
                      <>
                        <span>Ovr: <strong style={{ color: '#60a5fa' }}>{temporadaAno.ovr}</strong></span>
                        <span>PPG: <strong style={{ color: '#34d399' }}>{temporadaAno.ppg}</strong></span>
                        <span>APG: <strong style={{ color: '#fff' }}>{temporadaAno.apg}</strong></span>
                      </>
                    ) : <span style={{ fontSize: '0.68rem', fontStyle: 'italic' }}>{ehAtual ? 'Época atual' : '—'}</span>}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}