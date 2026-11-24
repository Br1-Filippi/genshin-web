import { useCallback, useEffect, useState } from 'react';
import { fetchCharacters } from './api';
import { Catalog } from './components/Catalog';
import { CharacterModal } from './components/CharacterModal';
import { GachaBanner } from './components/GachaBanner';
import type { RandomFn } from './gacha';
import type { Character } from './types';

type Tab = 'gacha' | 'catalogo';

const TABS: { id: Tab; label: string }[] = [
  { id: 'gacha', label: 'Gacha' },
  { id: 'catalogo', label: 'Catálogo' },
];

interface AppProps {
  random?: RandomFn;
}

export function App({ random }: Readonly<AppProps>) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('gacha');
  const [selected, setSelected] = useState<Character | null>(null);

  const load = useCallback(() => {
    setStatus('loading');
    fetchCharacters('es')
      .then((data) => {
        setCharacters(data);
        setStatus('ready');
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : String(reason));
        setStatus('error');
      });
  }, []);

  useEffect(load, [load]);

  const closeModal = useCallback(() => setSelected(null), []);

  const renderContent = () => {
    if (status === 'loading') return <p className="status">Cargando personajes…</p>;
    if (status === 'error') {
      return (
        <div className="status error" role="alert">
          <p>No se pudo conectar con la API: {error}</p>
          <button type="button" className="pull-button" onClick={load}>
            Reintentar
          </button>
        </div>
      );
    }
    if (tab === 'gacha') {
      return <GachaBanner characters={characters} onSelect={setSelected} random={random} />;
    }
    return <Catalog characters={characters} onSelect={setSelected} />;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Genshin Gacha</h1>
        <nav aria-label="Secciones">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={tab === id ? 'tab active' : 'tab'}
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>{renderContent()}</main>

      {selected && <CharacterModal character={selected} onClose={closeModal} />}

      <footer className="footer">
        Datos de <a href="https://github.com/genshindev/api">genshindev/api</a> · Taller
        DevOps
      </footer>
    </div>
  );
}
