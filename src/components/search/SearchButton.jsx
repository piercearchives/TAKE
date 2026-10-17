import { gsap } from "gsap";
import { useRef, useState, useEffect } from "react";

import searchIcon from "../../assets/images/icons/search.svg";

/**
 * SearchButton — Componente de Busca Expansível com Microinterações (V1)
 *
 * Estrutura:
 * 1. Botão fixo com ícone de lupa (.button-search)
 * 2. Cápsula expansível com input embutido (.text-area)
 *
 * Fluxo de Animação:
 * - Hover: Botão encolhe suavemente (scale: 0.818) e restaura (scale: 1).
 * - Abrir: Botão trava em 0.818, cápsula brota do centro (scale: 0.68 -> 1) e estica para 300px com padding.
 * - Fechar: Cápsula zera paddings, encolhe para 44px e volta para trás (scale: 0.68), botão restaura elástico para 1.
 */
function SearchButton() {
  // ==========================================
  // 1. ESTADOS E REFERÊNCIAS
  // ==========================================
  const [pressed, setPressed] = useState(false);

  // Âncoras do DOM para manipulação via GSAP
  const buttonRef = useRef(null);
  const textAreaRef = useRef(null);

  // Guarda a timeline atualmente em execução para checagem de regras (.isActive)
  const activeTimelineRef = useRef(null);

  // ==========================================
  // 2. CICLO DE VIDA (ESTADO INICIAL)
  // ==========================================
  useEffect(() => {
    // Configura o estado inicial de repouso da cápsula (escondida no centro do botão)
    gsap.set(textAreaRef.current, {
      scale: 0.68,
      transformOrigin: "center center",
    });
  }, []);

  // ==========================================
  // 3. MICROINTERAÇÕES DE HOVER (BOTÃO)
  // ==========================================
  function decreaseButton() {
    gsap.to(buttonRef.current, {
      scale: 0.818,
      duration: 0.12,
      ease: "power2.out",
    });
  }

  function increaseButton() {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "back.out",
    });
  }

  // ==========================================
  // 4. COREOGRAFIAS GSAP (TIMELINES)
  // ==========================================
  function openSearch() {
    const openTl = gsap.timeline();

    openTl
      // 1. Encolhe o botão no frame 0
      .to(buttonRef.current, {
        scale: 0.818,
        duration: 0.12,
        ease: "power2.out",
      })
      // 2. Garante a escala inicial da cápsula concêntrica
      .to(
        textAreaRef.current,
        {
          scale: 0.68,
        },
        "<"
      )
      // 3. Cápsula cresce no centro até o tamanho base de 44px
      .to(textAreaRef.current, {
        scale: 1,
        duration: 0.1,
        ease: "power2.out",
      })
      // 4. Estica horizontalmente para a esquerda
      .to(textAreaRef.current, {
        width: 300,
        duration: 0.45,
        ease: "power2.out",
      })
      // 5. Expande os paddings laterais para dar respiro ao texto
      .to(textAreaRef.current, {
        duration: 0.45,
        paddingLeft: 10,
        paddingRight: 44,
        ease: "power2.out",
      });

    return openTl;
  }

  function closeSearch() {
    // Garante que o fechamento parte da escala cheia
    gsap.set(textAreaRef.current, {
      scale: 1,
      transformOrigin: "center center",
    });

    const closeTl = gsap.timeline();

    closeTl
      // 1. Garante que o botão se mantenha em 0.818 durante todo o recolhimento
      .to(buttonRef.current, {
        scale: 0.818,
      })
      // 2. Zera os paddings
      .to(textAreaRef.current, {
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.25,
        ease: "power2.out",
      })
      // 3. Encolhe a largura de volta para 44px
      .to(textAreaRef.current, {
        width: 44,
        duration: 0.45,
        ease: "power2.inOut",
      })
      // 4. Encolhe para trás do botão
      .to(textAreaRef.current, {
        scale: 0.68,
        duration: 0.1,
        ease: "power1.inOut",
      })
      // 5. Botão finaliza voltando ao tamanho normal com efeito elástico
      .to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      });

    return closeTl;
  }

  // ==========================================
  // 5. REGRAS DE INTERAÇÃO & DISPARADORES
  // ==========================================

  // Regra: o hover só é permitido se a busca NÃO estiver aberta e NENHUMA timeline estiver ativa
  const canUseHover = () => {
    return !pressed && !activeTimelineRef.current?.isActive();
  };

  const handleClick = () => {
    if (!pressed) {
      setPressed(true);
      activeTimelineRef.current = openSearch();
    } else {
      setPressed(false);
      activeTimelineRef.current = closeSearch();
    }
  };

  const handlePointerEnter = () => {
    if (canUseHover()) decreaseButton();
  };

  const handlePointerLeave = () => {
    if (canUseHover()) increaseButton();
  };

  // ==========================================
  // 6. RENDERIZAÇÃO (JSX)
  // ==========================================
  return (
    <div className="search">
      <button
        type="button"
        className="button-search"
        aria-label="Pesquisar"
        ref={buttonRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <img src={searchIcon} alt="" className="icon-search" />
      </button>

      <div className="text-area" ref={textAreaRef}>
        <input type="text" className="input-search" />
      </div>
    </div>
  );
}

export default SearchButton;
