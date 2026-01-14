import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page404 from './Page404';

describe('Page404 Component', () => {
  it('should render without crashing', () => {
    render(<Page404 />);
    expect(screen.getByText('ERROR 404')).toBeInTheDocument();
  });

  it('should display correct error title', () => {
    render(<Page404 />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display error description', () => {
    render(<Page404 />);
    expect(
      screen.getByText(/The page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it('should display SVG warning icon', () => {
    const { container } = render(<Page404 />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct container class', () => {
    const { container } = render(<Page404 />);
    expect(container.querySelector('.page-404-container')).toBeInTheDocument();
  });
});
