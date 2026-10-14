import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export const TG = 'https://t.me/galossn'
export const EMAIL = 'azamat08052008@gmail.com'

export const DEMOS = [
  { id: 'kofe', name: 'Пенка', kind: 'Кофейня', bg: '#f6ece9', text: 'Карточки с фото, мягкие тона. Подходит кофейням и пекарням, где покупают глазами.' },
  { id: 'pub', name: 'Солод', kind: 'Паб', bg: '#e6ece4', text: 'Плотный список и крупные цены. Для бара, где важно быстро найти нужное и дозаказать.' },
  { id: 'tatar', name: 'Ак чәчәк', kind: 'Татарская кухня', bg: '#efecf3', text: 'Меню как в журнале, с описанием блюд. Для ресторана, где гостю нужно рассказать о кухне.' },
]

export const demoUrl = (id) => `./${id}/?t=4`

export function useQr(path) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    const url = new URL(path, location.href).href
    QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#1b2230', light: '#0000' } })
      .then((svg) => setSvg(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`))
      .catch(() => setSvg(''))
  }, [path])
  return svg
}

// Телефон-рамка с живым демо внутри. Демо рендерится в 390px и масштабируется под рамку.
export function Phone({ src, width = 300, title }) {
  const scale = width / 390
  return (
    <div className="phone" style={{ width: width + 20, height: Math.round(844 * scale) + 20 }}>
      <div className="phone-screen" style={{ width, height: Math.round(844 * scale) }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{ width: 390, height: 844, transform: `scale(${scale})` }}
        />
        <a className="phone-open" href={src}><span>Открыть меню</span></a>
      </div>
    </div>
  )
}
