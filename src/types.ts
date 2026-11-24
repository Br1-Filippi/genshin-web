export interface Character {
  id: string;
  name: string;
  title?: string;
  vision: string;
  vision_key?: string;
  weapon: string;
  nation: string;
  affiliation?: string;
  rarity: number;
  birthday?: string;
  constellation?: string;
  description?: string;
  lang: string;
}

export type ImageKind = 'icon-big' | 'card';
