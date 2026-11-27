const workflow = document.querySelector("[data-workflow]");
if (workflow) {
  const steps = [
    { id: "link", heading: "Start with a video link.", description: "Paste it into the Desktop Workspace." },
    { id: "clip", heading: "Get editable highlights.", description: "Choose the clip length, captions, and whether to trim long pauses." },
    { id: "studio", heading: "Finish the short in Studio.", description: "Adjust the cut, captions, and audio, then export on your PC." }
  ];
  const choices = workflow.querySelector(".workflow-choices");
  const buttons = [...choices.querySelectorAll("[data-demo-step]")];
  const toggle = workflow.querySelector("[data-demo-toggle]");
  const heading = workflow.querySelector("[data-demo-heading]");
  const description = workflow.querySelector("[data-demo-description]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selected = 0;
  let timer;

  function renderStep(index) {
    selected = index;
    const step = steps[index];
    workflow.dataset.step = step.id;
    heading.textContent = step.heading;
    description.textContent = step.description;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.demoStep === step.id));
    }
  }

  function setPlaying(playing) {
    window.clearInterval(timer);
    timer = playing ? window.setInterval(() => {
      if (!document.hidden && workflow.getBoundingClientRect().bottom > 0) {
        renderStep((selected + 1) % steps.length);
      }
    }, 4000) : undefined;
    toggle.textContent = playing ? "Pause" : "Play";
  }

  for (const [index, button] of buttons.entries()) {
    button.addEventListener("click", () => {
      setPlaying(false);
      renderStep(index);
    });
  }
  toggle.addEventListener("click", () => setPlaying(timer === undefined));
  reducedMotion.addEventListener("change", () => setPlaying(!reducedMotion.matches));
  choices.hidden = false;
  toggle.hidden = false;
  setPlaying(!reducedMotion.matches);
}

const studioTour = document.querySelector("[data-studio-tour]");

if (studioTour) {
  const previews = {
    timeline: {
      image: "assets/studio-timeline.webp",
      alt: "A sample hiking short open in Studio with a portrait preview above video, caption, and audio tracks",
      caption: "A sample short in Studio with separate tracks for video, captions, and audio.",
      width: 1536, height: 960
    },
    projects: {
      image: "assets/studio-projects.webp",
      alt: "Studio Editor home with a red Create project button, saved projects, and clips from the downloads folder",
      caption: "Create a blank project, reopen an edit, or start with a clip from your downloads.",
      width: 1220, height: 780
    },
    speech: {
      image: "assets/studio-speech.webp",
      alt: "The Captions panel in Studio with a portrait hiking short and caption and spoken audio tracks",
      caption: "Work with captions and spoken audio on their own tracks.",
      width: 1536, height: 960
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
      photo.width = preview.width;
      photo.height = preview.height;
      photo.src = preview.image;
      link.href = preview.image;
      link.dataset.screenshotTitle = button.textContent.trim();
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
  const controls = gallery.querySelector(".gallery-dialog-nav");
  const previous = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = -1;
  let opener = null;

  function showScreenshot(link) {
    const thumbnail = link.querySelector("img");
    const label = link.dataset.screenshotTitle || link.querySelector("span")?.textContent;
    index = cards.indexOf(link);
    photo.src = link.href;
    photo.alt = thumbnail.alt || label;
    gallery.style.setProperty("--photo-ratio", thumbnail.width && thumbnail.height
      ? Number(thumbnail.getAttribute("width")) / Number(thumbnail.getAttribute("height"))
      : 1.6);
    title.textContent = label;
    controls.hidden = index === -1;
    count.textContent = index === -1 ? "" : (index + 1) + " of " + cards.length;
    previous.disabled = index <= 0;
    next.disabled = index === -1 || index === cards.length - 1;
  }

  function stepGallery(direction) {
    if (index === -1 || gallery.classList.contains("is-closing")) return;
    const link = cards[index + direction];
    if (link) showScreenshot(link);
  }

  function closeViewer() {
    if (!gallery.open || gallery.classList.contains("is-closing")) return;
    if (reducedMotion.matches) {
      gallery.close();
      return;
    }
    gallery.classList.add("is-closing");
    window.setTimeout(() => gallery.close(), 160);
  }

  for (const link of document.querySelectorAll(".gallery-card, [data-screenshot-title]")) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (gallery.open) return;
      opener = link;
      showScreenshot(link);
      gallery.showModal();
    });
  }

  previous.addEventListener("click", () => stepGallery(-1));
  next.addEventListener("click", () => stepGallery(1));
  gallery.addEventListener("click", (event) => {
    if (event.target !== photo && !event.target.closest("[data-gallery-prev], [data-gallery-next]")) closeViewer();
  });
  gallery.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeViewer();
  });
  gallery.addEventListener("close", () => {
    gallery.classList.remove("is-closing");
    opener?.focus({ preventScroll: true });
    opener = null;
  });
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") stepGallery(-1);
    if (event.key === "ArrowRight") stepGallery(1);
  });
}

const releaseQuery = document.querySelector("#release-query");
if (releaseQuery) {
  const entries = [...document.querySelectorAll(".release-entry")];
  const ranges = [...document.querySelectorAll(".release-range")];
  const jumps = document.querySelector(".release-jumps");
  const result = document.querySelector("#release-results");
  const searchable = entries.map(entry => entry.textContent.toLowerCase().replace(/\s+/g, " "));
  let openBeforeSearch = null;

  function showLinkedRelease() {
    const selected = document.getElementById(location.hash.slice(1));
    if (selected?.classList.contains("release-entry")) selected.open = true;
  }

  showLinkedRelease();
  window.addEventListener("hashchange", showLinkedRelease);
  releaseQuery.addEventListener("input", () => {
    const terms = releaseQuery.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const filtering = terms.length > 0;
    if (filtering && !openBeforeSearch) openBeforeSearch = entries.map(entry => entry.open);
    let visible = 0;
    for (const [index, entry] of entries.entries()) {
      entry.hidden = filtering && !terms.every(term => searchable[index].includes(term));
      if (!entry.hidden) visible += 1;
      if (filtering) entry.open = !entry.hidden;
      else if (openBeforeSearch) entry.open = openBeforeSearch[index];
    }
    if (!filtering) openBeforeSearch = null;
    for (const range of ranges) {
      range.hidden = !range.querySelector(".release-entry:not([hidden])");
    }
    jumps.hidden = filtering;
    result.textContent = visible === 0 ? "No matching versions. Try a different search." :
      visible + (visible === 1 ? " version" : " versions");
  });
}
