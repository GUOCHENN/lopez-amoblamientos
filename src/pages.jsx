import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { projects, studio, whatsappLink } from './data/projects'
import { gsap, useGsap } from './motion'
import { Lines, Magnetic, Measured, TLink, Words } from './components'
import { ClosingCta, Hero, Marquee, Process, ServiceList, Statement, Woods, Works } from './sections'

const motionOk = '(prefers-reduced-motion: no-preference)'

// Shared entrance for inner-page headings: lines rise out of their masks.
function usePageIntro(extra, deps = []) {
  return useGsap(root => {
    gsap.matchMedia().add(motionOk, () => {
      gsap.from(root.querySelectorAll('.page-head .line-inner'), { yPercent: 115, stagger: 0.1, duration: 1.3, delay: 0.35 })
      gsap.from(root.querySelectorAll('.page-head .fade-in'), { autoAlpha: 0, y: 24, stagger: 0.08, delay: 0.7 })
      extra?.(root)
    })
  }, deps)
}

const titleLines = title => {
  const [first, ...rest] = title.split(' ')
  return rest.length ? [first, rest.join(' ')] : [first]
}

export function Home() {
  return <>
    <Hero />
    <Marquee />
    <Statement
      aside="Lopez Amoblamientos"
      text="Cada casa tiene sus propias medidas. Las tomamos en persona, dibujamos cada pieza y la fabricamos en nuestro taller para que encaje al milímetro, sin rellenos ni ajustes de último momento."
    />
    <Works />
    <ServiceList />
    <Process />
    <Woods />
    <ClosingCta />
  </>
}

export function Services() {
  const scope = usePageIntro()
  return <div ref={scope}>
    <header className="page-head">
      <h1><Lines lines={['Lo que', 'hacemos']} /></h1>
      <p className="page-lead fade-in">Cocinas, placares, bibliotecas y piezas a pedido. La regla es siempre la misma: se mide en el lugar, se fabrica en el taller y se instala con nuestras manos.</p>
    </header>
    <ServiceList heading={false} />
    <Process />
    <Woods />
    <ClosingCta />
  </div>
}

function BeforeAfter({ before, after }) {
  const [position, setPosition] = useState(50)
  const frame = useRef(null)
  const dragging = useRef(false)
  const setFromPointer = event => {
    const rect = frame.current.getBoundingClientRect()
    setPosition(Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)))
  }
  const onKey = event => {
    if (event.key === 'ArrowLeft') setPosition(p => Math.max(0, p - 5))
    if (event.key === 'ArrowRight') setPosition(p => Math.min(100, p + 5))
  }
  return <div
    className="compare" ref={frame} data-cursor="Arrastrá"
    onPointerDown={e => { dragging.current = true; frame.current.setPointerCapture(e.pointerId); setFromPointer(e) }}
    onPointerMove={e => dragging.current && setFromPointer(e)}
    onPointerUp={() => { dragging.current = false }}
  >
    <img src={after} alt="Después de la intervención" loading="lazy" />
    <div className="compare-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={before} alt="Antes de la intervención" loading="lazy" /></div>
    <div className="compare-handle" style={{ left: `${position}%` }} role="slider" tabIndex={0} aria-label="Comparar antes y después" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} onKeyDown={onKey}>
      <span>Antes</span><i /><span>Después</span>
    </div>
  </div>
}

