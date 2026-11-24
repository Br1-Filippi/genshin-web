import type { Character } from '../src/types';

export const makeCharacter = (overrides: Partial<Character>): Character => ({
  id: 'amber',
  name: 'Amber',
  vision: 'Pyro',
  vision_key: 'PYRO',
  weapon: 'Arco',
  nation: 'Mondstadt',
  rarity: 4,
  birthday: '0000-08-10',
  constellation: 'Lepus',
  description: 'Exploradora de los Caballeros de Favonius.',
  lang: 'es',
  ...overrides,
});

export const CHARACTERS: Character[] = [
  makeCharacter({}),
  makeCharacter({
    id: 'hu-tao',
    name: 'Hu Tao',
    weapon: 'Lanza',
    nation: 'Liyue',
    rarity: 5,
    title: 'Fragancia en el deshielo',
  }),
  makeCharacter({
    id: 'ganyu',
    name: 'Ganyu',
    vision: 'Cryo',
    vision_key: 'CRYO',
    nation: 'Liyue',
    rarity: 5,
  }),
  makeCharacter({
    id: 'eula',
    name: 'Eula',
    vision: 'Cryo',
    vision_key: undefined,
    weapon: 'Mandoble',
    rarity: 5,
    lang: 'en',
    birthday: undefined,
    constellation: undefined,
    description: undefined,
  }),
  makeCharacter({
    id: 'chongyun',
    name: 'Chóngyun',
    vision: 'Cryo',
    vision_key: 'CRYO',
    nation: 'Liyue',
  }),
];

/** Devuelve una función "aleatoria" que entrega los valores en orden (en bucle). */
export const sequence = (...values: number[]) => {
  let i = 0;
  return () => {
    const value = values[i % values.length];
    i++;
    return value;
  };
};
