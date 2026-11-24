import type { Character } from './types';

/** Probabilidad de obtener un personaje 5★ en cada tirada. */
export const FIVE_STAR_RATE = 0.1;
/** Cantidad máxima de tiradas sin 5★: la tirada número PITY_LIMIT lo garantiza. */
export const PITY_LIMIT = 10;

export type RandomFn = () => number;

export interface PullOutcome {
  characters: Character[];
  pity: number;
}

export function rollRarity(pity: number, random: RandomFn): 4 | 5 {
  if (pity + 1 >= PITY_LIMIT) return 5;
  return random() < FIVE_STAR_RATE ? 5 : 4;
}

export function pullOne(
  characters: Character[],
  pity: number,
  random: RandomFn = Math.random,
): PullOutcome {
  if (characters.length === 0) {
    throw new Error('No hay personajes disponibles para tirar');
  }

  const rarity = rollRarity(pity, random);
  const pool = characters.filter((character) => character.rarity === rarity);
  const candidates = pool.length > 0 ? pool : characters;
  const character = candidates[Math.floor(random() * candidates.length)];
  const nextPity = character.rarity === 5 ? 0 : pity + 1;

  return { characters: [character], pity: nextPity };
}

export function pullMany(
  characters: Character[],
  count: number,
  pity: number,
  random: RandomFn = Math.random,
): PullOutcome {
  const results: Character[] = [];
  let currentPity = pity;

  for (let i = 0; i < count; i++) {
    const outcome = pullOne(characters, currentPity, random);
    results.push(...outcome.characters);
    currentPity = outcome.pity;
  }

  return { characters: results, pity: currentPity };
}
