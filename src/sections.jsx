import React, { useEffect, useRef, useState } from 'react'
import { projects, services, steps, studio, whatsappLink, woods } from './data/projects'
import { finePointer, gsap, introReady, prefersReducedMotion, ScrollTrigger, useGsap } from './motion'
import { Lines, Magnetic, Measured, TLink, WoodSwatch, Words } from './components'

const motionOk = '(prefers-reduced-motion: no-preference)'

/* ---------- Hero ---------- */

export function Hero() {
  const scope = useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      const title = root.querySelector('.hero-title')
      gsap.set(root.querySelectorAll('.line-inner'), { yPercent: 115 })
      gsap.set(root.querySelector('.hero-photo'), { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(root.querySelectorAll('.dim'), { '--draw': 0 })
      gsap.set(root.querySelectorAll('.dim-label, .hero-sub, .hero-actions > *, .hero-note'), { autoAlpha: 0, y: 24 })

      const intro = gsap.timeline({ paused: true })
        .to(root.querySelectorAll('.line-inner'), { yPercent: 0, stagger: 0.1, duration: 1.3 }, 0)
        .fromTo(title, { '--wdth': 112 }, { '--wdth': 72, duration: 2.2, ease: 'expo.inOut' }, 0)
        .to(root.querySelector('.hero-photo'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0.15)
        .fromTo(root.querySelector('.kerf'), { top: '100%', autoAlpha: 1 }, { top: '0%', duration: 1.5, ease: 'expo.inOut' }, 0.15)
        .to(root.querySelector('.kerf'), { autoAlpha: 0, duration: 0.3 }, 1.6)
        .from(root.querySelector('.hero-photo img'), { scale: 1.4, duration: 2.4 }, 0.15)
        .to(root.querySelectorAll('.dim'), { '--draw': 1, duration: 1.4, stagger: 0.2, ease: 'expo.inOut' }, 0.9)
        .to(root.querySelectorAll('.dim-label'), { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.8 }, 1.5)
        .to(root.querySelectorAll('.hero-sub, .hero-actions > *, .hero-note'), { autoAlpha: 1, y: 0, stagger: 0.08 }, 1.1)
      introReady.then(() => intro.play())

      gsap.to(root.querySelector('.hero-photo img'), { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(root.querySelector('.hero-copy'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
    })
  })

  return <section className="hero" ref={scope}>
    <div className="hero-copy">
      <Measured className="hero-measure">
        <h1 className="hero-title"><Lines lines={['Muebles', 'a medida']} /></h1>
      </Measured>
      <p className="hero-sub">Cocinas, placares y muebles de madera diseñados para tu casa, fabricados en nuestro taller de {studio.city} e instalados por nosotros.</p>
      <div className="hero-actions">
        <Magnetic><a className="btn btn-tiza" href={whatsappLink()} target="_blank" rel="noreferrer">Pedir presupuesto</a></Magnetic>
        <TLink className="btn btn-line" to="/#trabajos">Ver trabajos</TLink>
      </div>
    </div>
    <Measured axis="y" className="hero-media">
      <figure className="hero-photo">
        <img src={projects[0].coverImage} alt="Cocina de madera con frentes enmarcados e isla central" fetchPriority="high" />
        <span className="kerf" aria-hidden="true" />
      </figure>
    </Measured>
    <p className="hero-note">La línea azul mide el título en tu pantalla. Así trabajamos: todo se mide.</p>
  </section>
}

/* ---------- Marquee that reacts to scroll speed ---------- */

const trades = ['Cocinas', 'Placares', 'Vestidores', 'Bibliotecas', 'Mesas', 'Vanitorys', 'Escritorios', 'Puertas', 'Racks']

export function Marquee() {
  const scope = useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      const track = root.querySelector('.marquee-track')
      const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 })
      const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' })
      let direction = 1
      ScrollTrigger.create({
        trigger: root, start: 'top bottom', end: 'bottom top',
        onUpdate: self => {
          const velocity = self.getVelocity()
          direction = self.direction
          gsap.to(loop, { timeScale: direction * Math.min(1 + Math.abs(velocity) / 250, 7), duration: 0.2, overwrite: true })
          gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, overwrite: false })
          skew(gsap.utils.clamp(-8, 8, velocity / -300))
        },
        onLeave: () => skew(0), onLeaveBack: () => skew(0),
      })
    })
  })
  const row = trades.map(word => <span className="marquee-item" key={word}>{word}<i aria-hidden="true" /></span>)
  return <div className="marquee" ref={scope} aria-label={trades.join(', ')}>
    <div className="marquee-track" aria-hidden="true">{row}{row}</div>
  </div>
}

/* ---------- Statement that fills in word by word ---------- */

