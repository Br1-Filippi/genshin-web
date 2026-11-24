import type { Character, ImageKind } from './types';

/** La API se consume a través del proxy de nginx (o de Vite en desarrollo). */
export const API_BASE = '/api';

export async function fetchCharacters(
  lang = 'es',
  fetcher: typeof fetch = fetch,
): Promise<Character[]> {
  const response = await fetcher(
    `${API_BASE}/characters/all?lang=${encodeURIComponent(lang)}`,
  );
  if (!response.ok) {
    throw new Error(`La API respondió ${response.status}`);
  }
  const characters = (await response.json()) as Character[];
  return [...characters].sort((a, b) => a.name.localeCompare(b.name));
}

export function characterImage(id: string, kind: ImageKind): string {
  return `${API_BASE}/characters/${id}/${kind}`;
}

export function elementIcon(element: string): string {
  return `${API_BASE}/elements/${element.toLowerCase()}/icon`;
}
