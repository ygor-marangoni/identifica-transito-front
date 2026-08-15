<script setup lang="ts">
import LandingV2Hero from './LandingV2Hero.vue'
import LandingV2Section02 from './LandingV2Section02.vue'

const heroRef = ref<InstanceType<typeof LandingV2Hero> | null>(null)
const sectionRef = ref<InstanceType<typeof LandingV2Section02> | null>(null)
let cleanup: (() => void) | undefined

onMounted(async () => {
  const label = heroRef.value?.heroLabel
  const hero = heroRef.value?.hero
  const target = sectionRef.value?.labelTarget
  const section = sectionRef.value?.section
  const materialCard = sectionRef.value?.materialCard
  if (!label || !hero || !target || !section || !materialCard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const { default: gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  const originalParent = label.parentElement
  const originalNext = label.nextSibling
  const mm = gsap.matchMedia()

  const restore = () => {
    if (originalParent && label.parentElement !== originalParent) {
      if (originalNext && originalNext.parentNode === originalParent) originalParent.insertBefore(label, originalNext)
      else originalParent.appendChild(label)
    }
    label.classList.remove('is-docked', 'is-travelling')
    gsap.set(label, { clearProps: 'all' })
  }

  const build = () => {
    const isMobile = window.matchMedia('(max-width: 800px)').matches
    const dockThreshold = .999
    let currentProgress = 0
    let startPoint = isMobile
      ? (() => {
          const bounds = label.getBoundingClientRect()
          return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
        })()
      : (() => {
          const bounds = label.getBoundingClientRect()
          return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
        })()
    let journeyStarted = false
    const captureStartPoint = () => {
      const bounds = label.getBoundingClientRect()
      startPoint = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
      journeyStarted = true
    }
    const draw = (progress: number) => {
      currentProgress = progress
      const destination = isMobile ? target.parentElement : target
      const b = (destination || target).getBoundingClientRect()
      const sx = startPoint.x
      const sy = startPoint.y
      const ex = b.left + b.width / 2
      const ey = isMobile ? window.innerHeight * .68 : b.top + b.height / 2
      const t = Math.max(0, Math.min(1, progress))
      const inverse = 1 - t
      const controlOneX = window.innerWidth * .72
      const controlOneY = window.innerHeight * .3
      const controlTwoX = window.innerWidth * .86
      const controlTwoY = window.innerHeight * .72
      const x = isMobile
        ? sx + (ex - sx) * t
        : inverse ** 3 * sx + 3 * inverse ** 2 * t * controlOneX + 3 * inverse * t ** 2 * controlTwoX + t ** 3 * ex
      const y = isMobile
        ? sy + (ey - sy) * t
        : inverse ** 3 * sy + 3 * inverse ** 2 * t * controlOneY + 3 * inverse * t ** 2 * controlTwoY + t ** 3 * ey
      // Preserve the label's base size at the beginning of the journey.
      // It should only grow as the user moves toward the second section.
      const scale = isMobile
        ? gsap.utils.interpolate(.76, 2.2, t)
        : (t < .62 ? gsap.utils.interpolate(1, 1.45, t / .62) : gsap.utils.interpolate(1.45, 3.8, (t - .62) / .38))
      gsap.set(label, { position: 'fixed', left: 0, top: 0, x, y, xPercent: -50, yPercent: -50, scale, scaleX: isMobile ? 1 : .8 + t * .2, skewX: isMobile ? 0 : -9 + t * 9, rotation: isMobile ? 0 : -8 + t * 28, zIndex: 80 })
    }
    const dock = () => {
      const destination = isMobile ? target.parentElement : target
      if (destination && label.parentElement !== destination) destination.appendChild(label)
      label.classList.remove('is-travelling')
      label.classList.add('is-docked')
      if (isMobile) {
        gsap.set(label, {
          position: 'absolute',
          left: '50%',
          top: '50%',
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 2.2,
          scaleX: 1,
          skewX: 0,
          rotation: 0,
          zIndex: 2
        })
      } else {
        gsap.set(label, { clearProps: 'position,left,top,x,y,xPercent,yPercent,scale,scaleX,skewX,rotation' })
      }
    }
    const undock = (progress: number) => {
      const needsNewStartPoint = label.parentElement !== originalParent
      if (needsNewStartPoint) {
        if (originalNext && originalNext.parentNode === originalParent) originalParent?.insertBefore(label, originalNext)
        else originalParent?.appendChild(label)
      }
      label.classList.remove('is-docked')
      label.classList.add('is-travelling')
      // Keep the same start point used by the downward journey. Recalculating
      // it here makes the return use a different curve.
      if (needsNewStartPoint) {
        gsap.set(label, { clearProps: 'all' })
      }
      draw(progress)
    }
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      endTrigger: isMobile ? target.parentElement : section,
      end: isMobile ? 'center 68%' : 'center center',
      // Um scrub maior deixa a etiqueta acompanhar o scroll com uma inércia
      // suave, evitando a sensação de salto quando o usuário rola rápido.
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: self => {
        currentProgress = self.progress
        if (self.progress <= 0.002) {
          restore()
          journeyStarted = false
          return
        }
        if (!journeyStarted) {
          restore()
          captureStartPoint()
        }
        self.progress >= dockThreshold ? dock() : undock(self.progress)
      },
      onEnterBack: self => undock(self.progress),
      onLeaveBack: () => { restore(); journeyStarted = false },
      onRefresh: self => {
        if (self.progress <= 0.002) {
          restore()
          return
        }
        if (self.progress >= dockThreshold) {
          dock()
          return
        }
        if (!journeyStarted) {
          restore()
          captureStartPoint()
        }
        // Measure only after the label has returned to its original layout
        // position; this keeps resize refreshes from using the old transform
        // as the next journey's origin.
        draw(self.progress)
      }
    })
    return () => { trigger.kill(); restore() }
  }

  mm.add({ desktop: '(min-width: 801px)', mobile: '(max-width: 800px)' }, () => build())
  cleanup = () => { mm.revert(); restore() }
  requestAnimationFrame(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <LandingV2Hero ref="heroRef" />
  <LandingV2Section02 ref="sectionRef" />
</template>
