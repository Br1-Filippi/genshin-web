import { elementIcon } from '../api';
import { ELEMENTS, EMPTY_FILTERS, type CharacterFilters } from '../filters';

interface FiltersProps {
  filters: CharacterFilters;
  nations: string[];
  onChange: (filters: CharacterFilters) => void;
}

export function Filters({ filters, nations, onChange }: Readonly<FiltersProps>) {
  const update = (changes: Partial<CharacterFilters>) =>
    onChange({ ...filters, ...changes });

  return (
    <section className="filters" aria-label="Filtros">
      <input
        type="search"
        placeholder="Buscar personaje…"
        aria-label="Buscar personaje"
        value={filters.query}
        onChange={(event) => update({ query: event.target.value })}
      />

      <div className="element-filters">
        {ELEMENTS.map((element) => {
          const active = filters.element === element;
          return (
            <button
              key={element}
              type="button"
              className={active ? 'element-button active' : 'element-button'}
              aria-pressed={active}
              title={element}
              onClick={() => update({ element: active ? '' : element })}
            >
              <img src={elementIcon(element)} alt={element} />
            </button>
          );
        })}
      </div>

      <select
        aria-label="Nación"
        value={filters.nation}
        onChange={(event) => update({ nation: event.target.value })}
      >
        <option value="">Todas las naciones</option>
        {nations.map((nation) => (
          <option key={nation} value={nation}>
            {nation}
          </option>
        ))}
      </select>

      <button type="button" className="link-button" onClick={() => onChange(EMPTY_FILTERS)}>
        Limpiar
      </button>
    </section>
  );
}
