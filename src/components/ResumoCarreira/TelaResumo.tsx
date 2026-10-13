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
  
  const clubeAtualObj = BANCO_DE_CLUBES.find(c => c.nome === clubeAtual);
  const ligaAtual = clubeAtualObj ? clubeAtualObj.liga : 'NBB';

  const percepcaoMidiaAtual = ultimaTemporada?.noticiaImprensa?.percepcaoMercado || '📈 Promessa em Formação';

  const relatorioHof = faseSub === 'aposentado' ? calcularHallDaFama(historico, totais) : null;

  // Compilar todas as conquistas e premiações da carreira
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

            {/* DESTAQUE SELEÇÃO NACIONAL */}
            {temporadaDetalhada.torneioSelecao && (
              <div style={{ background: '#1c1917', border: `1px solid #f59e0b`, padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>🇧🇷 Convocação Internacional</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{temporadaDetalhada.torneioSelecao.nomeTorneio}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#34d399' }}>{temporadaDetalhada.torneioSelecao.posicaoFinal}</div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{temporadaDetalhada.torneioSelecao.ppgSelecao} PPG na Seleção</div>
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
                </div>
              </div>

              {temporadaDetalhada.playoffs && (
                <div style={{ background: CORES.bgInput, padding: '1rem', borderRadius: '10px', border: `1px solid #fbbf24` }}>
                  <h4 style={{ fontSize: '0.8rem', color: '#fbbf24', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>🏆 Playoffs</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <div>Campanha: <strong style={{ color: '#fbbf24' }}>{temporadaDetalhada.playoffs.resultadoCampanha}</strong></div>
                    <div>Jogos: <strong style={{ color: '#fff' }}>{temporadaDetalhada.playoffs.jogos}</strong></div>
                    <div>Pontos (PPG): <strong style={{ color: '#34d399' }}>{temporadaDetalhada.playoffs.ppg}</strong></div>
                    <div>Rebotes (RPG): <strong style={{ color: '#fff' }}>{temporadaDetalhada.playoffs.rpg}</strong></div>
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
                  {atleta.posicao} • 🌍 {atleta.nacionalidade}
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

            {/* BARRA DE QUÍMICA E CONFIANÇA */}
            <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: CORES.textoSecundario, textTransform: 'uppercase' }}>
                  🧪 Química do Elenco
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '900', color: quimica >= 70 ? '#34d399' : (quimica >= 40 ? '#fbbf24' : '#f87171') }}>
                  {quimica}%
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#0a0c0c', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${quimica}%`, height: '100%', background: quimica >= 70 ? '#34d399' : (quimica >= 40 ? '#fbbf24' : '#f87171'), transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: CORES.textoSecundario, textTransform: 'uppercase' }}>
                  📋 Confiança do Treinador
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '900', color: confianca >= 70 ? '#60a5fa' : (confianca >= 45 ? '#fbbf24' : '#f87171') }}>
                  {confianca}%
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#0a0c0c', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${confianca}%`, height: '100%', background: confianca >= 70 ? '#60a5fa' : (confianca >= 45 ? '#fbbf24' : '#f87171'), transition: 'width 0.4s ease' }} />
              </div>
            </div>

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

          {/* PAINEL HALL DA FAMA (FIM DE CARREIRA) */}
          {faseSub === 'aposentado' && relatorioHof && (
            <div style={{ background: CORES.bgCard, border: `2px solid #fbbf24`, borderRadius: '16px', padding: '1.25rem', textAlign: 'center', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase' }}>🏛️ Relatório de Hall da Fama</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff', margin: 0 }}>{relatorioHof.tierLegado}</h3>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>{relatorioHof.descricaoLegado}</div>
              <div style={{ background: CORES.bgInput, padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: CORES.destaque }}>
                Score de Legado: {relatorioHof.pontosLegado} PTS
              </div>
              <button onClick={onReset} style={{ background: '#fbbf24', color: '#070908', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', width: '100%' }}>
                Iniciar Nova Carreira 🚀
              </button>
            </div>
          )}

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

          {faseSub === 'transferencia' && (
            <div style={{ background: CORES.bgCard, border: `2px solid ${CORES.destaque}`, borderRadius: '16px', padding: '1.25rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '900', color: CORES.destaque, marginBottom: '0.25rem', textTransform: 'uppercase' }}>🔄 Janela de Transferências</h3>
              <p style={{ color: CORES.textoSecundario, fontSize: '0.78rem', marginBottom: '0.85rem' }}>Propostas de contrato para a próxima época:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {ofertasTransferencia.map((clubeNome, idx) => {
                  const ehAtual = clubeNome === clubeAtual;
                  const infoClube = BANCO_DE_CLUBES.find(c => c.nome === clubeNome);
                  const liga = infoClube ? infoClube.liga : 'Liga Geral';
                  const rep = infoClube ? infoClube.reputacao : 2;
                  const projecaoFuncao = determinarFuncaoElenco(idadeAtual, ovrAtual, confianca, rep);

                  return (
                    <button key={idx} onClick={() => onSelecionarClube(clubeNome)} style={{ background: ehAtual ? '#16261d' : CORES.bgInput, color: '#fff', border: `1px solid ${ehAtual ? CORES.destaque : CORES.borda}`, fontWeight: 'bold', padding: '0.75rem 0.85rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: '0.85rem' }}>🏀 {clubeNome}</span>
                        <span style={{ fontSize: '0.6rem', color: ehAtual ? CORES.destaque : CORES.textoSecundario, textTransform: 'uppercase', background: '#0a0c0c', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          {ehAtual ? 'Renovar' : 'Assinar'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.7rem' }}>
                        <span style={{ color: CORES.destaque, fontWeight: '800' }}>🏆 {liga}</span>
                        <span style={{ color: '#8fa89b' }}>• Projeção:</span>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{projecaoFuncao}</span>
                      </div>
                    </button>
                  );
                })}
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
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '10px', textAlign: 'center', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.6rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>JOGOS</span>
              <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '0.1rem 0 0 0' }}>🏀 {totais.jogosTotais}</p>
            </div>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '10px', textAlign: 'center', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.6rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>PONTOS</span>
              <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#34d399', margin: '0.1rem 0 0 0' }}>⚡ {totais.pontosTotais}</p>
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
                <button 
                  onClick={() => setModoExibicao('medias')}
                  style={{ background: modoExibicao === 'medias' ? CORES.destaque : 'transparent', color: modoExibicao === 'medias' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  MÉDIAS
                </button>
                <button 
                  onClick={() => setModoExibicao('totais')}
                  style={{ background: modoExibicao === 'totais' ? CORES.destaque : 'transparent', color: modoExibicao === 'totais' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  TOTAIS
                </button>
                <button 
                  onClick={() => setModoExibicao('imprensa')}
                  style={{ background: modoExibicao === 'imprensa' ? CORES.destaque : 'transparent', color: modoExibicao === 'imprensa' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📰 IMPRENSA
                </button>
                <button 
                  onClick={() => setModoExibicao('conquistas')}
                  style={{ background: modoExibicao === 'conquistas' ? CORES.destaque : 'transparent', color: modoExibicao === 'conquistas' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🏆 PRÊMIOS
                </button>
              </div>

              <button onClick={onReset} style={{ background: 'transparent', border: `1px solid ${CORES.borda}`, color: CORES.textoSecundario, padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', cursor: 'pointer' }}>Reiniciar 🔄</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '0.25rem' }}>
            {modoExibicao === 'imprensa' ? (
              historico.length > 0 ? (
                historico.map(temp => (
                  <div key={temp.idade} onClick={() => setTemporadaDetalhada(temp)} style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: CORES.destaque, fontWeight: '800', textTransform: 'uppercase' }}>
                        📌 {temp.noticiaImprensa?.veiculo || 'Imprensa Esportiva'} ({temp.idade} anos)
                      </span>
                      <span style={{ fontSize: '0.65rem', color: CORES.textoSecundario }}>
                        {temp.clube}
                      </span>
                    </div>
                    <p style={{ color: temp.noticiaImprensa?.tipo === 'crise' ? '#f87171' : (temp.noticiaImprensa?.tipo === 'sucesso' ? '#34d399' : '#fff'), fontSize: '0.82rem', fontWeight: '600', margin: 0, lineHeight: '1.3' }}>
                      {temp.noticiaImprensa?.manchete || 'Temporada encerrada.'}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: CORES.textoSecundario, fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>Nenhuma notícia publicada ainda.</p>
              )
            ) : modoExibicao === 'conquistas' ? (
              // ABA DE VITRINE DE CONQUISTAS
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.8rem', color: '#fbbf24', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>💍 Títulos e Prêmios Individuais</h4>
                  {todasPremiacoes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {todasPremiacoes.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#101313', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>{item.premio}</span>
                          <span style={{ color: CORES.textoSecundario, fontSize: '0.72rem' }}>{item.clube} • {item.ano} anos</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: CORES.textoSecundario, fontSize: '0.78rem', margin: 0 }}>Nenhum título ou prêmio conquistado ainda.</p>
                  )}
                </div>

                <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.8rem', color: '#f59e0b', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>🇧🇷 Conquistas pela Seleção Nacional</h4>
                  {todasSelecoes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {todasSelecoes.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#101313', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>{item.torneio}</span>
                          <span style={{ color: '#34d399', fontWeight: 'bold', fontSize: '0.75rem' }}>{item.posicao} ({item.ano}y)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: CORES.textoSecundario, fontSize: '0.78rem', margin: 0 }}>Nenhuma convocação ou medalha pela seleção ainda.</p>
                  )}
                </div>
              </div>
            ) : (
              idadesCarreira.map(idade => {
                const temporadaAno = historico.find(t => t.idade === idade);
                const jaPassou = temporadaAno !== undefined;
                const ehAtual = idade === idadeAtual && faseSub !== 'aposentado';

                const nomeClubeTemp = jaPassou ? temporadaAno.clube : (ehAtual ? clubeAtual : '');
                const objClubeTemp = BANCO_DE_CLUBES.find(c => c.nome === nomeClubeTemp);
                const ligaTemp = objClubeTemp ? objClubeTemp.liga : '';

                return (
                  <div 
                    key={idade} 
                    onClick={() => jaPassou && setTemporadaDetalhada(temporadaAno)}
                    style={{ 
                      background: ehAtual ? '#1c1f1f' : (jaPassou ? CORES.bgInput : '#0d0f0f'), 
                      border: `1px solid ${ehAtual ? CORES.destaque : CORES.borda}`, 
                      borderRadius: '8px', 
                      padding: '0.55rem 0.85rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      opacity: jaPassou || ehAtual ? 1 : 0.4,
                      flexShrink: 0,
                      cursor: jaPassou ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: '900', color: ehAtual || jaPassou ? CORES.destaque : CORES.textoSecundario, fontSize: '0.8rem', width: '38px' }}>
                        {idade}y
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: jaPassou ? '600' : 'normal' }}>
                          {jaPassou ? temporadaAno.clube : (ehAtual ? clubeAtual : '—')}
                        </span>
                        {(jaPassou || ehAtual) && ligaTemp && (
                          <span style={{ color: CORES.textoSecundario, fontSize: '0.62rem', fontWeight: 'bold' }}>
                            {ligaTemp}
                          </span>
                        )}
                      </div>
                      {jaPassou && temporadaAno.torneioSelecao && (
                        <span style={{ background: '#1c1917', color: '#f59e0b', border: '1px solid #f59e0b', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.58rem', fontWeight: 'bold' }}>
                          🇧🇷 Seleção
                        </span>
                      )}
                      {jaPassou && temporadaAno.status && (
                        <span style={{ background: '#16261d', color: '#34d399', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.58rem', fontWeight: 'bold' }}>
                          {temporadaAno.status}
                        </span>
                      )}
                    </div>

                    <div style={{ color: CORES.textoSecundario, fontSize: '0.72rem', display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                      {jaPassou ? (
                        <>
                          {modoExibicao === 'medias' ? (
                            <>
                              <span>Ovr: <strong style={{ color: '#60a5fa' }}>{temporadaAno.ovr}</strong></span>
                              <span>MPG: <strong style={{ color: '#60a5fa' }}>{temporadaAno.mpg}</strong></span>
                              <span>PPG: <strong style={{ color: '#34d399' }}>{temporadaAno.ppg}</strong></span>
                              <span>APG: <strong style={{ color: '#fff' }}>{temporadaAno.apg}</strong></span>
                              <span>RPG: <strong style={{ color: '#fff' }}>{temporadaAno.rpg}</strong></span>
                            </>
                          ) : (
                            <>
                              <span>JOGOS: <strong style={{ color: '#fff' }}>{temporadaAno.jogos}</strong></span>
                              <span>PTS: <strong style={{ color: '#34d399' }}>{temporadaAno.pontosTotais}</strong></span>
                            </>
                          )}
                          <span style={{ color: CORES.destaque, fontSize: '0.65rem', background: '#0a0c0c', padding: '0.15rem 0.35rem', borderRadius: '4px', border: `1px solid ${CORES.borda}` }}>🔍 Ver</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.68rem', fontStyle: 'italic' }}>{ehAtual ? 'Época atual' : '—'}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}