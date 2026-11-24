import { useMemo, useState } from 'react';
import { EMPTY_FILTERS, filterCharacters, uniqueNations } from '../filters';
import type { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { Filters } from './Filters';

interface CatalogProps {
  characters: Character[];
  onSelect: (character: Character) => void;
}

export function Catalog({ characters, onSelect }: Readonly<CatalogProps>) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const nations = useMemo(() => uniqueNations(characters), [characters]);
  const visible = useMemo(
    () => filterCharacters(characters, filters),
    [characters, filters],
  );

  return (
    <section className="catalog" aria-label="Catálogo">
      <Filters filters={filters} nations={nations} onChange={setFilters} />
      <p className="count">
        Mostrando {visible.length} de {characters.length} personajes
      </p>
      <div className="grid">
        {visible.map((character) => (
          <CharacterCard key={character.id} character={character} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