export function Statement({ text, aside }) {
  const scope = useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      gsap.fromTo(root.querySelectorAll('.word'), { opacity: 0.12 }, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.statement-text'), start: 'top 82%', end: 'bottom 48%', scrub: true },
      })
      gsap.from(root.querySelector('.statement-aside'), { autoAlpha: 0, x: -30, scrollTrigger: { trigger: root, start: 'top 70%' } })
    })
  })
  return <section className="statement" ref={scope}>
    <p className="statement-aside">{aside}</p>
    <p className="statement-text"><Words text={text} /></p>
  </section>
}

/* ---------- Works: pinned horizontal track on desktop ---------- */

export function Works() {
  const scope = useGsap(root => {
    gsap.matchMedia().add(`(min-width: 900px) and ${motionOk}`, () => {
      const track = root.querySelector('.works-track')
      const distance = () => track.scrollWidth - window.innerWidth
      const slide = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      })
      gsap.to(root.querySelector('.works-progress i'), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true } })
      root.querySelectorAll('.work-media img').forEach(img => {
        gsap.fromTo(img, { xPercent: -9 }, { xPercent: 9, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true } })
      })
      root.querySelectorAll('.work-card').forEach(card => {
        gsap.from(card.querySelector('.work-info'), { autoAlpha: 0, y: 30, scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 85%' } })
      })
    })
    gsap.matchMedia().add(`(max-width: 899px) and ${motionOk}`, () => {
      root.querySelectorAll('.work-media').forEach(media => {
        gsap.fromTo(media, { clipPath: 'inset(12% 8% 12% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: media, start: 'top 95%', end: 'top 40%', scrub: true } })
      })
    })
  })

  return <section className="works" id="trabajos" ref={scope}>
    <div className="works-track">
      <header className="works-head">
        <h2>Trabajos</h2>
        <p>Cada encargo resuelve un espacio distinto. Entrá a cada uno para ver materiales, medidas y detalles.</p>
        <div className="works-progress" aria-hidden="true"><i /></div>
      </header>
      {projects.map((project, index) => <TLink className={`work-card work-card-${index % 2 ? 'low' : 'high'}`} key={project.slug} to={`/proyectos/${project.slug}`} data-cursor="Ver">
        <div className="work-media"><img src={project.coverImage} alt="" loading="lazy" /></div>
        <div className="work-info">
          <h3>{project.title}</h3>
          <p>{project.materials}</p>
          <span className="work-size">{project.size}</span>
        </div>
      </TLink>)}
      <TLink className="work-card work-next" to="/contacto" data-cursor="Hablemos">
        <span>El próximo puede ser el tuyo.</span>
        <b>Contanos tu idea</b>
      </TLink>
    </div>
  </section>
}

/* ---------- Services list with a floating preview that trails the pointer ---------- */

