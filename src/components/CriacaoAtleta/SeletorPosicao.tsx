import React from 'react';
import { Atleta } from '@/src/types/basquete';

interface Props {
  atleta: Atleta;
  onChange: (dados: Partial<Atleta>) => void;
}

const CORES = {
  bgCard: '#101313',
  bgInput: '#191d1d',
  borda: '#2e3737',
  textoPrincipal: '#ffffff',
  textoSecundario: '#8fa89b',
  destaque: '#ff8800',
  bgGeral: '#0a0c0c',
};

const POSICOES_BASQUETE = [
  { id: 'Armador (PG)', label: 'Armador (PG)' },
  { id: 'Ala-Armador (SG)', label: 'Ala-Armador (SG)' },
  { id: 'Ala (SF)', label: 'Ala (SF)' },
  { id: 'Ala-Pivô (PF)', label: 'Ala-Pivô (PF)' },
  { id: 'Pivô (C)', label: 'Pivô (C)' },
];

export default function SeletorPosicao({ atleta, onChange }: Props) {
  return (
    <div style={{
      background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '4px', padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '1rem'
    }}>
      <h2 style={{
        fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: CORES.textoSecundario, marginBottom: '0'
      }}>Posição em Quadra</h2>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {POSICOES_BASQUETE.map(pos => {
          const selecionada = atleta.posicao === pos.id;
          return (
            <div
              key={pos.id}
              onClick={() => onChange({ posicao: pos.id })}
              style={{
                width: '100%', background: selecionada ? '#161b1b' :CORES.bgInput, border: `1px solid ${selecionada ? CORES.destaque : CORES.borda}`,
                borderRadius: '4px', padding: '1.5rem 1.25rem', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.1s'
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: selecionada ? CORES.destaque : CORES.textoPrincipal }}>
                  {pos.label}
                </p>
              </div>
              {selecionada && <span style={{
                background: CORES.destaque, color: CORES.bgGeral, padding: '0.2rem 0.6rem',
                borderRadius: '4px', textTransform: 'uppercase', fontWeight: '900', fontSize: '0.6rem'
              }}>SELECIONADO</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}