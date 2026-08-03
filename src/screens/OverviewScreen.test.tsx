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

    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));

    const boxes = screen.getAllByLabelText('Låda') as HTMLInputElement[];
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toHaveValue('Ny låda');

    await user.clear(boxes[0]);
    await user.type(boxes[0], 'Beställning');
    expect(boxes[0]).toHaveValue('Beställning');
  });

  it('connects two boxes with an arrow', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));

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
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));

    await user.click(screen.getByRole('button', { name: 'Koppla' }));
    const [node] = screen.getAllByRole('button', { name: 'Ny låda' });
    await user.click(node);
    await user.click(node);
    expect(document.querySelectorAll('svg line')).toHaveLength(0);
  });

  it('deletes a box, taking its edge with it', async () => {
    const { user } = render();
    await addDiagram(user);
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));
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
    await user.click(screen.getByRole('button', { name: 'Lägg till låda' }));

    await user.click(screen.getByRole('button', { name: 'Klar' }));
    expect(screen.queryByLabelText('Låda')).not.toBeInTheDocument();
    expect(screen.getByText('Ny låda')).toBeInTheDocument();
  });
});
