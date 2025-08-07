document.addEventListener("DOMContentLoaded", () => {
  function getScrollbarWidth() {
    const o = document.createElement("div");
    o.style.visibility = "hidden";
    o.style.overflow = "scroll";
    document.body.appendChild(o);
    const i = document.createElement("div");
    o.appendChild(i);
    const w = o.offsetWidth - i.offsetWidth;
    o.remove();
    return w;
  }
  document.documentElement.style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`);

  document.querySelectorAll(".open-popup, .portfolio-item").forEach(trigger => {
    const popupId = trigger.dataset.popup;
    const popup   = document.getElementById(popupId);
    if (!popup) return;
    const content = popup.querySelector(".popup-content");
    const closeBtn = popup.querySelector(".close-popup");

    const openPopup = e => {
      const rect = content.getBoundingClientRect();
      content.style.transformOrigin = `${e.clientX - rect.left}px ${e.clientY - rect.top}px`;

      popup.style.display = "flex";
      document.body.classList.add("no-scroll");
      content.classList.remove("popup-close", "slide-out", "slide-in");
      content.classList.add("popup-open");
    };

    const closePopup = () => {
      content.classList.remove("popup-open", "slide-in");
      content.classList.add("popup-close");
      content.addEventListener("animationend", () => {
        popup.style.display = "none";
        document.body.classList.remove("no-scroll");
        content.classList.remove("popup-close");
      }, { once: true });
    };

    trigger.addEventListener("click", openPopup);
    closeBtn?.addEventListener("click", closePopup);
    popup.addEventListener("click", e => {
      if (e.target === popup) closePopup();
    });

    const nextBtn = popup.querySelector(".next-project-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        content.classList.remove("popup-open", "slide-in");
        content.classList.add("slide-out");

        content.addEventListener("animationend", () => {
          const idx = parseInt(popupId.replace("popup-portfolio", ""), 10);
          const nextIdx = idx === 9 ? 1 : idx + 1;
          const nextTrigger = document.querySelector(`.portfolio-item[data-popup="popup-portfolio${nextIdx}"]`);

          popup.style.display = "none";
          document.body.classList.remove("no-scroll");
          content.classList.remove("slide-out");

          if (nextTrigger) {
            setTimeout(() => {
              nextTrigger.click();
              const nextPopup = document.getElementById(`popup-portfolio${nextIdx}`);
              const nextContent = nextPopup.querySelector(".popup-content");
              nextContent.classList.remove("popup-open", "slide-out");
              nextContent.classList.add("slide-in");
            }, 50);
          }
        }, { once: true });
      });
    }
  });
});