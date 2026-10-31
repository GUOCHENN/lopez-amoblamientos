import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(pointer: fine)').matches

let lenis = null

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTarget(target, { immediate = false } = {}) {
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (target !== 0 && !node) return
  if (lenis) lenis.scrollTo(target === 0 ? 0 : node, { offset: target === 0 ? 0 : -70, immediate, duration: 1.4 })
  else window.scrollTo({ top: target === 0 ? 0 : node.getBoundingClientRect().top + window.scrollY - 70, behavior: immediate ? 'auto' : 'smooth' })
}

// The first-visit preloader resolves this; hero intros wait on it so the two never overlap.
let releaseIntro
export const introReady = new Promise(resolve => { releaseIntro = resolve })
export const markIntroDone = () => releaseIntro()

// Runs GSAP setup scoped to the returned ref and reverts everything on unmount.
export function useGsap(setup, deps = []) {
  const scope = useRef(null)
  useLayoutEffect(() => {
    if (!scope.current) return undefined
    const ctx = gsap.context(self => setup(scope.current, self), scope)
    return () => ctx.revert()
  }, deps)
  return scope
}

export const pxToMm = px => Math.round(px * 25.4 / 96)
export const formatMm = mm => mm.toLocaleString('es-AR')
