import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Basket } from '@phosphor-icons/react/dist/csr/Basket'

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export default function CartBar({ count, total, onOpen }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          className="m-cartbar"
          onClick={onOpen}
          initial={reduce ? false : { y: 120 }}
          animate={{ y: 0 }}
          exit={reduce ? undefined : { y: 120 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <Basket size={22} />
          <span>{count} {plural(count, 'позиция', 'позиции', 'позиций')}</span>
          <motion.span key={total} className="m-cartbar-total" initial={reduce ? false : { y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }}>
            {total} ₽
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
