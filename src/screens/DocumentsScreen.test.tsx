import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderScreen } from '@/test/render';
import { DocumentsScreen } from './DocumentsScreen';

const render = () => renderScreen(<DocumentsScreen />, { route: '/documents' });

describe('the document register, starting empty', () => {
  it('shows an empty state rather than a blank table', () => {
    render();
    expect(screen.getByText(/Inga dokument ännu/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('always offers the add-document button, not only from the empty state', () => {
    render();
    expect(screen.getByRole('button', { name: '+ Nytt dokument' })).toBeInTheDocument();
  });
});

describe('adding a document', () => {
  it('opens and closes the form on the same button', async () => {
    const { user } = render();
    const toggle = screen.getByRole('button', { name: '+ Nytt dokument' });

    await user.click(toggle);
    expect(screen.getByLabelText('Dokumentnamn')).toBeInTheDocument();

    await user.click(toggle);
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
  });

  it('adds the document to the register on save', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));

    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');
    await user.clear(screen.getByLabelText('Ansvarig'));
    await user.type(screen.getByLabelText('Ansvarig'), 'Maja Karlsson');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Kvalitetshandbok')).toBeInTheDocument();
    expect(screen.getByText('D001')).toBeInTheDocument();
    expect(screen.getByText('Maja Karlsson')).toBeInTheDocument();
    expect(screen.getByText('Utkast')).toBeInTheDocument();
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
  });

  it('will not save a document without a name', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByLabelText('Dokumentnamn')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('discards the draft on cancel', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
    expect(screen.queryByText('Kvalitetshandbok')).not.toBeInTheDocument();
  });

  it('numbers documents in the order they are added', async () => {
    const { user } = render();

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Först');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Sedan');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByText('D001')).toBeInTheDocument();
    expect(screen.getByText('D002')).toBeInTheDocument();
  });
});
