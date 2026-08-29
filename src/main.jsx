import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { projects, studio } from './data/projects'
import './styles/global.css'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/contacto', label: 'Contacto' },
]

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [location.pathname])
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }, [location.hash])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link className="brand" to="/" aria-label="Lopez Amoblamientos, inicio">
        <img className="brand-logo" src="/lopez-amoblamientos-logo.png" alt="" />
        <span>Lopez <em>Amoblamientos</em></span>
      </Link>
      <nav id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        {navItems.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}
        <a className="nav-whatsapp" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
        <Link className="nav-cta" to="/contacto">Hablemos <span aria-hidden="true">↗</span></Link>
      </nav>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
        <span>{menuOpen ? 'Cerrar' : 'Menú'}</span><i aria-hidden="true" />
      </button>
    </header>
    <main key={location.pathname} className="page-shell">{children}</main>
    <a className="quick-whatsapp" href={studio.whatsapp} target="_blank" rel="noreferrer" aria-label="Escribinos por WhatsApp"><span className="quick-whatsapp-dot" /><span>Escribinos<br /><b>por WhatsApp</b></span><strong aria-hidden="true">↗</strong></a>
    <footer className="site-footer">
      <div><Link className="brand footer-brand" to="/"><img className="brand-logo" src="/lopez-amoblamientos-logo.png" alt="" /><span>Lopez <em>Amoblamientos</em></span></Link><p>Diseñamos lo que otros<br />solo imaginan.</p></div>
      <div className="footer-links"><span>{studio.city}, Argentina</span><a href={`mailto:${studio.email}`}>{studio.email}</a><a href={studio.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Corteza Studio</span><span>Carpintería a medida</span></div>
    </footer>
  </>
}

function Button({ to, children, variant = 'dark' }) { return <Link className={`button button-${variant}`} to={to}>{children}<span aria-hidden="true">↗</span></Link> }

function Image({ src, alt, className = '', loading = 'lazy' }) { return <img className={className} src={src} alt={alt} loading={loading} /> }

function Hero() {
  const ref = useReveal()
  return <section className="hero" ref={ref}>
    <Image className="hero-image" src={projects[0].coverImage} alt="Cocina de madera natural con líneas contemporáneas" loading="eager" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="hero-kicker">Carpintería a medida · Buenos Aires</p>
      <h1>Hecho a mano.<br /><i>Diseñado para durar.</i></h1>
      <p className="hero-intro">Diseñamos y fabricamos muebles y espacios de madera personalizados.</p>
      <div className="hero-actions"><Button to="/#proyectos">Ver proyectos</Button><Button to="/contacto" variant="light">Solicitar presupuesto</Button></div>
    </div>
    <div className="hero-foot"><span>01 — 06</span><span>Explorar el trabajo <b aria-hidden="true">↓</b></span></div>
  </section>
}

function SectionHeading({ title, text, action }) {
  return <div className="section-heading"><h2>{title}</h2><div>{text && (typeof text === 'string' ? <p>{text}</p> : text)}{action}</div></div>
}

function ProjectCard({ project, featured = false }) {
  return <Link className={`project-card ${featured ? 'project-card-featured' : ''}`} to={`/proyectos/${project.slug}`}>
    <div className={`project-image-wrap ${featured ? 'featured-collage' : ''}`}><Image src={project.coverImage} alt={project.title} />{featured && <div className="featured-secondary"><Image src={project.gallery[1]} alt={`${project.title}, detalle de material`} /><Image src={project.gallery[2]} alt={`${project.title}, detalle interior`} /></div>}<span className="project-arrow" aria-hidden="true">↗</span></div>
    <div className="project-meta"><div><h3>{project.title}</h3><p>{project.category}</p></div><span>{project.location}</span></div>
  </Link>
}

function Projects() {
  const ref = useReveal()
  return <section className="projects section-pad" id="proyectos" ref={ref}>
    <SectionHeading title="Proyectos destacados" text={<><p>Piezas pensadas para un espacio específico, hechas para formar parte de la vida cotidiana.</p><div className="project-stats"><span><b>04</b> proyectos en muestra</span><span><b>100%</b> hecho a medida</span><span><b>01</b> equipo de principio a fin</span></div></>} action={<Link className="text-link" to="/servicios">Ver todos los servicios <span>↗</span></Link>} />
    <div className="project-grid">
      <ProjectCard project={projects[0]} featured />
      <ProjectCard project={projects[1]} />
      <ProjectCard project={projects[2]} />
      <div className="project-note"><span className="line" /><div><p>La belleza está en lo que se ve.<br /><i>La calidad, en lo que no.</i></p><small>Te acompañamos desde la primera medida hasta la instalación final. Hacemos preguntas, proponemos soluciones y cuidamos el resultado en cada etapa.</small><div className="note-proof"><span>Medición en tu espacio</span><span>Fabricación propia</span><span>Instalación incluida</span></div><Link className="note-cta" to="/contacto">¿Tenés una idea? Hablemos <span>↗</span></Link></div></div>
      <ProjectCard project={projects[3]} />
    </div>
  </section>
}

