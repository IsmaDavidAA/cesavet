const setupMenu = () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#menu");
  if (!toggle || !menu) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
    menu.classList.toggle("is-open", !open);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) close();
  });
};

const setupVisit = () => {
  const form = document.querySelector("#visita-form");
  const tipo = form?.querySelector("[name='tipo']");
  const button = form?.querySelector("[data-submit]");
  if (!form || !tipo || !button) return;

  const motivos = {
    consulta: "Consulta",
    vacuna: "Vacuna",
    eco: "Ecografía",
  };

  const sync = () => {
    const urgent = tipo.value === "urgencia";
    button.textContent = urgent ? "Llamar a emergencias" : "Enviar por WhatsApp";
    button.classList.toggle("btn-alert", urgent);
    button.classList.toggle("btn-wa", !urgent);
    form.querySelectorAll("[name='nombre'], [name='mascota'], [name='detalle']").forEach((field) => {
      field.required = !urgent;
    });
  };

  tipo.addEventListener("change", sync);
  sync();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const clean = (key) => String(data.get(key) || "").trim().replace(/\s+/g, " ");
    if (tipo.value === "urgencia") {
      window.location.href = "tel:+59144661138";
      return;
    }
    const message = [
      "Hola, CESAVET. Quiero agendar.",
      `Motivo: ${motivos[tipo.value] || "Consulta"}.`,
      `Soy ${clean("nombre")}.`,
      `Mascota: ${clean("mascota")}.`,
      clean("detalle"),
    ].join(" ");
    const url = `https://wa.me/59170769984?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  });
};

setupMenu();
setupVisit();
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
