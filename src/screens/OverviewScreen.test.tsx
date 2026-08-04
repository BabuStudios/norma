import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderScreen } from '@/test/render';
import { OverviewScreen } from './OverviewScreen';

const render = () => renderScreen(<OverviewScreen />, { route: '/overview' });

describe('the overview, starting from nothing', () => {
  it('shows an empty change log with an explanation, not a blank area', () => {
    render();
    expect(screen.getByText(/Inga ändringar loggade ännu/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('says no content has been added yet, before anyone edits the page', () => {
    render();
    expect(screen.getByText(/Inget innehåll tillagt än/)).toBeInTheDocument();
  });
});

describe('editing the page', () => {
  it('toggles into and out of edit mode on the same button', async () => {
    const { user } = render();
    const toggle = screen.getByRole('button', { name: 'Redigera' });

    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Klar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lägg till textblock' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Klar' }));
    expect(screen.getByRole('button', { name: 'Redigera' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lägg till textblock' })).not.toBeInTheDocument();
  });

  it('adds a text block and edits its heading and body', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));

    const heading = screen.getByLabelText('Rubrik');
    expect(heading).toHaveValue('Ny rubrik');
    await user.clear(heading);
    await user.type(heading, 'Vår kvalitetspolicy');

    const body = screen.getByLabelText('Brödtext');
    await user.type(body, 'Vi levererar rätt kvalitet i tid.');

    await user.click(screen.getByRole('button', { name: 'Klar' }));
    expect(
      screen.getByRole('heading', { level: 3, name: 'Vår kvalitetspolicy' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Vi levererar rätt kvalitet i tid.')).toBeInTheDocument();
  });

  it('removes a block', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));
    expect(screen.getByLabelText('Rubrik')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ta bort block' }));
    expect(screen.queryByLabelText('Rubrik')).not.toBeInTheDocument();
  });

  it('reorders blocks with move up and move down', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));

    const headings = () => screen.getAllByLabelText('Rubrik') as HTMLInputElement[];
    await user.clear(headings()[0]);
    await user.type(headings()[0], 'Först');
    await user.clear(headings()[1]);
    await user.type(headings()[1], 'Sist');

    const moveUpButtons = screen.getAllByRole('button', { name: 'Flytta upp' });
    await user.click(moveUpButtons[1]);
    expect(headings().map((input) => input.value)).toEqual(['Sist', 'Först']);

    const moveDownButtons = screen.getAllByRole('button', { name: 'Flytta ned' });
    await user.click(moveDownButtons[0]);
    expect(headings().map((input) => input.value)).toEqual(['Först', 'Sist']);
  });

  it('disables move up on the first block and move down on the last', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));

    const moveUpButtons = screen.getAllByRole('button', { name: 'Flytta upp' });
    const moveDownButtons = screen.getAllByRole('button', { name: 'Flytta ned' });
    expect(moveUpButtons[0]).toBeDisabled();
    expect(moveDownButtons[1]).toBeDisabled();
  });

  it('adds an editable organization chart, pre-titled and using the same box tool', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till organisationsschema' }));

    expect(screen.getByDisplayValue('Organisationsschema')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Process' }));
    expect(screen.getAllByLabelText('Låda')).toHaveLength(1);
  });
});