function Details() {
  const ref = useReveal()
  return <section className="details section-pad dark-section" ref={ref}>
    <div className="details-intro"><p className="eyebrow">El oficio, de cerca</p><h2>Detalles que hacen<br /><i>la diferencia.</i></h2><p className="body-copy">Elegimos cada material, unión y terminación para que el resultado se sienta tan bien como se ve.</p></div>
    <div className="detail-gallery"><figure><Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" alt="Detalle de textura de madera" /><figcaption>Textura natural · Roble</figcaption></figure><figure><Image src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1000&q=85" alt="Detalle de cocina de madera" /><figcaption>Proporción y ritmo · Cocina</figcaption></figure><figure><Image src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1000&q=85" alt="Herramientas de carpintería" /><figcaption>El proceso también importa</figcaption></figure></div>
  </section>
}

const process = [['Consulta', 'Entendemos qué necesitás y cómo vivís tu espacio.'], ['Medición', 'Visitamos el lugar para trabajar con sus proporciones reales.'], ['Diseño', 'Definimos la pieza, el material y cada detalle juntos.'], ['Fabricación', 'Construimos en nuestro taller, cuidando cada unión.'], ['Instalación', 'Llevamos el trabajo terminado y lo dejamos en su lugar.'], ['Resultado', 'Un mueble propio, pensado para quedarse.']]
function Process() {
  const ref = useReveal()
  return <section className="process section-pad" ref={ref}><SectionHeading title="Nuestro proceso" text="Del primer boceto al último ajuste, acompañamos cada etapa." /><div className="process-list">{process.map(([title, copy], index) => { const Tag = index === 0 ? 'a' : 'div'; const props = index === 0 ? { href: studio.whatsapp, target: '_blank', rel: 'noreferrer', 'aria-label': 'Escribinos por WhatsApp para comenzar una consulta' } : {}; return <Tag className={`process-item ${index === 0 ? 'process-item-link' : ''}`} key={title} {...props}><span className="process-number">0{index + 1}</span><h3>{title}</h3><p>{copy}{index === 0 && <strong>Escribinos por WhatsApp ↗</strong>}</p><span className="process-mark" aria-hidden="true">↗</span></Tag> })}</div></section>
}

function Trust() {
  const ref = useReveal()
  return <section className="trust section-pad" ref={ref}><div className="trust-image"><Image src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85" alt="Materiales de madera en el taller" /></div><div className="trust-copy"><p className="eyebrow">Por qué elegirnos</p><h2>El trabajo habla<br /><i>por nosotros.</i></h2><div className="trust-points"><div><strong>01</strong><h3>Trabajo personalizado</h3><p>Cada proyecto nace de tu espacio, tus hábitos y tus medidas.</p></div><div><strong>02</strong><h3>Fabricación propia</h3><p>Diseño, fabricación e instalación bajo una misma mirada.</p></div><div><strong>03</strong><h3>Atención al detalle</h3><p>Materiales honestos, estructuras sólidas y terminaciones cuidadas.</p></div></div><Button to="/contacto" variant="outline">Conocé cómo trabajamos</Button></div></section>
}

function ContactCTA() { return <section className="contact-cta dark-section"><div className="cta-copy"><p className="eyebrow">¿Tenés un proyecto en mente?</p><h2>Hagámoslo<br /><i>real.</i></h2></div><div className="cta-action"><p>Contanos qué tenés en mente y te respondemos para dar el primer paso.</p><div className="cta-actions"><Button to="/contacto" variant="light">Solicitar presupuesto</Button><a className="cta-whatsapp" href={studio.whatsapp} target="_blank" rel="noreferrer"><span className="cta-whatsapp-icon">◔</span> Escribinos por WhatsApp <span>↗</span></a></div></div></section> }

function Home() { return <><Hero /><Projects /><Details /><Process /><Trust /><ContactCTA /></> }

