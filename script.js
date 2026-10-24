const BUSINESS_CONTACT = {
  gmail: "walesfinish@gmail.com",
  whatsapp: "+2349073186201",
  phone: "+2349167752203",
  address: "No2 Ayangburen Road off Ikorodu Garage, Ikorodu, Lagos State",
};

const contactEmail = BUSINESS_CONTACT.gmail.trim();
const contactWhatsApp = BUSINESS_CONTACT.whatsapp.replace(/\D/g, "");
const contactPhone = BUSINESS_CONTACT.phone.replace(/[^\d+]/g, "");
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
const validPhone = /^\d{7,15}$/.test(contactWhatsApp);
const validTelephone = /^\+?\d{7,15}$/.test(contactPhone);
const contactAddress = BUSINESS_CONTACT.address.trim();

function configureContactChannel(channel, isConfigured, href, value, target) {
  const link = document.querySelector(`[data-contact-channel="${channel}"]`);
  const valueElement = link?.querySelector(".contact-channel-value");
  if (!link || !valueElement) return;

  if (!isConfigured) return;

  const action = {
    gmail: "Email",
    whatsapp: "Message on WhatsApp",
    phone: "Call",
    address: "Open map to",
  }[channel];

  link.href = href;
  link.setAttribute("aria-label", `${action} WALES FLOOR FINISH ${value}`);
  if (target) {
    link.target = target;
    link.rel = "noopener noreferrer";
  }
  valueElement.textContent = value;
  valueElement.removeAttribute("data-contact-placeholder");
}

configureContactChannel("gmail", validEmail, `mailto:${contactEmail}`, contactEmail);
configureContactChannel("whatsapp", validPhone, `https://wa.me/${contactWhatsApp}`, BUSINESS_CONTACT.whatsapp.trim(), "_blank");
configureContactChannel("phone", validTelephone, `tel:${contactPhone}`, BUSINESS_CONTACT.phone.trim());
configureContactChannel(
  "address",
  Boolean(contactAddress),
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`,
  contactAddress,
  "_blank",
);

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const menuLabel = menuToggle?.querySelector(".sr-only");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  if (menuLabel) menuLabel.textContent = "Open navigation menu";
  siteNav?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  if (menuLabel) menuLabel.textContent = isOpen ? "Open navigation menu" : "Close navigation menu";
  siteNav?.classList.toggle("is-open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const filterButtons = document.querySelectorAll(".filter-button");
const galleryCards = document.querySelectorAll(".gallery-card");
const galleryCount = document.querySelector("#gallery-count");
const galleryEmpty = document.querySelector("#gallery-empty");

function applyGalleryFilter(filter) {
  let visibleCount = 0;

  filterButtons.forEach((item) => {
    const isActive = item.dataset.filter === filter;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  galleryCards.forEach((card) => {
    const isVisible = filter === "all" || card.dataset.category.split(" ").includes(filter);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (galleryCount) {
    galleryCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
  }
  if (galleryEmpty) galleryEmpty.hidden = visibleCount > 0 || filter !== "carpet";
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyGalleryFilter(button.dataset.filter));
});

const requestedFilter = new URLSearchParams(window.location.search).get("filter");
if (requestedFilter && [...filterButtons].some((button) => button.dataset.filter === requestedFilter)) {
  applyGalleryFilter(requestedFilter);
}

const inquiryForm = document.querySelector("#inquiry-form");
const formStatus = document.querySelector("#form-status");

inquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!inquiryForm.reportValidity()) return;

  if (!validEmail) {
    if (formStatus) {
      formStatus.textContent = "The business email has not been set yet. Please contact the site owner to complete this enquiry.";
      formStatus.classList.add("is-error");
    }
    return;
  }

  const formData = new FormData(inquiryForm);
  const subject = `Flooring enquiry — ${formData.get("service")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Phone / WhatsApp: ${formData.get("phone")}`,
    `Service: ${formData.get("service")}`,
    `Project location: ${formData.get("location")}`,
    `Project details: ${formData.get("message") || "Not provided"}`,
  ].join("\n");

  if (formStatus) {
    formStatus.textContent = "Your email app is opening with the project details. Please review and send your enquiry.";
    formStatus.classList.remove("is-error");
  }

  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
