import React, { useState } from 'react';
import { Atleta, TemporadaHistorico, EventoAleatorio, TotaisCarreira } from '@/src/types/basquete';


interface Props {
  atleta: Atleta;
  idadeAtual: number;
  clubeAtual: string;
  ovrAtual: number;
  valorMercado: number;
  historico: TemporadaHistorico[];
  totais: TotaisCarreira;
  faseSub: 'carreira' | 'evento' | 'transferencia' | 'aposentado';
  eventoAtivo: EventoAleatorio | null;
  ofertasTransferencia: string[];
  onAvancarTemporada: () => void;
  onSelecionarClube: (clube: string) => void;
  onReset: () => void;
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
  atleta, idadeAtual, clubeAtual, ovrAtual, valorMercado, historico, totais,
  faseSub, eventoAtivo, ofertasTransferencia, onAvancarTemporada, onSelecionarClube, onReset
}: Props) {
  const [modoExibicao, setModoExibicao] = useState<'medias' | 'totais'>('medias');
  const idadesCarreira = Array.from({ length: 24 }, (_, i) => 16 + i);

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>
      
      {/* GRID PRINCIPAL DE 2 COLUNAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* COLUNA ESQUERDA: PERFIL E AÇÕES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          
          {/* CARD DE PERFIL (Com Valor de Mercado) */}
          <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #ff8800 0%, #cc5500 100%)', color: '#070908', width: '75px', height: '85px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '900', boxShadow: '0 8px 16px rgba(255,136,0,0.2)' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>OVR</span>
                <span style={{ fontSize: '2.2rem', lineHeight: '1' }}>{ovrAtual}</span>
              </div>

              <div style={{ flex: 1, marginLeft: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.1' }}>
                    {atleta.nome || 'Atleta'} <span style={{ color: CORES.destaque }}>#{atleta.numero}</span>
                  </h2>
                  <span style={{ background: '#16261d', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    €{valorMercado}M
                  </span>
                </div>
                <p style={{ color: CORES.textoSecundario, fontSize: '0.8rem', margin: '0.4rem 0' }}>
                  {atleta.posicao} • 🌍 {atleta.nacionalidade} • Mão: {atleta.maoDominante}
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  📍 <span style={{ color: CORES.destaque }}>{clubeAtual}</span> <span style={{ color: CORES.textoSecundario, fontWeight: 'normal' }}>(Idade: {idadeAtual} anos)</span>
                </p>
              </div>
            </div>

            {faseSub === 'carreira' && (
              <button 
                onClick={onAvancarTemporada} 
                style={{ 
                  background: 'linear-gradient(to right, #ff8800, #f97316)', 
                  color: '#070908', 
                  fontWeight: '900', 
                  padding: '1.15rem', 
                  borderRadius: '12px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  boxShadow: '0 10px 25px -5px rgba(255, 136, 0, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                ⚡ SIMULAR ÉPOCA {idadeAtual}
              </button>
            )}
          </div>

          {/* PAINEL DE APOSENTADORIA */}
          {faseSub === 'aposentado' && (
            <div style={{ background: CORES.bgCard, border: `2px solid #fbbf24`, borderRadius: '16px', padding: '1.5rem', textAlign: 'center', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fbbf24', marginBottom: '0.5rem' }}>🏅 Fim de Carreira</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                O atleta pendurou as sapatilhas e encerrou a sua jornada profissional nas quadras. Obrigado por todas as recordações!
              </p>
              <button onClick={onReset} style={{ background: '#fbbf24', color: '#070908', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', width: '100%' }}>
                Iniciar Nova Carreira 🚀
              </button>
            </div>
          )}

          {/* PAINEL DE EVENTO */}
          {faseSub === 'evento' && eventoAtivo && (
            <div style={{ background: CORES.bgCard, border: `2px solid ${CORES.destaque}`, borderRadius: '16px', padding: '1.5rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: CORES.destaque, marginBottom: '0.25rem', textTransform: 'uppercase' }}>⚠️ {eventoAtivo.titulo}</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem' }}>{eventoAtivo.descricao}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={eventoAtivo.acaoOpcao1} style={{ background: CORES.destaque, color: '#070908', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left' }}>
                  {eventoAtivo.opcao1Texto}
                </button>
                <button onClick={eventoAtivo.acaoOpcao2} style={{ background: CORES.bgInput, color: '#fff', border: `1px solid ${CORES.borda}`, fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left' }}>
                  {eventoAtivo.opcao2Texto}
                </button>
              </div>
            </div>
          )}

          {/* PAINEL DE TRANSFERÊNCIAS */}
          {faseSub === 'transferencia' && (
            <div style={{ background: CORES.bgCard, border: `2px solid ${CORES.destaque}`, borderRadius: '16px', padding: '1.5rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: CORES.destaque, marginBottom: '0.25rem', textTransform: 'uppercase' }}>🔄 Janela de Transferências</h3>
              <p style={{ color: CORES.textoSecundario, fontSize: '0.8rem', marginBottom: '1rem' }}>Escolha o seu próximo destino ou renove com o clube atual</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {ofertasTransferencia.map((clube, idx) => {
                  const ehAtual = clube === clubeAtual;
                  return (
                    <button key={idx} onClick={() => onSelecionarClube(clube)} style={{ background: ehAtual ? '#16261d' : CORES.bgInput, color: '#fff', border: `1px solid ${ehAtual ? CORES.destaque : CORES.borda}`, fontWeight: 'bold', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem' }}>🏀 {clube}</span>
                      <span style={{ fontSize: '0.65rem', color: ehAtual ? CORES.destaque : CORES.textoSecundario, textTransform: 'uppercase' }}>{ehAtual ? 'Ficar (Renovar)' : 'Assinar'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ESTATÍSTICAS TOTAIS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', flexShrink: 0 }}>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '12px', textAlign: 'center', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.65rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>TÍTULOS / ANÉIS</span>
              <p style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fbbf24', margin: '0.2rem 0 0 0' }}>💍 {totais.titulos}</p>
            </div>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '12px', textAlign: 'center', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.65rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>PRÊMIOS MVP</span>
              <p style={{ fontSize: '1.6rem', fontWeight: '900', color: CORES.destaque, margin: '0.2rem 0 0 0' }}>🏆 {totais.mvps}</p>
            </div>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '12px', textAlign: 'center', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.65rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>JOGOS TOTAIS</span>
              <p style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '0.2rem 0 0 0' }}>🏀 {totais.jogosTotais}</p>
            </div>
            <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '12px', textAlign: 'center', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.65rem', color: CORES.textoSecundario, fontWeight: '800', textTransform: 'uppercase' }}>PONTOS TOTAIS</span>
              <p style={{ fontSize: '1.6rem', fontWeight: '900', color: '#34d399', margin: '0.2rem 0 0 0' }}>⚡ {totais.pontosTotais}</p>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: LINHA DO TEMPO */}
        <div style={{ background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: CORES.textoSecundario, margin: 0 }}>Linha do Tempo da Carreira</h3>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ background: CORES.bgInput, border: `1px solid ${CORES.borda}`, borderRadius: '6px', display: 'flex', padding: '2px' }}>
                <button 
                  onClick={() => setModoExibicao('medias')}
                  style={{ background: modoExibicao === 'medias' ? CORES.destaque : 'transparent', color: modoExibicao === 'medias' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  MÉDIAS
                </button>
                <button 
                  onClick={() => setModoExibicao('totais')}
                  style={{ background: modoExibicao === 'totais' ? CORES.destaque : 'transparent', color: modoExibicao === 'totais' ? '#070908' : CORES.textoSecundario, border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  TOTAIS
                </button>
              </div>

              <button onClick={onReset} style={{ background: 'transparent', border: `1px solid ${CORES.borda}`, color: CORES.textoSecundario, padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' }}>Reiniciar 🔄</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '0.25rem' }}>
            {idadesCarreira.map(idade => {
              const temporadaAno = historico.find(t => t.idade === idade);
              const jaPassou = temporadaAno !== undefined;
              const ehAtual = idade === idadeAtual && faseSub !== 'aposentado';

              return (
                <div 
                  key={idade} 
                  style={{ 
                    background: ehAtual ? '#1c1f1f' : (jaPassou ? CORES.bgInput : '#0d0f0f'), 
                    border: `1px solid ${ehAtual ? CORES.destaque : CORES.borda}`, 
                    borderRadius: '8px', 
                    padding: '0.6rem 1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    opacity: jaPassou || ehAtual ? 1 : 0.4,
                    flexShrink: 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '900', color: ehAtual || jaPassou ? CORES.destaque : CORES.textoSecundario, fontSize: '0.85rem', width: '50px' }}>
                      {idade} anos
                    </span>
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: jaPassou ? '600' : 'normal' }}>
                      {jaPassou ? temporadaAno.clube : (ehAtual ? clubeAtual : '—')}
                    </span>
                    {jaPassou && temporadaAno.status && (
                      <span style={{ background: '#16261d', color: '#34d399', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>
                        {temporadaAno.status}
                      </span>
                    )}
                  </div>

                  <div style={{ color: CORES.textoSecundario, fontSize: '0.75rem', display: 'flex', gap: '0.9rem' }}>
                    {jaPassou ? (
                      modoExibicao === 'medias' ? (
                        <>
                          <span>OVR: <strong style={{ color: '#fff' }}>{temporadaAno.ovr}</strong></span>
                          <span>PPG: <strong style={{ color: '#34d399' }}>{temporadaAno.ppg}</strong></span>
                          <span>RPG: <strong style={{ color: '#fff' }}>{temporadaAno.rpg}</strong></span>
                          <span>APG: <strong style={{ color: '#fff' }}>{temporadaAno.apg}</strong></span>
                        </>
                      ) : (
                        <>
                          <span>PTS: <strong style={{ color: '#34d399' }}>{temporadaAno.pontosTotais}</strong></span>
                          <span>REB: <strong style={{ color: '#fff' }}>{temporadaAno.rebotesTotais}</strong></span>
                          <span>AST: <strong style={{ color: '#fff' }}>{temporadaAno.assistenciasTotais}</strong></span>
                          <span>3PT: <strong style={{ color: '#fbbf24' }}>{temporadaAno.tpm}j</strong></span>
                          <span>TOV: <strong style={{ color: '#f87171' }}>{temporadaAno.tov}</strong></span>
                        </>
                      )
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>{ehAtual ? 'Época atual' : '—'}</span>
                    )}
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