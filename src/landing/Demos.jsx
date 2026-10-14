import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { DEMOS, Phone, demoUrl, useQr } from './shared'

export default function Demos() {
  const [active, setActive] = useState(DEMOS[0].id)
  const reduce = useReducedMotion()
  const demo = DEMOS.find((d) => d.id === active)
  const qr = useQr(demoUrl(active))

  return (
    <motion.section
      className="demos"
      id="demo"
      animate={{ backgroundColor: demo.bg }}
      transition={{ duration: reduce ? 0 : 0.7 }}
    >
      <div className="demos-copy">
        <h2 className="h2">Три заведения, три характера</h2>
        <p className="lead">Дизайн делаю под стиль заведения. Попробуйте заказать: сверху появится то, что увидит официант.</p>

        <div className="demos-list" role="tablist">
          {DEMOS.map((d) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={d.id === active}
              className={`demos-item ${d.id === active ? 'is-on' : ''}`}
              onClick={() => setActive(d.id)}
            >
              <span className="demos-kind">{d.kind}</span>
              <span className="demos-name">{d.name}</span>
              <AnimatePresence initial={false}>
                {d.id === active && (
                  <motion.span
                    className="demos-text"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {d.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <div className="demos-qr">
          {qr && <img src={qr} alt={`QR-код демо ${demo.name}`} />}
          <div>
            <div className="demos-qr-title">Откройте на своём телефоне</div>
            <a href={demoUrl(active)} target="_blank" rel="noreferrer" className="link">Или в новой вкладке <ArrowUpRight size={14} weight="bold" /></a>
          </div>
        </div>
      </div>

      <div className="demos-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 40, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -30, rotate: -3, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <Phone src={demoUrl(active)} width={330} title={`Демо меню: ${demo.name}`} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
