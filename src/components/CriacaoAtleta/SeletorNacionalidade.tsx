import React, { useState } from 'react';
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
};

const PAISES = [
  // Américas
  { nome: 'Brasil', flag: '🇧🇷' },
  { nome: 'Estados Unidos', flag: '🇺🇸' },
  { nome: 'Argentina', flag: '🇦🇷' },
  { nome: 'Canadá', flag: '🇨🇦' },
  { nome: 'República Dominicana', flag: '🇩🇴' },
  { nome: 'Porto Rico', flag: '🇵🇷' },
  { nome: 'México', flag: '🇲🇽' },
  { nome: 'Uruguai', flag: '🇺🇾' },
  { nome: 'Venezuela', flag: '🇻🇪' },
  { nome: 'Colômbia', flag: '🇨🇴' },
  
  // Europa
  { nome: 'Espanha', flag: '🇪🇸' },
  { nome: 'França', flag: '🇫🇷' },
  { nome: 'Sérvia', flag: '🇷🇸' },
  { nome: 'Itália', flag: '🇮🇹' },
  { nome: 'Eslovênia', flag: '🇸🇮' },
  { nome: 'Grécia', flag: '🇬🇷' },
  { nome: 'Lituânia', flag: '🇱🇹' },
  { nome: 'Alemanha', flag: '🇩🇪' },
  { nome: 'Croácia', flag: '🇭🇷' },
  { nome: 'Turquia', flag: '🇹🇷' },
  { nome: 'Letônia', flag: '🇱🇻' },
  { nome: 'Montenegro', flag: '🇲🇪' },
  { nome: 'Reino Unido', flag: '🇬🇧' },
  { nome: 'Rússia', flag: '🇷🇺' },
  { nome: 'Ucrânia', flag: '🇺🇦' },
  { nome: 'Polônia', flag: '🇵🇱' },
  { nome: 'Finlândia', flag: '🇫🇮' },
  { nome: 'Geórgia', flag: '🇬🇪' },
  { nome: 'República Tcheca', flag: '🇨🇿' },
  { nome: 'Bósnia e Herzegovina', flag: '🇧🇦' },
  { nome: 'Suécia', flag: '🇸🇪' },

  // Oceania e Ásia
  { nome: 'Austrália', flag: '🇦🇺' },
  { nome: 'Nova Zelândia', flag: '🇳🇿' },
  { nome: 'China', flag: '🇨🇳' },
  { nome: 'Japão', flag: '🇯🇵' },
  { nome: 'Filipinas', flag: '🇵🇭' },
  { nome: 'Coreia do Sul', flag: '🇰🇷' },
  { nome: 'Líbano', flag: '🇱🇧' },
  { nome: 'Irã', flag: '🇮🇷' },

  // África
  { nome: 'Nigéria', flag: '🇳🇬' },
  { nome: 'Senegal', flag: '🇸🇳' },
  { nome: 'Angola', flag: '🇦🇴' },
  { nome: 'Sudão do Sul', flag: '🇸🇸' },
  { nome: 'Egito', flag: '🇪🇬' },
  { nome: 'Camarões', flag: '🇨🇲' },
];

export default function SeletorNacionalidade({ atleta, onChange }: Props) {
  const [busca, setBusca] = useState('');

  const paisesFiltrados = PAISES.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{
      background: CORES.bgCard,
      border: `1px solid ${CORES.borda}`,
      borderRadius: '4px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100%',
      maxHeight: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: CORES.textoSecundario, margin: 0
      }}>Nacionalidade</h2>
      
      <input 
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="🔍 Buscar país..."
        style={{
          width: '100%', background: CORES.bgInput, border: `1px solid ${CORES.borda}`,
          borderRadius: '4px', padding: '0.6rem', color: CORES.textoPrincipal,
          fontSize: '0.8rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
          flexShrink: 0
        }}
      />

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        border: `1px solid ${CORES.borda}`,
        borderRadius: '4px',
        background: CORES.bgInput
      }}>
        {paisesFiltrados.map(p => {
          const selecionado = atleta.nacionalidade === p.nome;
          return (
            <div
              key={p.nome}
              onClick={() => onChange({ nacionalidade: p.nome })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0.75rem', cursor: 'pointer',
                background: selecionado ? '#161b1b' : 'transparent',
                borderLeft: `3px solid ${selecionado ? CORES.destaque : 'transparent'}`,
                fontSize: '0.85rem',
                flexShrink: 0
              }}
            >
              <span style={{ color: selecionado ? CORES.destaque : CORES.textoPrincipal }}>
                {p.flag} {p.nome}
              </span>
              {selecionado && <span style={{color: CORES.destaque, fontSize: '1rem', fontWeight: 'bold'}}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}