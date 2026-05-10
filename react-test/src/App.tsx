import { useEffect, useState } from 'react'
import { fetchProducts, type Product } from './api'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Something went wrong')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <main className="app">
        <h1>Products</h1>
        <p className="error" role="alert">
          {error}
        </p>
        <p className="hint">
          Start the API (springboot-test on :8080 or nodejs-test on :3001) and
          set <code>VITE_PROXY_TARGET</code> if needed.
        </p>
      </main>
    )
  }

  if (products === null) {
    return (
      <main className="app">
        <h1>Products</h1>
        <p className="loading">Loading…</p>
      </main>
    )
  }

  return (
    <main className="app">
      <h1>Products</h1>
      <p className="meta">{products.length} items</p>
      <ul className="list">
        {products.map((p) => (
          <li key={p.id}>
            <span className="name">{p.name}</span>
            <span className="detail">
              {p.category} · ${p.price.toFixed(2)} · stock {p.stock}
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
