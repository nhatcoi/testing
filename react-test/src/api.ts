export type Product = {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

/** Use absolute URL in production via Vite env; dev uses same-origin `/api` + proxy. */
export function productsUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (base) return `${base.replace(/\/$/, '')}/api/products`
  return '/api/products'
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(productsUrl())
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
  return res.json() as Promise<Product[]>
}
