import { useEffect } from 'react';
import { characterImage } from '../api';
import type { Character } from '../types';
import { Stars } from './Stars';

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
}

export function formatBirthday(birthday?: string): string {
  if (!birthday) return 'Desconocido';
  const [, month, day] = birthday.split('-');
  if (!month || !day) return 'Desconocido';
  return `${day}/${month}`;
}

export function CharacterModal({ character, onClose }: Readonly<CharacterModalProps>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <dialog open className={`modal rarity-${character.rarity}`} aria-label={character.name}>
        <button type="button" className="close-button" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
        <img
          className="modal-card"
          src={characterImage(character.id, 'card')}
          alt={`Tarjeta de ${character.name}`}
        />
        <div className="modal-info">
          <h2>{character.name}</h2>
          {character.title && <p className="character-title">{character.title}</p>}
          <Stars count={character.rarity} />
          <dl>
            <dt>Elemento</dt>
            <dd>{character.vision}</dd>
            <dt>Arma</dt>
            <dd>{character.weapon}</dd>
            <dt>Nación</dt>
            <dd>{character.nation}</dd>
            <dt>Cumpleaños</dt>
            <dd>{formatBirthday(character.birthday)}</dd>
            <dt>Constelación</dt>
            <dd>{character.constellation ?? 'Desconocida'}</dd>
          </dl>
          {character.description && <p className="description">{character.description}</p>}
          {character.lang !== 'es' && (
            <p className="lang-note">Este personaje aún no tiene traducción al español.</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
