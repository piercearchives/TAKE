import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

function AccountButton({ label, icon, direction = { x: 1, y: -1 } }) {
  const currentArrowRef = useRef(null);
  const enteringArrowRef = useRef(null);
  const buttonRef = useRef(null);
  const arrowBoxRef = useRef(null);
  const labelTrackRef = useRef(null);

  useLayoutEffect(() => {
    gsap.set(enteringArrowRef.current, {
      xPercent: -direction.x * 100,
      yPercent: -direction.y * 100,
    });
  }, [direction.x, direction.y]);

  const animateArrow = (isHovering) => {
    gsap.to(currentArrowRef.current, {
      xPercent: isHovering ? direction.x * 100 : 0,
      yPercent: isHovering ? direction.y * 100 : 0,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(enteringArrowRef.current, {
      xPercent: isHovering ? 0 : -direction.x * 100,
      yPercent: isHovering ? 0 : -direction.y * 100,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const animateLabel = (isHovering) => {
    gsap.to(labelTrackRef.current, {
      yPercent: isHovering ? -50 : 0,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const scaleArrowBox = (isHovering) => {
    gsap.to(arrowBoxRef.current, {
      scale: isHovering ? 0.86 : 1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const scaleButton = (isPressed) => {
    gsap.to(buttonRef.current, {
      scale: isPressed ? 0.96 : 1,
      duration: isPressed ? 0.12 : 0.3,
      ease: isPressed ? "power2.out" : "back.out(2)",
      overwrite: "auto",
    });
  };

  const activateHover = () => {
    animateArrow(true);
    animateLabel(true);
    scaleArrowBox(true);
  };

  const clearHover = () => {
    animateArrow(false);
    animateLabel(false);
    scaleArrowBox(false);
  };

  return (
    
      <button
        type="button"
        className="account-button flex items-center"
        ref={buttonRef}
        aria-label={label}
        onMouseEnter={activateHover}
        onMouseLeave={clearHover}
        onFocus={activateHover}
        onBlur={clearHover}
        onPointerDown={() => scaleButton(true)}
        onPointerUp={() => scaleButton(false)}
        onPointerLeave={() => scaleButton(false)}
        onPointerCancel={() => scaleButton(false)}
      >
        <span className="account-button__inner" >
        <span className="account-label-window" aria-hidden="true">
          <span className="account-label-track" ref={labelTrackRef}>
            <span className="content">{label}</span>
            <span className="content">{label}</span>
          </span>
        </span>
        <span className="button-menu__box" ref={arrowBoxRef}>
          <span className="account-arrow-window" aria-hidden="true">
            <span className="account-arrow-slot" ref={currentArrowRef}>
              <img src={icon} alt="" className="account-arrow" />
            </span>
            <span className="account-arrow-slot" ref={enteringArrowRef}>
              <img src={icon} alt="" className="account-arrow" />
            </span>
          </span>
        </span>
        </span>
      </button>

      
    
  );
}

export default AccountButton;
