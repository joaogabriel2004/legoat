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
  bgGeralEscuro: '#070908',
};

const estilosComuns = {
  input: {
    width: '100%', background: CORES.bgInput, border: `1px solid ${CORES.borda}`,
    borderRadius: '4px', padding: '0.5rem', color: CORES.textoPrincipal,
    fontSize: '0.8rem', fontFamily: 'inherit', boxSizing: 'border-box' as const
  },
  label: {
    display: 'block', fontSize: '0.7rem', fontWeight: '600', color: CORES.textoSecundario,
    textTransform: 'uppercase' as const, letterSpacing: '0.02em', marginBottom: '0.4rem'
  },
  card: {
    background: CORES.bgCard, border: `1px solid ${CORES.borda}`, borderRadius: '4px', padding: '1.25rem'
  },
  tituloColuna: {
    fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: CORES.textoSecundario, marginBottom: '1.25rem'
  }
};

export default function FormularioIdentidade({ atleta, onChange }: Props) {
  return (
    <div style={{ ...estilosComuns.card, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={estilosComuns.tituloColuna}>Identidade</h2>

      <div style={{
        background: 'linear-gradient(180deg, #191d1d 0%, #0a0c0c 100%)',
        border: `1px solid ${CORES.borda}`, borderRadius: '8px', height: '160px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem'
      }}>
        <div style={{
          width: '80px', height: '100px', background: '#132219', border: `2px solid ${CORES.destaque}`,
          borderRadius: '10px 10px 5px 5px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(204, 255, 0, 0.1)'
        }}>
          <span style={{ fontSize: '8px', color: CORES.destaque, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
            ATLETA
          </span>
          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: CORES.textoPrincipal, lineHeight: '1', marginTop: '2px' }}>
            {atleta.numero || '8'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 3 }}>
          <label style={estilosComuns.label}>Nome / Apelido</label>
          <input
            type="text"
            value={atleta.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Ex: Gabriel Santos"
            required
            style={estilosComuns.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={estilosComuns.label}>Número</label>
          <input
            type="number"
            min="0" max="99"
            value={atleta.numero}
            onChange={(e) => onChange({ numero: e.target.value })}
            style={{ ...estilosComuns.input, textAlign: 'center' }}
          />
        </div>
      </div>

      <div>
        <label style={estilosComuns.label}>Mão Hábil / Arremesso</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Canhoto', 'Destro'].map(mao => (
            <button
              key={mao}
              type="button"
              onClick={() => onChange({ maoDominante: mao })}
              style={{
                flex: 1, padding: '0.6rem',
                background: atleta.maoDominante === mao ? CORES.destaque : CORES.bgInput,
                border: `1px solid ${atleta.maoDominante === mao ? CORES.destaque : CORES.borda}`,
                borderRadius: '4px',
                color: atleta.maoDominante === mao ? CORES.bgGeralEscuro : CORES.textoPrincipal,
                fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.1s', fontFamily: 'inherit'
              }}
            >
              {mao}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}