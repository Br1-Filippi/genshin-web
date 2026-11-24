import { useState } from 'react';
import { PITY_LIMIT, pullMany, type RandomFn } from '../gacha';
import type { Character } from '../types';
import { CharacterCard } from './CharacterCard';

interface GachaBannerProps {
  characters: Character[];
  onSelect: (character: Character) => void;
  random?: RandomFn;
}

interface PulledCharacter {
  key: string;
  character: Character;
}

export function GachaBanner({
  characters,
  onSelect,
  random = Math.random,
}: Readonly<GachaBannerProps>) {
  const [results, setResults] = useState<PulledCharacter[]>([]);
  const [pity, setPity] = useState(0);
  const [totalPulls, setTotalPulls] = useState(0);
  const [fiveStars, setFiveStars] = useState(0);

  const pull = (count: number) => {
    const outcome = pullMany(characters, count, pity, random);
    const start = totalPulls;
    setResults(
      outcome.characters.map((character, i) => ({
        key: `${start + i}-${character.id}`,
        character,
      })),
    );
    setPity(outcome.pity);
    setTotalPulls(start + count);
    setFiveStars(
      (current) => current + outcome.characters.filter((c) => c.rarity === 5).length,
    );
  };

  return (
    <section className="gacha" aria-label="Gacha">
      <div className="banner">
        <h2>Deseo de Teyvat</h2>
        <p>
          Cada tirada tiene un 10% de probabilidad de 5★. La tirada {PITY_LIMIT} sin
          5★ lo garantiza.
        </p>
        <div className="pull-buttons">
          <button type="button" className="pull-button" onClick={() => pull(1)}>
            Tirar ×1
          </button>
          <button type="button" className="pull-button" onClick={() => pull(10)}>
            Tirar ×10
          </button>
        </div>
        <ul className="stats">
          <li>
            Tiradas: <strong>{totalPulls}</strong>
          </li>
          <li>
            5★ obtenidos: <strong>{fiveStars}</strong>
          </li>
          <li>
            5★ garantizado en: <strong>{PITY_LIMIT - pity}</strong>
          </li>
        </ul>
      </div>

      {results.length === 0 ? (
        <p className="empty">¡Haz tu primera tirada!</p>
      ) : (
        <div className="grid results">
          {results.map(({ key, character }) => (
            <CharacterCard key={key} character={character} onSelect={onSelect} isNew />
          ))}
        </div>
      )}
    </section>
  );
}
