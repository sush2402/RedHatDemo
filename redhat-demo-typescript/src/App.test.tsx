import React from 'react';
import { render, screen, fireEvent, waitForElement } from '@testing-library/react';
import App from './App';
import axiosMock from 'axios'


jest.mock('axios')

test('render search div', () => {
  render(<div data-testid='searchBox' />);
  const element = screen.getByTestId('searchBox');
  expect(element).toBeInTheDocument();
})

test('render filter div', () => {
  render(<div data-testid='filterBox' />);
  const element = screen.getByTestId('filterBox');
  expect(element).toBeInTheDocument();
})


it('debounce API', async () => {
  const { getByTestId, getByText } = render(<App />); 

  fireEvent.click(getByTestId('inputId'))

  const str = await waitForElement(() => getByText('test')) 

  expect(str).toHaveTextContent('1')
})

it('should load and display the data', async () => {
  const url = '/users/username/repos'
  const { getByTestId } = render(<App />)

  axiosMock.get.mockResolvedValueOnce({
    data: { name: 'test' },
  })

  fireEvent.click(getByTestId('fetch-data'))

  expect(axiosMock.get).toHaveBeenCalledTimes(1)
  expect(axiosMock.get).toHaveBeenCalledWith(url)
})
