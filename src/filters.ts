import type { Character } from './types';

export interface CharacterFilters {
  query: string;
  element: string;
  nation: string;
}

export const EMPTY_FILTERS: CharacterFilters = {
  query: '',
  element: '',
  nation: '',
};

export const ELEMENTS = [
  'Pyro',
  'Hydro',
  'Anemo',
  'Electro',
  'Dendro',
  'Cryo',
  'Geo',
] as const;

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function elementOf(character: Character): string {
  return normalize(character.vision_key ?? character.vision);
}

export function filterCharacters(
  characters: Character[],
  filters: CharacterFilters,
): Character[] {
  const query = normalize(filters.query);
  const element = normalize(filters.element);

  return characters.filter((character) => {
    const matchesQuery = query === '' || normalize(character.name).includes(query);
    const matchesElement = element === '' || elementOf(character) === element;
    const matchesNation = filters.nation === '' || character.nation === filters.nation;
    return matchesQuery && matchesElement && matchesNation;
  });
}

export function uniqueNations(characters: Character[]): string[] {
  const nations = new Set(characters.map((character) => character.nation));
  return [...nations].sort((a, b) => a.localeCompare(b));
}
