// Contact form
const form = document.getElementById("contact-form");

function showAlert(message) {
  const alertBox = document.querySelector(".alert_style");
  const status = document.getElementById("alert");

  if (!alertBox || !status) return;

  status.textContent = message;
  alertBox.style.display = "block";

  window.setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  try {
    const response = await fetch(event.currentTarget.action, {
      method: event.currentTarget.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    showAlert("Your message has been sent.");
    event.currentTarget.reset();
  } catch (error) {
    showAlert(
      "Oops! There was a problem delivering your message, please contact via other means."
    );
  }
}

if (form) {
  form.addEventListener("submit", handleSubmit);

  form.querySelectorAll("input, textarea").forEach((field) => {
    const wrapper = field.parentElement;

    field.addEventListener("input", () => {
      const hasValue = field.value.trim().length > 0;
      wrapper.classList.toggle("valid", hasValue);
      wrapper.classList.toggle("invalid", !hasValue);
    });

    field.addEventListener("focusin", () => {
      wrapper.classList.add("focusIn");
    });

    field.addEventListener("focusout", () => {
      wrapper.classList.remove("focusIn");
    });
  });
}

// Mobile navigation
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

navToggle?.addEventListener("click", () => {
  navMenu?.classList.add("show-menu");
});

navClose?.addEventListener("click", () => {
  navMenu?.classList.remove("show-menu");
});

document.querySelectorAll(".nav_link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("show-menu");
  });
});

// Skills accordion
const skillContent = [...document.querySelectorAll(".skill")];
const skillHeaders = document.querySelectorAll(".skills_header");

skillHeaders.forEach((header, index) => {
  header.addEventListener("click", () => {
    skillContent[index]?.classList.toggle("skills_open");
  });
});

// Qualification tabs
const education = document.getElementById("education");
const work = document.getElementById("work");
const educationHeader = document.getElementById("educationheader");
const workHeader = document.getElementById("workheader");

function setQualificationTab(activeSection, inactiveSection, activeHeader, inactiveHeader) {
  activeSection?.classList.remove("qualification-inactive");
  inactiveSection?.classList.add("qualification-inactive");

  if (activeHeader) activeHeader.style.color = "var(--first-color)";
  if (inactiveHeader) inactiveHeader.style.color = "var(--text-color)";
}

if (education && work && educationHeader && workHeader) {
  setQualificationTab(education, work, educationHeader, workHeader);

  educationHeader.addEventListener("click", () => {
    if (education.classList.contains("qualification-inactive")) {
      setQualificationTab(education, work, educationHeader, workHeader);
    }
  });

  workHeader.addEventListener("click", () => {
    if (work.classList.contains("qualification-inactive")) {
      setQualificationTab(work, education, workHeader, educationHeader);
    }
  });
}

// Certificate carousel + category filters
const swiperElement = document.querySelector(".mySwiper");

if (swiperElement && typeof Swiper !== "undefined") {
  const certificateWrapper = swiperElement.querySelector(".swiper-wrapper");
  const originalCertificateSlides = certificateWrapper
    ? [...certificateWrapper.querySelectorAll(".certificate_content")].map((slide) => slide.outerHTML)
    : [];

  const professionalTitles = new Set([
    "Basic DevOps",
    "Creating Professional Application Database",
    "SAP Certified - SAP Business One",
    "Cisco Certified Network Associate Security (CCNA)",
    "Cisco Certified Network Associate Cyber Ops (CCNA)",
    "Cobit 2019 Framework & Methodology",
  ]);

  const classifyCertificate = (slideHtml) => {
    const title = slideHtml.match(/<h3[^>]*class="certificate_title"[^>]*>([\s\S]*?)<\/h3>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    if (!title) return "other";
    if (professionalTitles.has(title)) return "professional";
    if (title === "Al Ghurair Investment" || title === "Personal Certificate Website") return "other";
    return "course";
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "professional", label: "Professional" },
    { key: "course", label: "Courses & Training" },
  ];

  const filterContainer = document.createElement("div");
  filterContainer.className = "certificate_filters";
  filterContainer.setAttribute("role", "group");
  filterContainer.setAttribute("aria-label", "Certificate categories");

  filters.forEach(({ key, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "certificate_filter";
    button.dataset.filter = key;
    button.textContent = label;
    filterContainer.appendChild(button);
  });

  swiperElement.parentElement?.insertBefore(filterContainer, swiperElement);

  const swiper = new Swiper(swiperElement, {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    mousewheel: true,
    keyboard: true,
  });

  const applyCertificateFilter = (filter) => {
    const selectedSlides = filter === "all"
      ? originalCertificateSlides
      : originalCertificateSlides.filter((slide) => classifyCertificate(slide) === filter);

    swiper.removeAllSlides();
    swiper.appendSlide(selectedSlides);
    swiper.update();
    swiper.slideTo(0, 0);

    filterContainer.querySelectorAll(".certificate_filter").forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  filterContainer.querySelectorAll(".certificate_filter").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.filter === "all" ? "true" : "false");
    button.addEventListener("click", () => applyCertificateFilter(button.dataset.filter));
  });
}

// Scroll-based navigation state
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 50;
    const sectionId = section.id;
    const navLink = document.querySelector(
      '.nav_menu a[href="#' + sectionId + '"]'
    );

    if (!navLink) return;

    const isActive =
      scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;

    navLink.classList.toggle("active-link", isActive);
  });
}

window.addEventListener("scroll", scrollActive, { passive: true });

// Header shadow
function scrollHeader() {
  const header = document.getElementById("header");

  if (!header) return;

  header.classList.toggle("scroll-header", window.scrollY >= 80);
}

window.addEventListener("scroll", scrollHeader, { passive: true });

// Scroll-to-top button
function scrollUp() {
  const scrollUpButton = document.getElementById("scroll-up");

  if (!scrollUpButton) return;

  scrollUpButton.classList.toggle("show-scroll", window.scrollY >= 560);
}

window.addEventListener("scroll", scrollUp, { passive: true });

// Dark/light theme
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

if (themeButton) {
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");

  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";

  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

  if (selectedTheme) {
    document.body.classList.toggle(darkTheme, selectedTheme === "dark");
    themeButton.classList.toggle(iconTheme, selectedIcon === "uil-moon");
  }

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });
}

// Typing animation
const typeTarget = document.querySelector(".type");

if (typeTarget && typeof Typed !== "undefined") {
  new Typed(typeTarget, {
    strings: ["System Administration", "Data Science", "Human Capital Staff"],
    smartBackspace: true,
    startDelay: 1000,
    typeSpeed: 130,
    backDelay: 1000,
    backSpeed: 60,
    loop: true,
  });
}
