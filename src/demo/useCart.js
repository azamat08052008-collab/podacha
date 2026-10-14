import { useState } from 'react'
import { findItem } from './venues'

export function useCart(venue) {
  const [cart, setCart] = useState({})

  const change = (name, delta) =>
    setCart((c) => {
      const q = Math.min(20, Math.max(0, (c[name] || 0) + delta))
      const next = { ...c }
      if (q) next[name] = q
      else delete next[name]
      return next
    })

  const lines = Object.entries(cart).map(([name, qty]) => ({ name, qty, price: findItem(venue, name).p }))
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)

  return { cart, lines, count, total, add: (n) => change(n, 1), remove: (n) => change(n, -1), clear: () => setCart({}) }
}