function BeforeAfter({ before, after }) {
  const [position, setPosition] = useState(50)
  return <div className="before-after"><Image src={after} alt="Después de la intervención" /><div className="before-image" style={{ width: `${position}%` }}><Image src={before} alt="Antes de la intervención" /></div><label className="slider-label" style={{ left: `${position}%` }}><span>ANTES</span><input type="range" min="0" max="100" value={position} onChange={e => setPosition(e.target.value)} aria-label="Comparar antes y después" /><span>DESPUÉS</span></label></div>
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)
  if (!project) return <div className="not-found"><h1>Proyecto no encontrado.</h1><Button to="/">Volver al inicio</Button></div>
  return <article className="project-detail"><div className="detail-hero"><Image src={project.coverImage} alt={project.title} loading="eager" /><Link className="back-link" to="/#proyectos"><span className="back-icon" aria-hidden="true">←</span><span>Volver a proyectos</span></Link><div><p>{project.category}</p><h1>{project.title}</h1></div></div><div className="project-facts section-pad"><div><span>Tipo</span><strong>{project.category}</strong></div><div><span>Material</span><strong>{project.materials}</strong></div><div><span>Trabajo</span><strong>Diseño · Fabricación · Instalación</strong></div><div><span>Ubicación</span><strong>{project.location}</strong></div></div><div className="project-story section-pad"><div><p className="eyebrow">El proyecto</p><h2>Una pieza con<br /><i>su propio lugar.</i></h2></div><p>{project.description}</p></div>{project.beforeImage && <div className="section-pad compare-section"><p className="eyebrow">La transformación</p><h2>Antes / Después</h2><BeforeAfter before={project.beforeImage} after={project.afterImage} /></div>}<div className="detail-masonry section-pad">{project.gallery.map((image, index) => <figure key={image}><Image src={image} alt={`${project.title}, detalle ${index + 1}`} /><figcaption>{['Vista general', 'Material y textura', 'Uniones y proporciones', 'Terminación final'][index] || 'Detalle del proyecto'}</figcaption></figure>)}</div><ContactCTA /></article>
}

const services = [['Muebles a medida', 'Piezas únicas que resuelven y mejoran tu espacio.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'], ['Cocinas', 'El centro de la casa, diseñado alrededor de tu forma de vivir.', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'], ['Vestidores', 'Orden, materialidad y calma en cada elección.', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'], ['Proyectos especiales', 'Cuando la idea pide una manera propia de hacerse.', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85']]
function Services() { return <div className="simple-page section-pad"><p className="eyebrow">Lo que hacemos</p><h1>Diseñamos para<br /><i>tu manera de vivir.</i></h1><p className="page-lead">Madera, proporción y oficio para crear muebles que se sienten parte del lugar desde el primer día.</p><div className="services-list">{services.map(([title, copy, image], index) => <div className="service-row" key={title}><span>0{index + 1}</span><Image src={image} alt={title} /><div><h2>{title}</h2><p>{copy}</p><Link className="text-link" to="/contacto">Hablemos de tu proyecto ↗</Link></div></div>)}</div><ContactCTA /></div> }

function Contact() { const [sent, setSent] = useState(false); return <div className="contact-page section-pad"><div className="contact-intro"><p className="eyebrow">Empecemos una conversación</p><h1>¿Tenés un proyecto<br /><i>en mente?</i></h1><p>Contanos qué necesitás. Nos gusta escuchar la idea completa antes de pensar la primera línea.</p><a className="whatsapp" href={studio.whatsapp} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>Escribinos directo ↗</b></a></div><form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>{sent ? <div className="form-success"><span>✓</span><h2>Gracias por escribirnos.</h2><p>Recibimos tu consulta. Te vamos a responder a la brevedad.</p><button type="button" onClick={() => setSent(false)}>Enviar otra consulta</button></div> : <><label>Nombre<input required name="name" placeholder="Tu nombre" /></label><label>Teléfono / WhatsApp<input required name="phone" placeholder="+54 9 ..." /></label><label>Tipo de proyecto<select name="type" defaultValue=""><option value="" disabled>Elegí una opción</option><option>Cocina</option><option>Mueble a medida</option><option>Vestidor</option><option>Proyecto especial</option></select></label><label>Descripción<textarea required name="description" rows="4" placeholder="Contanos un poco sobre la idea, el espacio y los tiempos..."></textarea></label><label className="file-picker"><span>Subir fotos</span><input type="file" name="photos" accept="image/*" multiple /><small>Seleccionar archivos · JPG, PNG o WEBP</small></label><button className="button button-dark" type="submit">Solicitar presupuesto <span aria-hidden="true">↗</span></button></>}</form></div> }

function App() { return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/proyectos/:slug" element={<ProjectDetail />} /><Route path="/servicios" element={<Services />} /><Route path="/contacto" element={<Contact />} /><Route path="*" element={<Home />} /></Routes></Layout> }

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>)
