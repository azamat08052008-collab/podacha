import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'motion/react'
import { QrCode } from '@phosphor-icons/react/dist/csr/QrCode'
import { HandTap } from '@phosphor-icons/react/dist/csr/HandTap'
import { BellRinging } from '@phosphor-icons/react/dist/csr/BellRinging'

const STEPS = [
  { icon: QrCode, title: 'Гость сканирует QR', text: 'Табличка на столе с номером. Камера телефона, без приложений и регистрации.' },
  { icon: HandTap, title: 'Собирает заказ', text: 'Листает меню с фото, добавляет блюда, пишет комментарий и отправляет.' },
  { icon: BellRinging, title: 'Официант принимает', text: 'Заказ с номером стола приходит в Telegram-группу. Одна кнопка «Принял».' },
]

export default function Flow() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })

  return (
    <section className="flow" id="how" ref={ref}>
      <h2 className="h2">Как это работает</h2>
      <div className="flow-track">
        <div className="flow-line" aria-hidden="true">
          <motion.div className="flow-line-fg" style={{ scaleX: reduce ? 1 : scrollYProgress }} />
        </div>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            className="flow-step"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flow-node"><s.icon size={26} /></div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
