import React, { createContext, Fragment, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { studio, whatsappLink } from './data/projects'
import { finePointer, formatMm, getLenis, gsap, markIntroDone, prefersReducedMotion, pxToMm, scrollToTarget, ScrollTrigger, useGsap } from './motion'

const logo = `${import.meta.env.BASE_URL}lopez-amoblamientos-logo.png`

/* ---------- Route curtain: covers, swaps the page, then lifts ---------- */

const CurtainContext = createContext(to => to)

export function CurtainProvider({ children }) {
  const navigate = useNavigate()
  const curtain = useRef(null)
  const busy = useRef(false)
  const go = useCallback(to => {
    if (prefersReducedMotion() || busy.current) { navigate(to); return }
    busy.current = true
    gsap.timeline({ defaults: { ease: 'expo.inOut' } })
      .set(curtain.current, { visibility: 'visible' })
      .fromTo(curtain.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75 })
      .fromTo('.curtain-mark', { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.35')
      .add(() => navigate(to))
      .to('.curtain-mark', { yPercent: -120, duration: 0.5, ease: 'expo.in' }, '+=0.15')
      .to(curtain.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9 }, '-=0.2')
      .set(curtain.current, { visibility: 'hidden' })
      .add(() => { busy.current = false })
  }, [navigate])
  return <CurtainContext.Provider value={go}>
    {children}
    <div className="curtain" ref={curtain} aria-hidden="true">
      <span className="curtain-mask"><span className="curtain-mark"><img src={logo} alt="" />Lopez Amoblamientos</span></span>
    </div>
  </CurtainContext.Provider>
}

// Internal link that plays the curtain between pages and smooth-scrolls for same-page anchors.
export function TLink({ to, onClick, children, ...props }) {
  const go = useContext(CurtainContext)
  const location = useLocation()
  const handle = event => {
    onClick?.(event)
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    const [path, hash] = to.split('#')
    if ((path || location.pathname) === location.pathname) {
      event.preventDefault()
      scrollToTarget(hash ? `#${hash}` : 0)
      return
    }
    event.preventDefault()
    go(to)
  }
  return <Link to={to} onClick={handle} {...props}>{children}</Link>
}

/* ---------- Scroll restoration + hash targets after a route change ---------- */

export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    scrollToTarget(0, { immediate: true })
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh()
      if (hash) scrollToTarget(hash)
    }, 140)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])
  return null
}

/* ---------- First-visit preloader: a tape measure runs out to 240 cm ---------- */

export function Preloader() {
  const [done, setDone] = useState(false)
  const scope = useGsap(root => {
    if (prefersReducedMotion()) { markIntroDone(); setDone(true); return }
    getLenis()?.stop()
    const num = root.querySelector('.pre-num')
    const count = { value: 0 }
    gsap.timeline({ onComplete: () => { getLenis()?.start(); setDone(true) } })
      .from('.pre-brand', { yPercent: 110, duration: 0.9 }, 0)
      .to('.pre-tape', { scaleX: 1, duration: 1.25, ease: 'power3.inOut' }, 0.1)
      .to(count, { value: 240, duration: 1.25, ease: 'power3.inOut', onUpdate: () => { num.textContent = Math.round(count.value) } }, 0.15)
      .to('.pre-row', { yPercent: -110, duration: 0.55, ease: 'expo.in', stagger: 0.05 }, '+=0.2')
      .add(markIntroDone, '-=0.05')
      .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
  })
  if (done) return null
  return <div className="preloader" ref={scope} aria-hidden="true">
    <div className="pre-inner">
      <span className="pre-mask"><span className="pre-row pre-brand"><img src={logo} alt="" />Lopez Amoblamientos</span></span>
      <span className="pre-mask"><span className="pre-row pre-count"><span className="pre-num">0</span><small>cm</small></span></span>
      <span className="pre-mask pre-mask-tape"><span className="pre-row pre-tape-wrap"><span className="pre-tape" /></span></span>
    </div>
  </div>
}

/* ---------- Header ---------- */