export function Project() {
  const { slug } = useParams()
  const index = projects.findIndex(item => item.slug === slug)
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const scope = usePageIntro(root => {
    const cover = root.querySelector('.project-cover')
    if (!cover) return
    gsap.fromTo(cover, { clipPath: 'inset(18% 10% 0% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: 0.5 })
    gsap.from(cover.querySelector('img'), { scale: 1.3, duration: 2.4, delay: 0.5 })
    gsap.to(cover.querySelector('img'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: cover, start: 'top top', end: 'bottom top', scrub: true } })
    root.querySelectorAll('.gallery figure').forEach(figure => {
      gsap.fromTo(figure.querySelector('img'), { yPercent: -8, scale: 1.12 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from(figure, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: figure, start: 'top 85%' } })
    })
    gsap.fromTo(root.querySelectorAll('.project-story .word'), { opacity: 0.15 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: root.querySelector('.project-story'), start: 'top 80%', end: 'bottom 55%', scrub: true } })
  }, [slug])

  if (!project) return <div className="not-found">
    <h1>No encontramos ese proyecto.</h1>
    <TLink className="btn btn-tiza" to="/#trabajos">Ver todos los trabajos</TLink>
  </div>

  return <article ref={scope} key={slug}>
    <header className="page-head project-head">
      <TLink className="back fade-in" to="/#trabajos">Todos los trabajos</TLink>
      <h1><Lines lines={titleLines(project.title)} /></h1>
      <dl className="facts fade-in">
        <div><dt>Tipo</dt><dd>{project.category}</dd></div>
        <div><dt>Material</dt><dd>{project.materials}</dd></div>
        <div><dt>Medidas</dt><dd>{project.size}</dd></div>
        <div><dt>Ubicación</dt><dd>{project.location}</dd></div>
      </dl>
    </header>
    <Measured className="project-cover-wrap">
      <figure className="project-cover"><img src={project.coverImage} alt={project.title} /></figure>
    </Measured>
    <section className="project-story">
      <h2>El encargo</h2>
      <p><Words text={project.description} /></p>
    </section>
    {project.beforeImage && <section className="project-compare">
      <h2>Antes y después</h2>
      <BeforeAfter before={project.beforeImage} after={project.afterImage} />
    </section>}
    <section className="gallery">
      {project.gallery.slice(1).map((src, i) => <figure key={src}><img src={src} alt={`${project.title}, detalle ${i + 1}`} loading="lazy" /></figure>)}
    </section>
    <TLink className="next-project" to={`/proyectos/${next.slug}`} data-cursor="Siguiente">
      <span>Siguiente trabajo</span>
      <strong>{next.title}</strong>
      <img src={next.coverImage} alt="" loading="lazy" />
    </TLink>
    <ClosingCta />
  </article>
}

const projectTypes = ['Cocina', 'Placard o vestidor', 'Biblioteca o living', 'Mueble a pedido', 'Proyecto integral']

export function Contact() {
  const [type, setType] = useState('')
  const [opened, setOpened] = useState(false)
  const scope = usePageIntro(root => {
    gsap.from(root.querySelectorAll('.form-field, .chips, .form-submit'), { autoAlpha: 0, y: 30, stagger: 0.07, delay: 0.6 })
  })
  const submit = event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const lines = [
      `Hola, soy ${data.get('name')}.`,
      type && `Quiero consultar por: ${type}.`,
      data.get('size') && `Medidas aproximadas: ${data.get('size')}.`,
      data.get('location') && `Zona: ${data.get('location')}.`,
      data.get('message'),
    ].filter(Boolean)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener')
    setOpened(true)
  }
  return <div className="contact" ref={scope}>
    <header className="page-head contact-head">
      <h1><Lines lines={['Contanos', 'tu idea']} /></h1>
      <p className="page-lead fade-in">Completá lo que sepas y te armamos el mensaje para WhatsApp. Con una foto del lugar y medidas aproximadas ya podemos darte un primer número.</p>
      <ul className="channels fade-in">
        <li><span>WhatsApp</span><a href={whatsappLink()} target="_blank" rel="noreferrer">{studio.phone}</a></li>
        <li><span>Correo</span><a href={`mailto:${studio.email}`}>{studio.email}</a></li>
        <li><span>Taller</span><p>{studio.city}</p></li>
      </ul>
    </header>
    <form className="contact-form" onSubmit={submit}>
      <label className="form-field"><span>Tu nombre</span><input required name="name" autoComplete="name" /></label>
      <fieldset className="chips">
        <legend>¿Qué querés hacer?</legend>
        {projectTypes.map(option => <label key={option} className={type === option ? 'is-on' : ''}>
          <input type="radio" name="type" value={option} checked={type === option} onChange={() => setType(option)} />{option}
        </label>)}
      </fieldset>
      <label className="form-field"><span>Medidas aproximadas <em>opcional</em></span><input name="size" placeholder="Ej.: pared de 3,20 m, alto 2,50 m" /></label>
      <label className="form-field"><span>Zona <em>opcional</em></span><input name="location" placeholder="Ej.: Las Flores, Saladillo, Azul" /></label>
      <label className="form-field"><span>Contanos más</span><textarea required name="message" rows="4" placeholder="Qué te imaginás, qué uso le vas a dar, para cuándo lo necesitás" /></label>
      <div className="form-submit">
        <Magnetic><button className="btn btn-tiza btn-large" type="submit">Enviar por WhatsApp</button></Magnetic>
        <p role="status">{opened ? 'Abrimos WhatsApp con tu mensaje. Si no se abrió, revisá que tu navegador permita ventanas nuevas.' : 'Se abre WhatsApp con el mensaje listo; solo tenés que enviarlo.'}</p>
      </div>
    </form>
  </div>
}

export function NotFound() {
  return <div className="not-found">
    <h1>Esta página no existe.</h1>
    <TLink className="btn btn-tiza" to="/">Volver al inicio</TLink>
  </div>
}
