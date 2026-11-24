import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import { CharacterCard } from '../src/components/CharacterCard';
import { CharacterModal, formatBirthday } from '../src/components/CharacterModal';
import { GachaBanner } from '../src/components/GachaBanner';
import { CHARACTERS } from './fixtures';

const mockFetch = (response: Response | Promise<Response>) => {
  const fetchMock = vi.fn().mockReturnValue(Promise.resolve(response));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => vi.unstubAllGlobals());

describe('CharacterCard', () => {
  test('muestra el personaje y avisa al seleccionarlo', async () => {
    const onSelect = vi.fn();
    render(<CharacterCard character={CHARACTERS[1]} onSelect={onSelect} isNew />);

    const button = screen.getByRole('button', { name: /hu tao/i });
    expect(button).toHaveClass('rarity-5', 'is-new');
    expect(screen.getByAltText('Hu Tao')).toHaveAttribute(
      'src',
      '/api/characters/hu-tao/icon-big',
    );

    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith(CHARACTERS[1]);
  });
});

describe('CharacterModal', () => {
  test('formatBirthday da formato día/mes', () => {
    expect(formatBirthday('0000-08-10')).toBe('10/08');
    expect(formatBirthday(undefined)).toBe('Desconocido');
    expect(formatBirthday('sin-fecha')).toBe('Desconocido');
  });

  test('muestra los detalles y se cierra con el botón o Escape', async () => {
    const onClose = vi.fn();
    render(<CharacterModal character={CHARACTERS[1]} onClose={onClose} />);

    expect(screen.getByRole('heading', { name: 'Hu Tao' })).toBeInTheDocument();
    expect(screen.getByText('Fragancia en el deshielo')).toBeInTheDocument();
    expect(screen.getByText('Lanza')).toBeInTheDocument();
    expect(screen.queryByText(/aún no tiene traducción/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('avisa cuando el personaje no está traducido', () => {
    render(<CharacterModal character={CHARACTERS[3]} onClose={vi.fn()} />);
    expect(screen.getByText(/aún no tiene traducción/)).toBeInTheDocument();
    expect(screen.getByText('Desconocida')).toBeInTheDocument();
  });
});

describe('GachaBanner', () => {
  test('hace tiradas y actualiza las estadísticas', async () => {
    const onSelect = vi.fn();
    render(<GachaBanner characters={CHARACTERS} onSelect={onSelect} random={() => 0.5} />);

    expect(screen.getByText('¡Haz tu primera tirada!')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Tirar ×10' }));
    const gacha = screen.getByRole('region', { name: 'Gacha' });
    expect(gacha.querySelectorAll('.character-card')).toHaveLength(10);
    expect(screen.getByText('Tiradas:')).toHaveTextContent('10');
    expect(screen.getByText('5★ obtenidos:')).toHaveTextContent('1');

    await userEvent.click(screen.getByRole('button', { name: 'Tirar ×1' }));
    expect(gacha.querySelectorAll('.character-card')).toHaveLength(1);
    expect(screen.getByText('5★ garantizado en:')).toHaveTextContent('9');

    await userEvent.click(gacha.querySelector('.character-card') as HTMLElement);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe('App', () => {
  test('carga los personajes y permite navegar al catálogo', async () => {
    const fetchMock = mockFetch(new Response(JSON.stringify(CHARACTERS)));
    render(<App random={() => 0.01} />);

    expect(screen.getByText('Cargando personajes…')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Tirar ×1' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/characters/all?lang=es');

    await userEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
    expect(screen.getByText('Mostrando 5 de 5 personajes')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Buscar personaje'), 'hu');
    expect(screen.getByText('Mostrando 1 de 5 personajes')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cryo' }));
    expect(screen.getByText('Mostrando 3 de 5 personajes')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Nación'), 'Mondstadt');
    expect(screen.getByText('Mostrando 1 de 5 personajes')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cryo' }));
    expect(screen.getByText('Mostrando 2 de 5 personajes')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /amber/i }));
    expect(screen.getByRole('dialog', { name: 'Amber' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Gacha' }));
    expect(screen.getByRole('region', { name: 'Gacha' })).toBeInTheDocument();
  });

  test('muestra un error y permite reintentar', async () => {
    const fetchMock = mockFetch(new Response('{}', { status: 500 }));
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('500');

    fetchMock.mockReturnValue(Promise.resolve(new Response(JSON.stringify(CHARACTERS))));
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Tirar ×1' })).toBeInTheDocument(),
    );
  });

  test('muestra errores que no son Error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.reject('sin red')));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('sin red');
  });
});
