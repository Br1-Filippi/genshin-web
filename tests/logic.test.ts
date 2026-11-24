import { characterImage, elementIcon, fetchCharacters } from '../src/api';
import {
  EMPTY_FILTERS,
  elementOf,
  filterCharacters,
  normalize,
  uniqueNations,
} from '../src/filters';
import { PITY_LIMIT, pullMany, pullOne, rollRarity } from '../src/gacha';
import { CHARACTERS, sequence } from './fixtures';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe('api', () => {
  test('fetchCharacters pide los personajes en español y los ordena', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse([CHARACTERS[1], CHARACTERS[0]]));
    const result = await fetchCharacters('es', fetcher);
    expect(fetcher).toHaveBeenCalledWith('/api/characters/all?lang=es');
    expect(result.map((c) => c.name)).toEqual(['Amber', 'Hu Tao']);
  });

  test('fetchCharacters lanza error si la API falla', async () => {
    const fetcher = vi.fn().mockResolvedValue(jsonResponse({}, 503));
    await expect(fetchCharacters('es', fetcher)).rejects.toThrow('503');
  });

  test('construye las URLs de imágenes', () => {
    expect(characterImage('hu-tao', 'card')).toBe('/api/characters/hu-tao/card');
    expect(elementIcon('Pyro')).toBe('/api/elements/pyro/icon');
  });
});

describe('filtros', () => {
  test('normalize quita tildes, mayúsculas y espacios', () => {
    expect(normalize('  Chóngyun ')).toBe('chongyun');
  });

  test('elementOf usa vision_key y si no existe vision', () => {
    expect(elementOf(CHARACTERS[0])).toBe('pyro');
    expect(elementOf(CHARACTERS[3])).toBe('cryo');
  });

  test('sin filtros devuelve todos', () => {
    expect(filterCharacters(CHARACTERS, EMPTY_FILTERS)).toHaveLength(CHARACTERS.length);
  });

  test('filtra por nombre sin importar tildes', () => {
    const result = filterCharacters(CHARACTERS, { ...EMPTY_FILTERS, query: 'chong' });
    expect(result.map((c) => c.id)).toEqual(['chongyun']);
  });

  test('combina elemento y nación', () => {
    const result = filterCharacters(CHARACTERS, {
      query: '',
      element: 'Cryo',
      nation: 'Liyue',
    });
    expect(result.map((c) => c.id)).toEqual(['ganyu', 'chongyun']);
  });

  test('uniqueNations devuelve las naciones ordenadas sin repetir', () => {
    expect(uniqueNations(CHARACTERS)).toEqual(['Liyue', 'Mondstadt']);
  });
});

describe('gacha', () => {
  test('rollRarity respeta la probabilidad de 5★', () => {
    expect(rollRarity(0, () => 0.05)).toBe(5);
    expect(rollRarity(0, () => 0.5)).toBe(4);
  });

  test('rollRarity garantiza 5★ al llegar al límite', () => {
    expect(rollRarity(PITY_LIMIT - 1, () => 0.99)).toBe(5);
  });

  test('pullOne entrega un 4★ y aumenta el contador', () => {
    const outcome = pullOne(CHARACTERS, 3, sequence(0.5, 0));
    expect(outcome.characters[0].rarity).toBe(4);
    expect(outcome.pity).toBe(4);
  });

  test('pullOne entrega un 5★ y reinicia el contador', () => {
    const outcome = pullOne(CHARACTERS, 3, sequence(0.01, 0));
    expect(outcome.characters[0].rarity).toBe(5);
    expect(outcome.pity).toBe(0);
  });

  test('pullOne usa todos los personajes si no hay de esa rareza', () => {
    const onlyFourStars = CHARACTERS.filter((c) => c.rarity === 4);
    const outcome = pullOne(onlyFourStars, PITY_LIMIT - 1, sequence(0));
    expect(outcome.characters[0].rarity).toBe(4);
  });

  test('pullOne falla si no hay personajes', () => {
    expect(() => pullOne([], 0)).toThrow('No hay personajes');
  });

  test('pullMany hace varias tiradas y garantiza un 5★ en 10', () => {
    const outcome = pullMany(CHARACTERS, PITY_LIMIT, 0, () => 0.5);
    expect(outcome.characters).toHaveLength(PITY_LIMIT);
    expect(outcome.characters.filter((c) => c.rarity === 5)).toHaveLength(1);
    expect(outcome.pity).toBe(0);
  });
});
