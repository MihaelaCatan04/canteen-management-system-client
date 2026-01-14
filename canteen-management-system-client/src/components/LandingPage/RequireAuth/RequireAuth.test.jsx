import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import useAuth from '../../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../../hooks/useAuth');

describe('RequireAuth Component', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const LoginPage = () => <div>Login Page</div>;
  const ForbiddenPage = () => <div>Forbidden Page</div>;

  const renderWithRouter = (allowedRoles, authState) => {
    useAuth.mockReturnValue({ auth: authState });

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route element={<RequireAuth allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('should allow access when user has correct role', () => {
    const authState = {
      accessToken: 'valid-token',
      role: ['STUDENT']
    };

    renderWithRouter(['STUDENT'], authState);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should allow access when user has one of multiple allowed roles', () => {
    const authState = {
      accessToken: 'valid-token',
      role: ['STUDENT']
    };

    renderWithRouter(['STUDENT', 'ADMIN'], authState);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to forbidden when user is authenticated but lacks required role', () => {
    const authState = {
      accessToken: 'valid-token',
      role: ['STUDENT']
    };

    renderWithRouter(['ADMIN'], authState);
    expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const authState = {
      accessToken: null,
      role: null
    };

    renderWithRouter(['STUDENT'], authState);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to login when auth object is empty', () => {
    renderWithRouter(['STUDENT'], {});
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should handle multiple roles in auth state', () => {
    const authState = {
      accessToken: 'valid-token',
      role: ['STUDENT', 'ADMIN']
    };

    renderWithRouter(['ADMIN'], authState);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
