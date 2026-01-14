import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page403 from './Page403';

describe('Page403 Component', () => {
  it('should render without crashing', () => {
    render(<Page403 />);
    expect(screen.getByText('ERROR 403')).toBeInTheDocument();
  });

  it('should display correct error title', () => {
    render(<Page403 />);
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  it('should display error description', () => {
    render(<Page403 />);
    expect(
      screen.getByText(/You don't have permission to view this page/i)
    ).toBeInTheDocument();
  });

  it('should suggest contacting support', () => {
    render(<Page403 />);
    expect(
      screen.getByText(/contact support if you believe this is an error/i)
    ).toBeInTheDocument();
  });

  it('should display SVG warning icon', () => {
    const { container } = render(<Page403 />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct container class', () => {
    const { container } = render(<Page403 />);
    expect(container.querySelector('.page-403-container')).toBeInTheDocument();
  });
});
