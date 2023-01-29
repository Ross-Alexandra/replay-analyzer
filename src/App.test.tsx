import { render, screen } from '@testing-library/react';
import { App } from './App';

beforeEach(() => {
    window.api = {
        test: jest.fn()
    };
});

afterEach(() => {
    window.api = undefined;
});

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Get Hacking!/i);
    expect(linkElement).toBeInTheDocument();
});
