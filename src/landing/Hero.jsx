import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { TelegramLogo } from '@phosphor-icons/react/dist/csr/TelegramLogo'
import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import { Phone, TG, demoUrl, useQr } from './shared'

const ease = [0.16, 1, 0.3, 1]

const ORDERS = [
  { table: 4, lines: ['2 × Капучино', '1 × Круассан с миндалём'], total: 670, waiter: 'Даша' },
  { table: 7, lines: ['3 × Нефильтрованное светлое', '1 × Крылья барбекю'], total: 1360, waiter: 'Тимур' },
  { table: 2, lines: ['2 × Эчпочмак', '1 × Чай с травами'], total: 490, waiter: 'Алсу' },
]

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  // Наклон сцены за курсором
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useSpring(useTransform(px, [-1, 1], [-12, 12]), { stiffness: 120, damping: 20 })
  const rotX = useSpring(useTransform(py, [-1, 1], [8, -8]), { stiffness: 120, damping: 20 })

  // Скролл: телефон уходит назад, табличка и уведомление расходятся с разной скоростью
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const phoneTilt = useTransform(scrollYProgress, [0, 1], [0, 18])
  const tentY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const noteY = useTransform(scrollYProgress, [0, 1], [0, -60])

  function onMove(e) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const qr = useQr(demoUrl('kofe'))

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-copy" initial={reduce ? false : 'hide'} animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
        <motion.h1 variants={fadeUp}>Меню, из которого сразу заказывают</motion.h1>
        <motion.p variants={fadeUp} className="hero-sub">
          QR на столе. Гость выбирает с телефона, официант получает заказ в Telegram и нажимает «Принял».
        </motion.p>
        <motion.div variants={fadeUp} className="hero-cta">
          <a className="btn btn-primary" href="#demo">Открыть демо <ArrowDown size={18} weight="bold" /></a>
          <a className="btn btn-ghost" href={TG} target="_blank" rel="noreferrer"><TelegramLogo size={20} weight="fill" /> Написать в Telegram</a>
        </motion.div>
      </motion.div>

      <div className="hero-stage" onPointerMove={onMove} onPointerLeave={() => { px.set(0); py.set(0) }}>
        <motion.div className="hero-scene" style={reduce ? undefined : { rotateY: rotY, rotateX: rotX }}>
          <motion.div
            className="tent"
            style={reduce ? undefined : { y: tentY }}
            initial={reduce ? false : { opacity: 0, x: -40, rotate: -14 }}
            animate={{ opacity: 1, x: 0, rotate: -7 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
          >
            <div className="tent-qr">{qr && <img src={qr} alt="QR-код демо-меню" />}</div>
            <div className="tent-text">Наведите камеру и закажите к столу</div>
            <div className="tent-table">Стол 4</div>
          </motion.div>

          <motion.div className="hero-phone" style={reduce ? undefined : { y: phoneY, rotateX: phoneTilt }}>
            <motion.div initial={reduce ? false : { opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.15 }}>
              <Phone src={demoUrl('kofe')} width={290} title="Демо меню кофейни" />
            </motion.div>
          </motion.div>

          <motion.div className="note-wrap" style={reduce ? undefined : { y: noteY, z: 60 }}>
            <OrderLoop reduce={reduce} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const fadeUp = { hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }

// Уведомления официанту по кругу: появилось, «Принял», ушло.
function OrderLoop({ reduce }) {
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduce) return
    const t1 = setTimeout(() => setDone(true), 2200)
    const t2 = setTimeout(() => { setDone(false); setI((n) => (n + 1) % ORDERS.length) }, 4600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [i, reduce])

  const o = ORDERS[i]
  const accepted = reduce || done
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={i}
        className="note"
        initial={reduce ? false : { opacity: 0, y: -26, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      >
        <div className="note-top"><TelegramLogo size={16} weight="fill" className="note-tg" /> Официанты</div>
        <div className="note-title">Новый заказ · стол {o.table}</div>
        {o.lines.map((l) => <div key={l} className="note-line">{l}</div>)}
        <div className="note-total">Итого {o.total} ₽</div>
        <motion.div className={`note-btn ${accepted ? 'is-done' : ''}`} layout={!reduce}>
          {accepted ? <><Check size={14} weight="bold" /> Принято · {o.waiter}</> : 'Принял'}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
