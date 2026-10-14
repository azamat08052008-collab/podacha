import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { TelegramLogo } from '@phosphor-icons/react/dist/csr/TelegramLogo'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import { X } from '@phosphor-icons/react/dist/csr/X'

// Имитация сообщения в Telegram-группе официантов: через пару секунд «официант» жмёт «Принял».
export default function WaiterCard({ venue, order, onAccepted, onClose }) {
  const reduce = useReducedMotion()
  const [pressing, setPressing] = useState(false)

  useEffect(() => {
    if (!order || order.accepted) return
    setPressing(false)
    const t1 = setTimeout(() => setPressing(true), 1700)
    const t2 = setTimeout(onAccepted, 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [order?.at])

  // Принятый заказ сам уходит через несколько секунд, чтобы не закрывать вкладки меню
  useEffect(() => {
    if (!order?.accepted) return
    const t = setTimeout(onClose, 6000)
    return () => clearTimeout(t)
  }, [order?.accepted, order?.at])

  const time = order && new Date(order.at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  return (
    <AnimatePresence>
      {order && (
        <motion.aside
          key={order.at}
          className="wc"
          aria-live="polite"
          initial={reduce ? { opacity: 0 } : { y: -40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { y: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: reduce ? 0 : 0.35 }}
        >
          <div className="wc-caption">Так заказ видит официант</div>
          <div className="wc-card">
            <div className="wc-top">
              <TelegramLogo size={18} weight="fill" className="wc-tg" />
              <span>Официанты · {venue.name}</span>
              <span className="wc-time">{time}</span>
              <button className="wc-x" onClick={onClose} aria-label="Скрыть"><X size={16} /></button>
            </div>
            <div className="wc-title">Новый заказ · стол {order.table}</div>
            <ul className="wc-lines">
              {order.lines.map((l) => (
                <li key={l.name}><span>{l.qty} × {l.name}</span><span>{l.qty * l.price} ₽</span></li>
              ))}
            </ul>
            {order.comment && <div className="wc-comment">«{order.comment}»</div>}
            <div className="wc-total">Итого {order.total} ₽</div>
            <motion.div
              className={`wc-btn ${order.accepted ? 'is-done' : ''}`}
              animate={pressing && !order.accepted && !reduce ? { scale: 0.94 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {order.accepted ? <><Check size={16} weight="bold" /> Принято · {venue.waiter}</> : 'Принял'}
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