describe('the process diagram tool', () => {
  const addDiagram = async (user: ReturnType<typeof render>['user']) => {
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till processbild' }));
  };

  it('adds boxes with an editable label', async () => {
    const { user } = render();
    await addDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    const boxes = screen.getAllByLabelText('Låda') as HTMLInputElement[];
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toHaveValue('Ny låda');

    await user.clear(boxes[0]);
    await user.type(boxes[0], 'Beställning');
    expect(boxes[0]).toHaveValue('Beställning');
  });

  it('offers the twenty Visio-style flowchart shapes, each stamped on its box', async () => {
    const { user } = render();
    await addDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Beslut' }));
    await user.click(screen.getByRole('button', { name: 'Start/Slut' }));
    await user.click(screen.getByRole('button', { name: 'Data' }));
    await user.click(screen.getByRole('button', { name: 'Dokument' }));
    await user.click(screen.getByRole('button', { name: 'Delprocess' }));
    await user.click(screen.getByRole('button', { name: 'Förberedelse' }));
    await user.click(screen.getByRole('button', { name: 'Anslutning' }));
    await user.click(screen.getByRole('button', { name: 'Manuell operation' }));
    await user.click(screen.getByRole('button', { name: 'Lagrad data' }));
    await user.click(screen.getByRole('button', { name: 'Internminne' }));
    await user.click(screen.getByRole('button', { name: 'Direktdata' }));
    await user.click(screen.getByRole('button', { name: 'Manuell inmatning' }));
    await user.click(screen.getByRole('button', { name: 'Kort' }));
    await user.click(screen.getByRole('button', { name: 'Pappersremsa' }));
    await user.click(screen.getByRole('button', { name: 'Skärm' }));
    await user.click(screen.getByRole('button', { name: 'Loopgräns' }));
    await user.click(screen.getByRole('button', { name: 'Sidreferens (ut)' }));
    await user.click(screen.getByRole('button', { name: 'Sidreferens (in)' }));
    await user.click(screen.getByRole('button', { name: 'Sidreferens (pil)' }));

    const shapes = Array.from(document.querySelectorAll('[data-shape]')).map((el) =>
      el.getAttribute('data-shape'),
    );
    expect(shapes).toEqual(
      expect.arrayContaining([
        'process',
        'decision',
        'terminator',
        'data',
        'document',
        'predefined',
        'preparation',
        'connector',
        'manualOperation',
        'storedData',
        'internalStorage',
        'directData',
        'manualInput',
        'card',
        'paperTape',
        'display',
        'loopLimit',
        'offPageOut',
        'offPageIn',
        'offPageArrow',
      ]),
    );
  });

  it('gives every new box the default size and a resize handle', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    const [box] = screen.getAllByLabelText('Låda');
    const node = box.closest('[data-shape]') as HTMLElement;
    expect(node.style.width).toBe('150px');
    expect(node.style.height).toBe('56px');
    expect(node.querySelector('[class*="resizeHandle"]')).toBeInTheDocument();
  });

  it('lets a box choose its own fill and text color', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    const [box] = screen.getAllByLabelText('Låda');
    const node = box.closest('[data-shape]') as HTMLElement;
    fireEvent.change(within(node).getByLabelText('Lådfärg'), { target: { value: '#ff0000' } });
    fireEvent.change(within(node).getByLabelText('Textfärg'), { target: { value: '#00ff00' } });

    expect(node.querySelector('svg rect')).toHaveAttribute('fill', '#ff0000');
    expect(box).toHaveStyle({ color: '#00ff00' });
  });

  it('lets the diagram background be recolored', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    fireEvent.change(screen.getByLabelText('Bakgrundsfärg'), { target: { value: '#0000ff' } });
    const canvas = document.querySelector('[class*="canvas"]') as HTMLElement;
    expect(canvas).toHaveStyle({ background: '#0000ff' });
  });

  const edgeLines = () => document.querySelectorAll('[class*="edgeLine"]');
  const nodeContainers = () =>
    Array.from(document.querySelectorAll('[data-shape]')) as HTMLElement[];
  const connectionPointsOf = (node: HTMLElement) =>
    within(node).getAllByRole('button', { name: 'Kopplingspunkt' });

  it('shows connection points around a box only in arrow mode', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    expect(screen.queryAllByRole('button', { name: 'Kopplingspunkt' })).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    expect(screen.getAllByRole('button', { name: 'Kopplingspunkt' })).toHaveLength(8);
  });

  it('connects two boxes with an arrow drawn between chosen connection points', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    const [first, second] = nodeContainers();
    expect(edgeLines()).toHaveLength(0);

    await user.click(connectionPointsOf(first)[0]);
    await user.click(connectionPointsOf(second)[0]);
    expect(edgeLines()).toHaveLength(1);
  });

  it('does not connect a box to itself', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    const [node] = nodeContainers();
    const [point] = connectionPointsOf(node);
    await user.click(point);
    await user.click(point);
    expect(edgeLines()).toHaveLength(0);
  });

  it('draws a curved, dashed arrow when those styles are selected', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    await user.click(screen.getByRole('button', { name: 'Streckad' }));
    await user.click(screen.getByRole('button', { name: 'Svängd' }));

    const [first, second] = nodeContainers();
    await user.click(connectionPointsOf(first)[0]);
    await user.click(connectionPointsOf(second)[0]);

    const [line] = edgeLines();
    expect(line.getAttribute('stroke-dasharray')).toBe('10 6');
    expect(line.getAttribute('d')).toContain('Q');
  });

  it('draws an arrow in the chosen color', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    fireEvent.change(screen.getByLabelText('Pilfärg'), { target: { value: '#ff00ff' } });

    const [first, second] = nodeContainers();
    await user.click(connectionPointsOf(first)[0]);
    await user.click(connectionPointsOf(second)[0]);

    const [line] = edgeLines();
    expect(line).toHaveAttribute('stroke', '#ff00ff');
  });

  it('draws an angled arrow with a single 90° corner when that shape is selected', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Pil' }));
    await user.click(screen.getByRole('button', { name: 'Vinklad' }));

    const [first, second] = nodeContainers();
    await user.click(connectionPointsOf(first)[0]);
    await user.click(connectionPointsOf(second)[0]);

    const [line] = edgeLines();
    const d = line.getAttribute('d') ?? '';
    expect(d).not.toContain('Q');
    expect(d.match(/L/g)).toHaveLength(2);
  });

  it('deletes a box, taking its edge with it', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Pil' }));
    const [first, second] = nodeContainers();
    await user.click(connectionPointsOf(first)[0]);
    await user.click(connectionPointsOf(second)[0]);
    expect(edgeLines()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Pil' })); // back to select
    await user.click(screen.getByRole('button', { name: 'Ta bort' }));
    const [remaining] = screen.getAllByRole('button', { name: 'Ny låda' });
    await user.click(remaining);

    expect(screen.getAllByRole('button', { name: 'Ny låda' })).toHaveLength(1);
    expect(edgeLines()).toHaveLength(0);
  });

  it('shows the diagram read-only once editing ends', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Klar' }));
    expect(screen.queryByLabelText('Låda')).not.toBeInTheDocument();
    expect(screen.getByText('Ny låda')).toBeInTheDocument();
  });
});

