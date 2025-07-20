import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Home from '../../components/Home';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        {component}
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders welcome message', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/Welcome to Sandy's Pet Care Solution/i)).toBeInTheDocument();
  });

  test('renders all pet category cards', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/Dog Supplies/i)).toBeInTheDocument();
    expect(screen.getByText(/Cat Supplies/i)).toBeInTheDocument();
    expect(screen.getByText(/Bird Supplies/i)).toBeInTheDocument();
    expect(screen.getByText(/Fish & Aquarium/i)).toBeInTheDocument();
    expect(screen.getByText(/Small Animals/i)).toBeInTheDocument();
    expect(screen.getByText(/Reptiles/i)).toBeInTheDocument();
  });

  test('renders pet category icons', () => {
    renderWithProviders(<Home />);
    
    // Check for emoji icons
    expect(screen.getByText('🐕')).toBeInTheDocument();
    expect(screen.getByText('🐱')).toBeInTheDocument();
    expect(screen.getByText('🐦')).toBeInTheDocument();
    expect(screen.getByText('🐠')).toBeInTheDocument();
    expect(screen.getByText('🐹')).toBeInTheDocument();
    expect(screen.getByText('🦎')).toBeInTheDocument();
  });

  test('navigates to correct category when dog supplies clicked', () => {
    renderWithProviders(<Home />);
    
    const dogCard = screen.getByText(/Dog Supplies/i).closest('div');
    fireEvent.click(dogCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=dog');
  });

  test('navigates to correct category when cat supplies clicked', () => {
    renderWithProviders(<Home />);
    
    const catCard = screen.getByText(/Cat Supplies/i).closest('div');
    fireEvent.click(catCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=cat');
  });

  test('navigates to correct category when bird supplies clicked', () => {
    renderWithProviders(<Home />);
    
    const birdCard = screen.getByText(/Bird Supplies/i).closest('div');
    fireEvent.click(birdCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=bird');
  });

  test('navigates to correct category when fish supplies clicked', () => {
    renderWithProviders(<Home />);
    
    const fishCard = screen.getByText(/Fish & Aquarium/i).closest('div');
    fireEvent.click(fishCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=fish');
  });

  test('navigates to correct category when small animals clicked', () => {
    renderWithProviders(<Home />);
    
    const smallAnimalsCard = screen.getByText(/Small Animals/i).closest('div');
    fireEvent.click(smallAnimalsCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=small-animals');
  });

  test('navigates to correct category when reptiles clicked', () => {
    renderWithProviders(<Home />);
    
    const reptilesCard = screen.getByText(/Reptiles/i).closest('div');
    fireEvent.click(reptilesCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?category=reptiles');
  });

  test('renders features section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/Why Choose Sandy's Pet Care Solution/i)).toBeInTheDocument();
    expect(screen.getByText(/Fast Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Expert Support/i)).toBeInTheDocument();
  });

  test('does not render Secure Payment feature', () => {
    renderWithProviders(<Home />);
    
    // This should not be present as we removed it in security hardening
    expect(screen.queryByText(/Secure Payment/i)).not.toBeInTheDocument();
  });

  test('category cards have hover effects', () => {
    renderWithProviders(<Home />);
    
    const dogCard = screen.getByText(/Dog Supplies/i).closest('div');
    
    // Check that cursor pointer style is applied
    expect(dogCard).toHaveStyle('cursor: pointer');
  });
});