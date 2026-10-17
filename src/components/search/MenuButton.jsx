import gsap from 'gsap'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import arrowRight from '../../assets/images/icons/arrow-right.svg'

const MENU_LINKS = [
  { href: '#Explorar', label: 'Explorar' },
  { href: '#Comunidades', label: 'Comunidades' },
  { href: '#Sobre', label: 'Sobre' },
]

function MenuButton() {
  const shellRef = useRef(null)
  const menuButtonRef = useRef(null)
  const stageRef = useRef(null)
  const labelClipRef = useRef(null)
  const labelWindowRef = useRef(null)
  const labelTrackRef = useRef(null)
  const linksRef = useRef(null)
  const arrowBoxRef = useRef(null)
  const arrowCurrentRef = useRef(null)
  const arrowEnterRef = useRef(null)
  const arrowEnterFaceRef = useRef(null)
  const timelineRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const canUseHover = () => {
    const timeline = timelineRef.current
    return !isMenuOpen && !timeline?.isActive()
  }

  const resetClosedArrowFaces = () => {
    gsap.set(arrowCurrentRef.current, { xPercent: 0 })
    gsap.set(arrowEnterRef.current, { xPercent: -100 })
    gsap.set(labelTrackRef.current, { yPercent: 0 })
   
  }

  const buildOpenTimeline = useCallback(() => {
    const linkLabels = gsap.utils.toArray('.menu-link__label', linksRef.current)

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onReverseComplete: resetClosedArrowFaces,
    })

    timeline.to(labelWindowRef.current, { yPercent: -110, duration: 0.4 }, 0)
    timeline.to(arrowCurrentRef.current, { xPercent: 100, duration: 0.38 }, 0.05)
    timeline.to(arrowEnterRef.current, { xPercent: 0, duration: 0.38 }, '<')
    timeline.to(
      stageRef.current,
      {
        width: () => linksRef.current.scrollWidth,
        duration: 0.55,
      },
      0.08,
    )
    timeline.to(
      arrowEnterFaceRef.current,
      {
        rotation:180,
        duration:0.55,
        ease: 'power2.inOut',
        transformOrigin: '50% 50%',
      },
      0.08,
    )
    timeline.to(
      linkLabels,
      {
        yPercent: 0,
        duration: 0.48,
        stagger: 0.07,
      },
      0.3,
    )

    return timeline
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const linkLabels = gsap.utils.toArray('.menu-link__label', linksRef.current)
      gsap.set(arrowEnterRef.current, { xPercent: -100 })
      gsap.set(arrowEnterFaceRef.current, { rotation: 0 })
      gsap.set(labelWindowRef.current, { yPercent: 0 })
      gsap.set(linkLabels, { yPercent: 110 })
    }, shellRef)

    return () => {
      timelineRef.current?.kill()
      ctx.revert()
    }
  }, [])

  useLayoutEffect(() => {
    if (isMenuOpen) {
      gsap.killTweensOf([
        labelTrackRef.current,
        arrowBoxRef.current,
        menuButtonRef.current,
      ])

      const linkLabels = gsap.utils.toArray('.menu-link__label', linksRef.current)

      gsap.set(arrowBoxRef.current, { scale: 1 })
      gsap.set(menuButtonRef.current, { scale: 1 })
      gsap.set(arrowCurrentRef.current, { xPercent: 0 })
      gsap.set(arrowEnterRef.current, { xPercent: -100 })
      gsap.set(labelWindowRef.current, { yPercent: 0 })
      gsap.set(linkLabels, { yPercent: 110 })
     gsap.set(arrowEnterFaceRef.current, { rotation: 0 })

      timelineRef.current?.kill()
      timelineRef.current = buildOpenTimeline()
      return
    }

    timelineRef.current?.reverse()
  }, [buildOpenTimeline, isMenuOpen])

  const scaleMenuButton = (isPressed) => {
    if (!canUseHover()) return

    gsap.to(menuButtonRef.current, {
      scale: isPressed ? 0.96 : 1,
      duration: isPressed ? 0.12 : 0.3,
      ease: isPressed ? 'power2.out' : 'back.out(2)',
      overwrite: 'auto',
    })
  }

  const scaleMenuArrowBox = (isActive) => {
    if (!canUseHover()) return

    gsap.to(arrowBoxRef.current, {
      scale: isActive ? 0.86 : 1,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const rollMenuArrow = (isHovering) => {
    if (!canUseHover()) return

    gsap.to(arrowCurrentRef.current, {
      xPercent: isHovering ? 100 : 0,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })

    gsap.to(arrowEnterRef.current, {
      xPercent: isHovering ? 0 : -100,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const rollMenuLabel = (yPercent) => {
    if (!canUseHover()) return

    gsap.to(labelTrackRef.current, {
      yPercent,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const applyClosedHover = () => {
    rollMenuLabel(-50)
    rollMenuArrow(true)
    scaleMenuArrowBox(true)
  }

  const clearClosedHover = () => {
    rollMenuLabel(0)
    rollMenuArrow(false)
    scaleMenuArrowBox(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen((isOpen) => !isOpen)
  }

  return (
    <div
      className={`menu-shell grid-span-2${isMenuOpen ? ' is-open' : ''}`}
      ref={shellRef}
      onClick={(event) => {
        if (isMenuOpen) return
        if (event.target.closest('.button-menu__toggle')) return
        setIsMenuOpen(true)
      }}
    >
      <div
        className="button-menu flex items-center"
        ref={menuButtonRef}
        onMouseEnter={applyClosedHover}
        onMouseLeave={() => {
          clearClosedHover()
          scaleMenuButton(false)
        }}
        onPointerDown={() => scaleMenuButton(true)}
        onPointerUp={() => scaleMenuButton(false)}
        onPointerCancel={() => scaleMenuButton(false)}
      >
        <div className="menu-shell__stage" ref={stageRef}>
          <span className="button-menu__label-clip" ref={labelClipRef}>
            <span
              className="button-menu__label-window"
              ref={labelWindowRef}
              aria-hidden="true"
            >
              <span className="button-menu__label-track" ref={labelTrackRef}>
                <span className="content">Menu</span>
                <span className="content">Menu</span>
              </span>
            </span>
          </span>

          <nav
            id="main-menu"
            className="menu-links"
            ref={linksRef}
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen ? true : undefined}
          >
            {MENU_LINKS.map((link) => (
              <span className="menu-link" key={link.href}>
                <a
                  href={link.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="menu-link__label">{link.label}</span>
                </a>
              </span>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="button-menu__toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Menu'}
          onClick={(event) => {
            event.stopPropagation()
            toggleMenu()
          }}
          onFocus={applyClosedHover}
          onBlur={clearClosedHover}
        >
          <span className="button-menu__box" ref={arrowBoxRef}>
            <span className="button-menu__arrow-window" aria-hidden="true">
              <span className="button-menu__arrow-slot" ref={arrowCurrentRef}>
                <img src={arrowRight} alt="" className="button-menu__arrow" />
              </span>
              <span className="button-menu__arrow-slot" ref={arrowEnterRef}>
                <img
                  ref={arrowEnterFaceRef}
                  src={arrowRight}
                  alt=""
                  className="button-menu__arrow"
                />
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default MenuButton
