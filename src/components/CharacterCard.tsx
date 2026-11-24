import { characterImage, elementIcon } from '../api';
import { elementOf } from '../filters';
import type { Character } from '../types';
import { Stars } from './Stars';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  isNew?: boolean;
}

export function CharacterCard({
  character,
  onSelect,
  isNew = false,
}: Readonly<CharacterCardProps>) {
  const classes = ['character-card', `rarity-${character.rarity}`];
  if (isNew) classes.push('is-new');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => onSelect(character)}
    >
      <img
        className="portrait"
        src={characterImage(character.id, 'icon-big')}
        alt={character.name}
        loading="lazy"
      />
      <img
        className="element-badge"
        src={elementIcon(elementOf(character))}
        alt={character.vision}
      />
      <span className="character-name">{character.name}</span>
      <Stars count={character.rarity} />
    </button>
  );
}