const navItems = [
  { to: '/#trabajos', label: 'Trabajos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/#proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  const menu = useRef(null)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > 240 && y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop(); else lenis?.start()
    document.body.classList.toggle('menu-open', open)
    if (!open || prefersReducedMotion() || !menu.current) return
    const tween = gsap.fromTo(menu.current.querySelectorAll('.menu-link, .menu-foot > *'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.9, delay: 0.15 })
    return () => tween.kill()
  }, [open])

  const isActive = to => (to.startsWith('/#') ? false : pathname.startsWith(to))

  return <>
    <header className={`site-header ${solid ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
      <TLink className="brand" to="/" aria-label="Lopez Amoblamientos, inicio">
        <img src={logo} alt="" width="40" height="40" />
        <span>Lopez Amoblamientos</span>
      </TLink>
      <nav className="nav" aria-label="Principal">
        {navItems.map(item => <TLink key={item.to} to={item.to} className={isActive(item.to) ? 'is-active' : ''}><span data-text={item.label}>{item.label}</span></TLink>)}
      </nav>
      <a className="btn btn-tiza btn-small header-cta" href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
      <button className="burger" type="button" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>
        <i /><i />
      </button>
    </header>
    <div id="menu" className={`menu ${open ? 'is-open' : ''}`} ref={menu} aria-hidden={!open} inert={!open}>
      <nav aria-label="Menú">
        {[{ to: '/', label: 'Inicio' }, ...navItems].map(item => <span className="menu-mask" key={item.to}><TLink className="menu-link" to={item.to} onClick={() => setOpen(false)}>{item.label}</TLink></span>)}
      </nav>
      <div className="menu-foot">
        <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={`mailto:${studio.email}`}>{studio.email}</a>
        <span>{studio.city}</span>
      </div>
    </div>
  </>
}

/* ---------- Scroll gauge: a ruler on the left edge that measures how far you've read ---------- */

export function ScrollRuler() {
  const marker = useRef(null)
  const value = useRef(null)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (marker.current) marker.current.style.transform = `translate3d(0, ${progress * (window.innerHeight - 120)}px, 0)`
      if (value.current) value.current.textContent = formatMm(Math.round(pxToMm(window.scrollY) / 10))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="ruler" aria-hidden="true">
    <div className="ruler-marker" ref={marker}><span><b ref={value}>0</b> cm</span></div>
  </div>
}

/* ---------- Custom cursor (fine pointers only) ---------- */

export function Cursor() {
  const ring = useRef(null)
  const dot = useRef(null)
  const label = useRef(null)
  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return undefined
    document.documentElement.classList.add('has-cursor')
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const move = e => { ringX(e.clientX); ringY(e.clientY); dotX(e.clientX); dotY(e.clientY); ring.current.classList.add('is-on'); dot.current.classList.add('is-on') }
    const over = e => {
      const labelled = e.target.closest('[data-cursor]')
      const interactive = e.target.closest('a, button, input, select, textarea, label, [role="slider"]')
      ring.current.classList.toggle('is-label', Boolean(labelled))
      ring.current.classList.toggle('is-hover', Boolean(interactive) && !labelled)
      dot.current.classList.toggle('is-hidden', Boolean(labelled))
      if (labelled) label.current.textContent = labelled.dataset.cursor
    }
    const leave = () => { ring.current.classList.remove('is-on'); dot.current.classList.remove('is-on') }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <>
    <div className="cursor-ring" ref={ring} aria-hidden="true"><span ref={label} /></div>
    <div className="cursor-dot" ref={dot} aria-hidden="true" />
  </>
}

/* ---------- Small motion helpers ---------- */

export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || !finePointer() || prefersReducedMotion()) return undefined
    const x = gsap.quickTo(node, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' })
    const y = gsap.quickTo(node, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' })
    const move = e => {
      const r = node.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * strength)
      y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const reset = () => { x(0); y(0) }
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', reset)
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset) }
  }, [strength])
  return <span className="magnetic" ref={ref}>{children}</span>
}

export function Words({ text }) {
  return text.split(' ').map((word, index) => <Fragment key={index}><span className="word">{word}</span>{' '}</Fragment>)
}

export function Lines({ lines }) {
  return lines.map(line => <span className="line" key={line}><span className="line-inner">{line}</span></span>)
}

// Draws a dimension line along its own content and labels it with the real on-screen size in millimetres.
export function Measured({ axis = 'x', children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const num = useRef(null)
  useLayoutEffect(() => {
    const node = ref.current
    const update = () => {
      const rect = node.getBoundingClientRect()
      num.current.textContent = formatMm(pxToMm(axis === 'x' ? rect.width : rect.height))
    }
    const observer = new ResizeObserver(update)
    observer.observe(node)
    update()
    return () => observer.disconnect()
  }, [axis])
  return <Tag ref={ref} className={`measured measured-${axis} ${className}`}>
    {children}
    <span className="dim" aria-hidden="true"><i className="dim-line" /><b className="dim-label"><span ref={num} /> mm</b></span>
  </Tag>
}

const hexToUnit = hex => [1, 3, 5].map(i => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3))

// Procedural wood: fine fibres warped by slow noise give a wavy grain; a broad layer adds tonal bands.
export function WoodSwatch({ wood, seed }) {
  const [r, g, b] = hexToUnit(wood.grain)
  const tint = `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b}`
  const fibre = `grain-${seed}`
  const bands = `bands-${seed}`
  return <svg className="wood-svg" viewBox="0 0 200 320" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id={fibre} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={wood.flat ? '0.9 0.9' : '0.42 0.006'} numOctaves="2" seed={seed} result="lines" />
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.018" numOctaves="2" seed={seed + 3} result="warp" />
        <feDisplacementMap in="lines" in2="warp" scale={wood.flat ? 0 : 24} xChannelSelector="R" yChannelSelector="G" result="wavy" />
        <feColorMatrix in="wavy" type="matrix" values={`${tint} ${wood.flat ? '0.6 0 0 0 -0.22' : '3.2 0 0 0 -1.35'}`} />
      </filter>
      <filter id={bands} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05 0.0025" numOctaves="3" seed={seed + 7} />
        <feColorMatrix type="matrix" values={`${tint} ${wood.flat ? '0 0 0 0 0' : '2.4 0 0 0 -0.95'}`} />
      </filter>
      <linearGradient id={`sheen-${seed}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".2" />
        <stop offset=".45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".16" />
      </linearGradient>
    </defs>
    <rect width="200" height="320" fill={wood.base} />
    <rect width="200" height="320" filter={`url(#${bands})`} />
    <rect width="200" height="320" filter={`url(#${fibre})`} />
    <rect width="200" height="320" fill={`url(#sheen-${seed})`} />
  </svg>
}

