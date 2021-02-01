import { render, screen } from '@testing-library/react';
import WeatherApp from './WeatherApp';

test('renders learn react link', () => {
  render(<WeatherApp />);
  const linkElement = screen.getByText(/Whats the weather today/i);
  expect(linkElement).toBeInTheDocument();
});
