import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './styles/global.css'
import { startSmoothScroll } from './motion'
import { Cursor, CurtainProvider, Footer, Header, Preloader, ScrollManager, ScrollRuler } from './components'
import { Contact, Home, NotFound, Project, Services } from './pages'

startSmoothScroll()

function App() {
  return <CurtainProvider>
    <ScrollManager />
    <Preloader />
    <Header />
    <ScrollRuler />
    <main id="contenido">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/proyectos/:slug" element={<Project />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
    <Cursor />
  </CurtainProvider>
}

// GitHub Pages serves the site from a sub-path, so routes hang off Vite's base URL.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(<BrowserRouter basename={basename}><App /></BrowserRouter>)
