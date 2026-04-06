(() => {
  const modal = document.querySelector("[data-modal='contact']");
  const openers = document.querySelectorAll("[data-open-contact]");
  const closers = document.querySelectorAll("[data-close-contact]");
  const focusableSelector =
    "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";

  const open = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    const first = modal.querySelector(focusableSelector);
    first?.focus();
  };

  const close = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  openers.forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  }));

  closers.forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    close();
  }));

  modal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-modal-backdrop]")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (!modal) return;
    if (modal.getAttribute("aria-hidden") !== "false") return;
    if (e.key === "Escape") close();
  });

  // Nice-to-have: mailto submit that works offline
  const form = document.querySelector("[data-contact-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const details = String(fd.get("details") ?? "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry${company ? ` — ${company}` : ""}`);
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : null,
        email ? `Email: ${email}` : null,
        company ? `Company: ${company}` : null,
        "",
        details || "(No details provided)"
      ].filter(Boolean).join("\n")
    );

    const to = form.getAttribute("data-mailto") || "hello@example.com";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    close();
  });
})();

