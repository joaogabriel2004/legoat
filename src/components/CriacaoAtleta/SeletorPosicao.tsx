import React from 'react';
import { Atleta, ArquetipoAtleta } from '@/src/types/basquete';

interface Props {
  atleta: Atleta;
  onChange: (dados: Partial<Atleta>) => void;
}

const ARQUETIPOS: { id: ArquetipoAtleta; nome: string; tag: string; desc: string; icone: string }[] = [
  { id: 'Pass-First Maestro 🧠', nome: 'Maestro do Passe', tag: '+APG / Visão', desc: 'Prioriza assistências e ritmo ofensivo da equipe.', icone: '🧠' },
  { id: 'Cestinha Slasher ⚡', nome: 'Cestinha Infiltrador', tag: '+PPG / Cestas', desc: 'Agressivo no ataque, pontuando no garrafão e no percurso.', icone: '⚡' },
  { id: '3&D Especialista 🎯', nome: '3&D Especialista', tag: '+3PM / Defesa', desc: 'Especialista em bola de 3 e marcação perimetral.', icone: '🎯' },
  { id: 'Protetor de Garrafão / Rim Protector 🛡️', nome: 'Protetor de Garrafão', tag: '+RPG / Toco', desc: 'Dominante no garrafão, rebotes e bloqueios defensivos.', icone: '🛡️' },
];

export default function SeletorPosicao({ atleta, onChange }: Props) {
  return (
    <div style={{
      background: '#101313',
      border: '1px solid #222828',
      borderRadius: '16px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: '900', color: '#ff8800', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
        2. Posição e Arquétipo
      </h3>

      {/* SELEÇÃO DE POSIÇÃO PRINCIPAL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#8fa89b', fontWeight: '800', textTransform: 'uppercase' }}>
          Posição em Quadra:
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            value={atleta.posicao} 
            onChange={e => onChange({ posicao: e.target.value })}
            style={{
              width: '100%',
              background: '#161919',
              border: '1px solid #222828',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 'bold',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Armador (PG)">🏀 Armador (PG)</option>
            <option value="Ala-Armador (SG)">🎯 Ala-Armador (SG)</option>
            <option value="Ala (SF)">⚡ Ala (SF)</option>
            <option value="Ala-Pivô (PF)">💪 Ala-Pivô (PF)</option>
            <option value="Pivô (C)">🛡️ Pivô (C)</option>
          </select>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8fa89b', fontSize: '0.75rem' }}>▼</span>
        </div>
      </div>

      {/* SELEÇÃO DE ARQUÉTIPOS EM CARDS MODERNOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: 0 }}>
        <label style={{ fontSize: '0.72rem', color: '#8fa89b', fontWeight: '800', textTransform: 'uppercase' }}>
          Estilo / Arquétipo de Jogo:
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', flex: 1 }}>
          {ARQUETIPOS.map(arq => {
            const selecionado = (atleta.arquetipo || 'Pass-First Maestro 🧠') === arq.id;
            return (
              <button
                key={arq.id}
                type="button"
                onClick={() => onChange({ arquetipo: arq.id })}
                style={{
                  background: selecionado 
                    ? 'linear-gradient(135deg, rgba(255,136,0,0.15) 0%, rgba(255,136,0,0.05) 100%)' 
                    : '#161919',
                  color: '#fff',
                  border: `1.5px solid ${selecionado ? '#ff8800' : '#222828'}`,
                  borderRadius: '10px',
                  padding: '0.85rem 0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: selecionado ? '0 4px 12px rgba(255,136,0,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: '1.1rem' }}>{arq.icone}</span>
                  <span style={{ fontSize: '0.58rem', fontWeight: '900', color: selecionado ? '#ff8800' : '#8fa89b', background: '#0a0c0c', padding: '0.15rem 0.4rem', borderRadius: '4px', border: `1px solid ${selecionado ? 'rgba(255,136,0,0.3)' : '#222828'}` }}>
                    {arq.tag}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: selecionado ? '#ff8800' : '#fff' }}>
                    {arq.nome}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8fa89b', lineHeight: '1.2', marginTop: '0.2rem' }}>
                    {arq.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}