export function ServiceList({ heading = true }) {
  const [active, setActive] = useState(-1)
  const preview = useRef(null)
  const scope = useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      gsap.from(root.querySelectorAll('.service-row'), { autoAlpha: 0, y: 40, stagger: 0.08, scrollTrigger: { trigger: root.querySelector('.service-list'), start: 'top 80%' } })
      gsap.from(root.querySelectorAll('.service-row'), { '--rule': 0, stagger: 0.08, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: root.querySelector('.service-list'), start: 'top 80%' } })
    })
  })

  useEffect(() => {
    const node = preview.current
    if (!node || !finePointer() || prefersReducedMotion()) return undefined
    const x = gsap.quickTo(node, 'x', { duration: 0.7, ease: 'power3' })
    const y = gsap.quickTo(node, 'y', { duration: 0.7, ease: 'power3' })
    const rotate = gsap.quickTo(node, 'rotation', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = e => { x(e.clientX); y(e.clientY); rotate(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6)); lastX = e.clientX }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return <section className="services" id="servicios" ref={scope}>
    {heading && <header className="services-head">
      <h2>Lo que hacemos</h2>
      <p>Si entra en tu casa y es de madera, probablemente lo podamos hacer.</p>
    </header>}
    <ul className="service-list" onPointerLeave={() => setActive(-1)}>
      {services.map((service, index) => <li className={`service-row ${active === index ? 'is-active' : ''}`} key={service.title} onPointerEnter={() => setActive(index)}>
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        <img className="service-inline" src={service.image} alt="" loading="lazy" />
      </li>)}
    </ul>
    <div className={`service-preview ${active >= 0 ? 'is-visible' : ''}`} ref={preview} aria-hidden="true">
      {services.map((service, index) => <img key={service.title} src={service.image} alt="" loading="lazy" className={active === index ? 'is-active' : ''} />)}
    </div>
  </section>
}

/* ---------- Process: a chalk line draws down through the steps ---------- */

export function Process() {
  const [current, setCurrent] = useState(0)
  const scope = useGsap(root => {
    root.querySelectorAll('.step').forEach((step, index) => {
      ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 62%', onToggle: self => { if (self.isActive) setCurrent(index) } })
    })
    gsap.matchMedia().add(motionOk, () => {
      gsap.fromTo(root.querySelector('.process-line i'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.process-steps'), start: 'top 62%', end: 'bottom 62%', scrub: true } })
      root.querySelectorAll('.step').forEach(step => {
        gsap.from(step.querySelectorAll('h3, p'), { autoAlpha: 0, x: 40, stagger: 0.08, scrollTrigger: { trigger: step, start: 'top 80%' } })
      })
    })
  })

  return <section className="process" id="proceso" ref={scope}>
    <div className="process-aside">
      <h2>Cómo trabajamos</h2>
      <div className="process-counter" aria-hidden="true">
        <span className="counter-window"><span className="counter-track" style={{ transform: `translate3d(0, ${-current * (100 / steps.length)}%, 0)` }}>
          {steps.map((_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}
        </span></span>
        <small>de {String(steps.length).padStart(2, '0')}</small>
      </div>
      <p>Un solo equipo, del primer mensaje al último tornillo.</p>
    </div>
    <ol className="process-steps">
      <span className="process-line" aria-hidden="true"><i /></span>
      {steps.map((step, index) => <li className={`step ${current === index ? 'is-current' : ''} ${index < current ? 'is-past' : ''}`} key={step.title}>
        <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
        <h3>{step.title}</h3>
        <p>{step.copy}</p>
      </li>)}
    </ol>
  </section>
}

/* ---------- Woods: procedural samples that fan out and tilt under the pointer ---------- */

function Swatch({ wood, index }) {
  const face = useRef(null)
  useEffect(() => {
    const node = face.current
    if (!node || !finePointer() || prefersReducedMotion()) return undefined
    const rx = gsap.quickTo(node, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(node, 'rotationY', { duration: 0.6, ease: 'power3' })
    const move = e => {
      const r = node.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rx(py * -16); ry(px * 18)
      node.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
      node.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
    }
    const reset = () => { rx(0); ry(0) }
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', reset)
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset) }
  }, [])
  return <figure className="swatch">
    <div className="swatch-face" ref={face}><WoodSwatch wood={wood} seed={index * 11 + 3} /><span className="swatch-glare" /></div>
    <figcaption><strong>{wood.name}</strong><span>{wood.note}</span></figcaption>
  </figure>
}

export function Woods() {
  const scope = useGsap(root => {
    gsap.matchMedia().add(`(min-width: 900px) and ${motionOk}`, () => {
      const cards = root.querySelectorAll('.swatch')
      gsap.fromTo(cards, {
        y: index => 120 + index * 30,
        rotation: index => (index - (cards.length - 1) / 2) * 7,
        xPercent: index => ((cards.length - 1) / 2 - index) * 60,
      }, {
        y: 0, rotation: 0, xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.swatches'), start: 'top 95%', end: 'top 35%', scrub: 1 },
      })
    })
  })
  return <section className="woods" ref={scope}>
    <header className="woods-head">
      <h2>Las maderas</h2>
      <p>Elegimos el material según el uso: cada una tiene su veta, su tono y su forma de envejecer.</p>
    </header>
    <div className="swatches">{woods.map((wood, index) => <Swatch wood={wood} index={index} key={wood.name} />)}</div>
  </section>
}

/* ---------- Closing call to action: the line stretches to fill the width ---------- */

export function ClosingCta() {
  const scope = useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      gsap.fromTo(root.querySelector('.cta-title'), { '--wdth': 62 }, { '--wdth': 125, ease: 'none', scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 15%', scrub: true } })
      gsap.from(root.querySelectorAll('.cta-row > *'), { autoAlpha: 0, y: 30, stagger: 0.1, scrollTrigger: { trigger: root.querySelector('.cta-row'), start: 'top 90%' } })
    })
  })
  return <section className="cta" ref={scope}>
    <h2 className="cta-title"><span>¿Qué querés</span><span>construir?</span></h2>
    <div className="cta-row">
      <p>Mandanos una foto del lugar y las medidas aproximadas. Te respondemos por WhatsApp para coordinar la visita.</p>
      <div className="cta-actions">
        <Magnetic><a className="btn btn-tiza btn-large" href={whatsappLink()} target="_blank" rel="noreferrer">Escribir por WhatsApp</a></Magnetic>
        <TLink className="btn btn-line-light" to="/contacto">Armar la consulta</TLink>
      </div>
    </div>
  </section>
}
