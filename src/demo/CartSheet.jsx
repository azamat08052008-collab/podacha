import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from '@phosphor-icons/react/dist/csr/X'
import { Minus } from '@phosphor-icons/react/dist/csr/Minus'
import { Plus } from '@phosphor-icons/react/dist/csr/Plus'
import { Check } from '@phosphor-icons/react/dist/csr/Check'

// Демо: заказ никуда не уходит. Вместо запроса к серверу показываем карточку официанта (WaiterCard).
export default function CartSheet({ open, onClose, cart, table, waiter, accepted, onSent }) {
  const reduce = useReducedMotion()
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('idle')

  function submit() {
    setStatus('sending')
    setTimeout(() => {
      onSent(cart.lines, cart.total, comment.trim())
      cart.clear()
      setComment('')
      setStatus('done')
    }, 650)
  }

  function close() {
    if (status === 'sending') return
    onClose()
    if (status === 'done') setStatus('idle')
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sh-backdrop" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="sh" role="dialog" aria-modal="true" aria-label="Корзина"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
          >
            <div className="sh-grip" aria-hidden="true" />
            <button className="sh-close" onClick={close} aria-label="Закрыть"><X size={20} /></button>

            {status === 'done' ? (
              <div className="sh-done">
                <motion.div
                  className="sh-done-mark"
                  initial={reduce ? false : { scale: 0.4, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                >
                  <Check size={34} weight="bold" />
                </motion.div>
                <h2>Заказ отправлен</h2>
                <p>
                  Стол {table}.{' '}
                  {accepted ? `Заказ принят, официант ${waiter} уже идёт.` : 'Ждём, когда официант примет заказ.'}
                </p>
                <button className="m-btn" onClick={close}>Вернуться в меню</button>
              </div>
            ) : (
              <>
                <h2>Ваш заказ</h2>
                <div className="sh-lines">
                  {cart.lines.map((l) => (
                    <div className="sh-line" key={l.name}>
                      <span className="sh-line-name">{l.name}</span>
                      <div className="m-step">
                        <button onClick={() => cart.remove(l.name)} aria-label={`Меньше: ${l.name}`}><Minus size={16} weight="bold" /></button>
                        <span>{l.qty}</span>
                        <button onClick={() => cart.add(l.name)} aria-label={`Больше: ${l.name}`}><Plus size={16} weight="bold" /></button>
                      </div>
                      <span className="sh-line-sum">{l.qty * l.price} ₽</span>
                    </div>
                  ))}
                  {cart.lines.length === 0 && <p className="sh-empty">Корзина пуста</p>}
                </div>

                <div className="sh-total">
                  <span>Итого</span>
                  <span>{cart.total} ₽</span>
                </div>

                <label className="sh-field">
                  <span>Комментарий</span>
                  <textarea
                    rows={2} maxLength={300} value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: без сахара, принести вместе"
                  />
                </label>

                <button className="m-btn sh-submit" onClick={submit} disabled={status === 'sending' || cart.lines.length === 0}>
                  {status === 'sending' ? 'Отправляем…' : `Отправить официанту · стол ${table}`}
                </button>
                <p className="sh-note">Это демонстрация: заказ никуда не уходит. Сверху появится то, что увидит официант.</p>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
