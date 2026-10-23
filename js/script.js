(() => {
  "use strict";

  // 기존 script.js 전체를 이 코드로 교체하세요.
  // Git 충돌 표시(<<<<<<<, =======, >>>>>>>)는 남기지 않습니다.

  /* 모바일 메뉴 */
  const menu = document.querySelector(".main-nav");
  if (menu) menu.inert = false;

  /* 메인 슬라이더 */
  const hero = document.querySelector(".hero");

  // 회사소개 페이지에는 메인 슬라이더가 없습니다.
  if (!hero) return;

  const slides = [...hero.querySelectorAll(".hero-slide")];
  const dots = [...hero.querySelectorAll(".hero-dots button")];
  const count = hero.querySelector(".hero-count b");
  const play = hero.querySelector(".hero-play");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let current = 0;
  let timer = null;
  let userPaused = reduceMotion.matches;
  let hovered = false;
  let focused = false;

  const showSlide = (next) => {
    current = (next + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const active = index === current;

      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });

    dots.forEach((dot, index) => {
      const active = index === current;

      dot.classList.toggle("is-active", active);

      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (count) {
      count.textContent = String(current + 1).padStart(2, "0");
    }
  };

  const syncPlayback = () => {
    window.clearInterval(timer);
    timer = null;

    const paused = userPaused || reduceMotion.matches;
    const canPlay = !paused && !hovered && !focused && !document.hidden;

    hero.classList.toggle("is-paused", !canPlay);

    if (play) {
      play.textContent = paused ? "▶" : "Ⅱ";
      play.disabled = reduceMotion.matches;
      play.setAttribute("aria-pressed", String(paused));

      play.setAttribute(
        "aria-label",
        reduceMotion.matches
          ? "동작 줄이기 설정으로 자동 재생 중지"
          : paused
            ? "자동 재생 시작"
            : "자동 재생 일시정지",
      );
    }

    // 6.5초마다 다음 사진으로 전환
    if (canPlay && slides.length > 1) {
      timer = window.setInterval(() => {
        showSlide(current + 1);
      }, 6500);
    }
  };

  const selectSlide = (next) => {
    showSlide(next);
    syncPlayback();
  };

  hero.querySelector(".hero-prev")?.addEventListener("click", () => {
    selectSlide(current - 1);
  });

  hero.querySelector(".hero-next")?.addEventListener("click", () => {
    selectSlide(current + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => selectSlide(index));
  });

  play?.addEventListener("click", () => {
    userPaused = !userPaused;
    syncPlayback();
  });

  // 마우스를 올리거나 키보드로 조작하는 동안 잠시 정지
  hero.addEventListener("mouseenter", () => {
    hovered = true;
    syncPlayback();
  });

  hero.addEventListener("mouseleave", () => {
    hovered = false;
    syncPlayback();
  });

  hero.addEventListener("focusin", () => {
    focused = true;
    syncPlayback();
  });

  hero.addEventListener("focusout", (event) => {
    focused = Boolean(
      event.relatedTarget && hero.contains(event.relatedTarget),
    );
    syncPlayback();
  });

  // 다른 탭을 보는 동안 자동 재생 중지
  document.addEventListener("visibilitychange", syncPlayback);

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) userPaused = true;
    syncPlayback();
  });

  showSlide(0);
  syncPlayback();
})();