describe('the box menu on a finished diagram', () => {
  const addFinishedDiagram = async (user: ReturnType<typeof render>['user']) => {
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till processbild' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Klar' }));
  };

  const seedDocuments = () => {
    window.localStorage.setItem(
      'norma.state.v1',
      JSON.stringify({
        documents: [
          {
            id: 'D001',
            name: { sv: 'Kvalitetshandbok', en: 'Kvalitetshandbok' },
            version: '1.0',
            owner: '',
            nextReview: '',
            kind: 'soft',
            state: { sv: 'Utkast', en: 'Draft' },
            tabId: 'templates',
            metadata: {},
            fileName: null,
            fileSize: null,
          },
        ],
      }),
    );
  };

  it('opens a menu with Koppla and Mer info when a box is clicked', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    expect(screen.getByRole('menuitem', { name: 'Koppla' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Mer info' })).toBeInTheDocument();
  });

  it('shows Koppla dokument and Länka vidare after choosing Koppla', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla' }));

    expect(screen.getByRole('menuitem', { name: 'Koppla dokument' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Länka vidare' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Mer info' })).not.toBeInTheDocument();
  });

  it('goes back to the root menu', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla' }));
    await user.click(screen.getByRole('button', { name: 'Tillbaka' }));

    expect(screen.getByRole('menuitem', { name: 'Koppla' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Mer info' })).toBeInTheDocument();
  });

  it('closes the menu on Escape', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside it', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the menu after choosing a leaf item', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    await user.click(screen.getByRole('menuitem', { name: 'Mer info' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows a message when there are no documents to link', async () => {
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla dokument' }));

    expect(screen.getByText('Inga dokument att koppla.')).toBeInTheDocument();
  });

  it('links a document to a box and shows it below the diagram once selected', async () => {
    seedDocuments();
    const { user } = render();
    await addFinishedDiagram(user);

    await user.click(screen.getByRole('button', { name: 'Ny låda' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla' }));
    await user.click(screen.getByRole('menuitem', { name: 'Koppla dokument' }));

    const docItem = screen.getByRole('menuitemcheckbox', { name: /D001/ });
    expect(docItem).toHaveAttribute('aria-checked', 'false');
    await user.click(docItem);
    expect(docItem).toHaveAttribute('aria-checked', 'true');

    await user.keyboard('{Escape}');
    expect(screen.getByText('Kopplade dokument')).toBeInTheDocument();
    expect(screen.getByText('Kvalitetshandbok')).toBeInTheDocument();
  });
});
