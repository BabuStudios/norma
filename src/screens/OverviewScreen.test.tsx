import { screen } from '@testing-library/react';
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

  it('offers the eight Visio-style flowchart shapes, each stamped on its box', async () => {
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

  it('connects two boxes with an arrow', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Koppla' }));
    const nodeButtons = screen.getAllByRole('button', { name: 'Ny låda' });
    expect(document.querySelectorAll('svg line')).toHaveLength(0);

    await user.click(nodeButtons[0]);
    await user.click(nodeButtons[1]);
    expect(document.querySelectorAll('svg line')).toHaveLength(1);
  });

  it('does not connect a box to itself', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));

    await user.click(screen.getByRole('button', { name: 'Koppla' }));
    const [node] = screen.getAllByRole('button', { name: 'Ny låda' });
    await user.click(node);
    await user.click(node);
    expect(document.querySelectorAll('svg line')).toHaveLength(0);
  });

  it('deletes a box, taking its edge with it', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Process' }));
    await user.click(screen.getByRole('button', { name: 'Koppla' }));
    const [first, second] = screen.getAllByRole('button', { name: 'Ny låda' });
    await user.click(first);
    await user.click(second);
    expect(document.querySelectorAll('svg line')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Koppla' })); // back to select
    await user.click(screen.getByRole('button', { name: 'Ta bort' }));
    const [remaining] = screen.getAllByRole('button', { name: 'Ny låda' });
    await user.click(remaining);

    expect(screen.getAllByRole('button', { name: 'Ny låda' })).toHaveLength(1);
    expect(document.querySelectorAll('svg line')).toHaveLength(0);
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
});
