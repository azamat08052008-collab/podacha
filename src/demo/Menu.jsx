import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Plus } from '@phosphor-icons/react/dist/csr/Plus'
import { Minus } from '@phosphor-icons/react/dist/csr/Minus'
import { photo, findItem } from './venues'
import { useCart } from './useCart'
import CartBar from './CartBar'
import CartSheet from './CartSheet'
import WaiterCard from './WaiterCard'

const ease = [0.16, 1, 0.3, 1]

function tableFromQuery() {
  const t = Number(new URLSearchParams(location.search).get('t'))
  return Number.isInteger(t) && t >= 1 && t <= 40 ? t : 4
}

export default function Menu({ id, venue }) {
  const table = useMemo(tableFromQuery, [])
  const [active, setActive] = useState(venue.tabs[0].key)
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const cart = useCart(venue)
  const reduce = useReducedMotion()
  const tab = venue.tabs.find((t) => t.key === active)

  function pick(key) {
    setActive(key)
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="m">
      <header className="m-head">
        <div>
          <div className="m-name">{venue.name}</div>
          <div className="m-kind">{venue.kind}</div>
        </div>
        <span className="m-table">Стол {table}</span>
      </header>

      <p className="m-hello">{venue.hello}</p>

      {venue.feature && <Feature id={id} venue={venue} cart={cart} />}

      <nav className="m-tabs" role="tablist">
        {venue.tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={t.key === active}
            className={`m-tab ${t.key === active ? 'is-on' : ''}`}
            onClick={() => pick(t.key)}
          >
            {t.key === active && !reduce && <motion.span layoutId="tab-bg" className="m-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            {t.key === active && reduce && <span className="m-tab-bg" />}
            <span className="m-tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.main
          key={active}
          className={`m-body m-${venue.layout}`}
          initial={reduce ? false : 'hide'}
          animate="show"
          exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
          variants={{ show: { transition: { staggerChildren: 0.045 } } }}
        >
          {venue.layout === 'editorial' && <h2 className="m-group">{tab.label}</h2>}
          {tab.items.map((it) => (
            <motion.article
              key={it.n}
              className={`m-item ${venue.layout === 'grid' && !it.img ? 'gi-plain' : ''}`}
              variants={{ hide: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
            >
              {venue.layout === 'grid' && <GridItem id={id} it={it} cart={cart} />}
              {venue.layout === 'list' && <ListItem id={id} it={it} cart={cart} />}
              {venue.layout === 'editorial' && <EditorialItem id={id} it={it} cart={cart} />}
            </motion.article>
          ))}
        </motion.main>
      </AnimatePresence>

      <CartBar count={cart.count} total={cart.total} onOpen={() => setOpen(true)} />
      <CartSheet
        open={open}
        onClose={() => setOpen(false)}
        cart={cart}
        table={table}
        waiter={venue.waiter}
        accepted={order?.accepted}
        onSent={(lines, total, comment) => setOrder({ lines, total, comment, table, at: Date.now(), accepted: false })}
      />
      <WaiterCard
        venue={venue}
        order={order}
        onAccepted={() => setOrder((o) => o && { ...o, accepted: true })}
        onClose={() => setOrder(null)}
      />
    </div>
  )
}

function Qty({ name, cart, label }) {
  const reduce = useReducedMotion()
  const qty = cart.cart[name] || 0
  if (!qty) {
    return (
      <motion.button whileTap={reduce ? undefined : { scale: 0.9 }} className="m-add" onClick={() => cart.add(name)} aria-label={`Добавить: ${name}`}>
        {label ? <span>{label}</span> : <Plus size={18} weight="bold" />}
      </motion.button>
    )
  }
  return (
    <div className="m-step">
      <button onClick={() => cart.remove(name)} aria-label={`Меньше: ${name}`}><Minus size={16} weight="bold" /></button>
      <motion.span key={qty} initial={reduce ? false : { scale: 1.5 }} animate={{ scale: 1 }}>{qty}</motion.span>
      <button onClick={() => cart.add(name)} aria-label={`Больше: ${name}`}><Plus size={16} weight="bold" /></button>
    </div>
  )
}

function GridItem({ id, it, cart }) {
  const src = photo(id, it.img)
  return (
    <>
      {src ? (
        <div className="gi-media">
          <img src={src} alt="" loading="lazy" />
          <div className="gi-qty"><Qty name={it.n} cart={cart} /></div>
        </div>
      ) : null}
      <h3 className="m-iname">{it.n}</h3>
      <p className="m-idesc">{it.d}</p>
      {src ? (
        <div className="m-price">{it.p} ₽</div>
      ) : (
        <div className="gi-foot"><span className="m-price">{it.p} ₽</span><Qty name={it.n} cart={cart} /></div>
      )}
    </>
  )
}

function ListItem({ id, it, cart }) {
  const src = photo(id, it.img)
  return (
    <>
      {src && <img className="li-thumb" src={src} alt="" loading="lazy" />}
      <div className="li-body">
        <h3 className="m-iname">{it.n}</h3>
        <p className="m-idesc">{it.d}</p>
      </div>
      <div className="li-side">
        <div className="m-price">{it.p}</div>
        <Qty name={it.n} cart={cart} />
      </div>
    </>
  )
}

function EditorialItem({ id, it, cart }) {
  const src = photo(id, it.img)
  return (
    <>
      {src && <img className="ei-photo" src={src} alt="" loading="lazy" />}
      <div className="ei-row">
        <h3 className="m-iname">{it.n}</h3>
        <span className="ei-dots" aria-hidden="true" />
        <div className="m-price">{it.p} ₽</div>
      </div>
      <p className="m-idesc">{it.d}</p>
      <Qty name={it.n} cart={cart} label="Добавить" />
    </>
  )
}

function Feature({ id, venue, cart }) {
  const item = { ...findItem(venue, venue.feature.n), ...venue.feature }
  return (
    <section className="m-feature">
      <img src={photo(id, item.img)} alt="" />
      <div className="mf-body">
        <div className="mf-label">Сегодня на кране</div>
        <h2 className="mf-name">{item.n}</h2>
        <p className="m-idesc">{item.note}</p>
        <div className="mf-foot">
          <span className="m-price">{item.p} ₽</span>
          <Qty name={item.n} cart={cart} />
        </div>
      </div>
    </section>
  )
}
