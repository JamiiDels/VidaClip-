const studioTour = document.querySelector("[data-studio-tour]");

if (studioTour) {
  const previews = {
    timeline: {
      image: "assets/studio-timeline.webp",
      alt: "VidaClip Studio with a portrait preview, a transform inspector, and several editable timeline tracks",
      caption: "An Auto Clip draft opened in Studio with separate video, caption, and audio clips."
    },
    projects: {
      image: "assets/studio-projects.webp",
      alt: "Studio Editor home with a red Create project button, saved projects, and clips from the downloads folder",
      caption: "Create a blank project, reopen an edit, or start with a clip from your downloads."
    },
    speech: {
      image: "assets/studio-speech.webp",
      alt: "VidaClip Studio showing editable captions and voice clips on the timeline",
      caption: "Work with captions and spoken audio on their own tracks."
    }
  };
  const tourButtons = [...studioTour.querySelectorAll("[data-preview]")];
  const photo = document.querySelector("#tour-photo");
  const link = document.querySelector("#tour-link");
  const caption = document.querySelector("#tour-caption");

  for (const button of tourButtons) {
    button.addEventListener("click", () => {
      const preview = previews[button.dataset.preview];
      for (const option of tourButtons) {
        option.setAttribute("aria-pressed", String(option === button));
      }
      photo.alt = preview.alt;
      photo.src = preview.image;
      link.href = preview.image;
      link.setAttribute("aria-label", "Open the full " + button.textContent.trim() + " screenshot");
      caption.textContent = preview.caption;
    });
  }
}

const billingButtons = [...document.querySelectorAll("[data-billing]")];
const checkoutPlans = [...document.querySelectorAll(".plan[data-year]")].map((plan) => ({
  month: plan.dataset.month,
  year: plan.dataset.year,
  annualLink: plan.dataset.yearLink,
  monthlyLink: plan.querySelector(".checkout").getAttribute("href"),
  link: plan.querySelector(".checkout"),
  price: plan.querySelector(".price-amount"),
  period: plan.querySelector(".price-period")
}));

for (const button of billingButtons) {
  button.addEventListener("click", () => {
    const annual = button.dataset.billing === "annual";
    for (const option of billingButtons) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    for (const plan of checkoutPlans) {
      plan.price.textContent = "$" + (annual ? plan.year : plan.month);
      plan.period.textContent = annual ? "/ year" : "/ month";
      plan.link.href = annual ? plan.annualLink : plan.monthlyLink;
    }
  });
}

const gallery = document.querySelector("#gallery-viewer");
if (gallery && typeof gallery.showModal === "function") {
  const cards = [...document.querySelectorAll(".gallery-card")];
  const photo = gallery.querySelector("#gallery-full");
  const title = gallery.querySelector("#gallery-title");
  const count = gallery.querySelector("#gallery-count");
  const previous = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  let index = 0;

  function showScreenshot(position) {
    if (position < 0 || position >= cards.length) return;
    index = position;
    const card = cards[index];
    photo.src = card.href;
    photo.alt = card.querySelector("img").alt;
    title.textContent = card.querySelector("span").textContent;
    count.textContent = (index + 1) + " of " + cards.length;
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }

  for (const [position, card] of cards.entries()) {
    card.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showScreenshot(position);
      gallery.showModal();
    });
  }

  previous.addEventListener("click", () => showScreenshot(index - 1));
  next.addEventListener("click", () => showScreenshot(index + 1));
  gallery.querySelector("[data-gallery-close]").addEventListener("click", () => gallery.close());
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showScreenshot(index - 1);
    if (event.key === "ArrowRight") showScreenshot(index + 1);
  });
}
