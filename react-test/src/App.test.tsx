import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                id: 1,
                name: 'Laptop',
                category: 'electronics',
                price: 1299.99,
                stock: 5,
              },
            ]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows loading then product names', async () => {
    render(<App />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument()
    })
    expect(screen.getByText(/1 items/)).toBeInTheDocument()
  })

  it('shows error when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 500 }))),
    )
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Failed to load/)
    })
  })
})
