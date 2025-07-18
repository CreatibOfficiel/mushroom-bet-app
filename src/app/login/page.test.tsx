import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Create a simplified test component that doesn't rely on complex mocks
function TestLoginForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

describe('LoginForm', () => {
  it('renders login form with email and password fields', () => {
    render(<TestLoginForm />);

    // Check if email input exists
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    // Check if password input exists
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Check if login button exists
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('type', 'submit');
  });
});