/* ---------- Footer ---------- */

export function Footer() {
  const scope = useGsap(root => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.querySelectorAll('.footer-mark .char'), {
        yPercent: 105, stagger: 0.025, duration: 1.2,
        scrollTrigger: { trigger: root.querySelector('.footer-mark'), start: 'top 95%' },
      })
    })
  })
  const mark = 'Lopez Amoblamientos'
  return <footer className="footer" ref={scope}>
    <div className="footer-grid">
      <div className="footer-about">
        <img src={logo} alt="" width="56" height="56" />
        <p>Carpintería a medida en {studio.city}. Medimos, diseñamos, fabricamos e instalamos.</p>
      </div>
      <nav className="footer-col" aria-label="Pie de página">
        <TLink to="/#trabajos">Trabajos</TLink>
        <TLink to="/servicios">Servicios</TLink>
        <TLink to="/#proceso">Proceso</TLink>
        <TLink to="/contacto">Contacto</TLink>
      </nav>
      <div className="footer-col">
        <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={`mailto:${studio.email}`}>{studio.email}</a>
        <a href={studio.instagram} target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </div>
    <div className="footer-mark" aria-hidden="true">
      {mark.split('').map((char, index) => <span className="char" key={index}>{char === ' ' ? ' ' : char}</span>)}
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Lopez Amoblamientos</span>
      <button type="button" onClick={() => scrollToTarget(0)}>Volver arriba</button>
    </div>
  </footer>
}

export { logo }
