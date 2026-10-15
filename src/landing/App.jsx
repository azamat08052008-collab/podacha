import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { TelegramLogo } from '@phosphor-icons/react/dist/csr/TelegramLogo'
import { Plus } from '@phosphor-icons/react/dist/csr/Plus'
import { PencilSimpleLine } from '@phosphor-icons/react/dist/csr/PencilSimpleLine'
import { ChatCircleDots } from '@phosphor-icons/react/dist/csr/ChatCircleDots'
import { Coins } from '@phosphor-icons/react/dist/csr/Coins'
import Hero from './Hero'
import Flow from './Flow'
import Demos from './Demos'
import { TG, EMAIL } from './shared'
import cappuccino from '../assets/img/kofe/cappuccino.webp'
import logo from '../assets/logo.webp'

const ease = [0.16, 1, 0.3, 1]

function Reveal({ children, className, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  return (
    <>
      <nav className="nav">
        <a href="#top" className="logo"><img className="logo-mark" src={logo} alt="" />Подача</a>
        <div className="nav-links">
          <a href="#how">Как работает</a>
          <a href="#demo">Демо</a>
          <a href="#price">Цена</a>
          <a href="#faq">Вопросы</a>
        </div>
        <a className="btn btn-primary btn-sm" href={TG} target="_blank" rel="noreferrer" aria-label="Написать в Telegram">
          <TelegramLogo size={18} weight="fill" /> <span className="nav-cta-text">Написать в Telegram</span>
        </a>
      </nav>

      <main id="top">
        <Hero />
        <Flow />
        <Demos />
        <Benefits />
        <Pricing />
        <Faq />
        <Final />
      </main>

      <footer className="footer">
        <span>Азамат Назмутдинов, разработчик</span>
        <a href={TG} target="_blank" rel="noreferrer">@galossn</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </footer>
    </>
  )
}

function Benefits() {
  return (
    <section className="benefits">
      <Reveal><h2 className="h2">Что получает заведение</h2></Reveal>
      <div className="bento">
        <Reveal className="b-cell b-photo">
          <img src={cappuccino} alt="Капучино из демо-меню кофейни" />
          <div className="b-photo-text">
            <h3>Меню, которое хочется листать</h3>
            <p>Фото блюд и дизайн под ваше заведение, а не общий шаблон.</p>
          </div>
        </Reveal>
        <Reveal className="b-cell" delay={0.08}>
          <PencilSimpleLine size={28} className="b-icon" />
          <h3>Меню меняется в тот же день</h3>
          <p>Новое блюдо, другая цена или стоп-лист без перепечатки.</p>
        </Reveal>
        <Reveal className="b-cell b-accent" delay={0.16}>
          <ChatCircleDots size={28} className="b-icon" />
          <h3>Заказы в Telegram</h3>
          <p>Группа официантов и кнопка «Принял». Новые программы ставить не нужно.</p>
        </Reveal>
        <Reveal className="b-cell b-wide" delay={0.1}>
          <Coins size={28} className="b-icon" />
          <div>
            <h3>Без процента с заказов</h3>
            <p>Вы платите за запуск, а не отдаёте долю выручки агрегатору. Гостю ничего не нужно скачивать.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="pricing" id="price">
      <Reveal className="price-main">
        <div className="price-big">14 дней</div>
        <h2 className="h2">бесплатно на ваших столах</h2>
        <p className="lead">Ставим меню на несколько столов и смотрим, заказывают ли гости. Не понравится, просто убираем таблички.</p>
      </Reveal>
      <Reveal className="price-rows" delay={0.1}>
        <div className="price-row">
          <div>
            <h3>Запуск</h3>
            <p>Меню в стиле заведения, бот для официантов, QR-таблички с номерами столов для печати.</p>
          </div>
          <div className="price-sum">от 10 000 ₽</div>
        </div>
        <div className="price-row">
          <div>
            <h3>Доработки после запуска</h3>
            <p>Первые две недели правки бесплатно. Дальше по часам, когда понадобится.</p>
          </div>
          <div className="price-sum">от 500 ₽/час</div>
        </div>
      </Reveal>
    </section>
  )
}

const FAQ = [
  ['У нас уже есть iiko или r_keeper. Это их заменит?', 'Нет, касса остаётся как есть. Меню просто передаёт заказ официанту быстрее, чем он дойдёт до стола. Официант пробивает заказ в кассе как обычно.'],
  ['Гостю нужно что-то устанавливать?', 'Нет. Камера телефона открывает меню в браузере. Регистрации нет, имя и телефон гостя не собираются.'],
  ['Кто меняет меню, когда что-то закончилось?', 'Вы присылаете изменения, я обновляю в тот же день. Если меняете часто, сделаю простую таблицу, которую вы правите сами.'],
  ['Что если у гостя нет интернета?', 'Если связь пропала в момент отправки, меню скажет об этом и предложит позвать официанта. Заказ не пропадёт молча.'],
  ['Сколько стоит в месяц?', 'Обычной загрузки кафе хватает бесплатного тарифа хостинга. Платите только за доработки, если они понадобятся.'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  const reduce = useReducedMotion()
  return (
    <section className="faq" id="faq">
      <Reveal><h2 className="h2">Частые вопросы</h2></Reveal>
      <div className="faq-list">
        {FAQ.map(([q, a], i) => (
          <div key={q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
            <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span>
              <motion.span className="faq-icon" animate={{ rotate: open === i ? 45 : 0 }}><Plus size={20} weight="bold" /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className="faq-a"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function Final() {
  return (
    <section className="final">
      <Reveal>
        <h2 className="final-title">Сделаю демо на вашем меню за день</h2>
        <p className="lead">Пришлите фото меню или ссылку на карточку в картах. Покажу, как оно будет выглядеть у гостей.</p>
        <a className="btn btn-primary btn-lg" href={TG} target="_blank" rel="noreferrer"><TelegramLogo size={22} weight="fill" /> Написать в Telegram</a>
      </Reveal>
    </section>
  )
}
