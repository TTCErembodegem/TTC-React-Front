import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestRouter } from '../../../utils/test-utils';
import { TabbedContainer } from '../TabbedContainer';

vi.mock('../../../storeUtil', () => ({ default: {} }));

const tabKeys = [
  { key: 'players', title: 'Spelers' },
  { key: 'teams', title: 'Teams' },
];

const renderContainer = (width: number) => {
  window.innerWidth = width;
  return render(
    <TestRouter>
      <TabbedContainer selectedTab="teams" tabKeys={tabKeys} tabRenderer={key => <div>content-{key}</div>} route={{ base: '/admin' }} widthTreshold={900} />
    </TestRouter>,
  );
};

describe('TabbedContainer', () => {
  const originalWidth = window.innerWidth;
  afterEach(() => {
    window.innerWidth = originalWidth;
  });

  it('renders tabs on wide screens', () => {
    renderContainer(1200);
    expect(screen.getByRole('link', { name: 'Spelers' })).toBeInTheDocument();
    expect(screen.getByText('content-teams')).toBeInTheDocument();
  });

  it('renders an accordion below the threshold, only rendering the active section', () => {
    renderContainer(400);
    expect(screen.queryByRole('link', { name: 'Spelers' })).not.toBeInTheDocument();
    expect(screen.getByText('content-teams')).toBeInTheDocument();
    expect(screen.queryByText('content-players')).not.toBeInTheDocument();
  });
});
