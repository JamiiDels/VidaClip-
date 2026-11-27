const workflow = document.querySelector("[data-workflow]");
if (workflow) {
  const topics = {
    autoClip: [
      { id: "link", label: "Paste a link", heading: "Start with a video link.", description: "Paste it into the Desktop Workspace." },
      { id: "clip", label: "Find highlights", heading: "Set the length and the extras.", description: "Pick 5, 10, 15, or 20 seconds. Choose captions, dead-air removal, a spoken intro, or sound effects." },
      { id: "studio", label: "Edit in Studio", heading: "Finish the short in Studio.", description: "Review each draft on its own timeline and adjust the cuts, captions, and audio." }
    ],
    clipper: [
      { id: "mark", label: "Mark the start", image: "clipper", alt: "VidaClip floating Clip control above a sample video", heading: "Start clipping while you watch.", description: "Click the floating Clip button at the moment you want to start." },
      { id: "save", label: "Save the cut", image: "clip-options", alt: "A clip card with start and end timestamps", heading: "Stop at the moment you want to keep.", description: "Click the control again to mark the end. Your clip appears in the popup with both timestamps." },
      { id: "options", label: "Clip options", image: "clip-options", alt: "Saved clip with a quality menu and Download clip and Edit in Studio options", heading: "Choose what to do with the clip.", description: "Rename it, select a quality, download it through Desktop, or open the edit in Studio." }
    ],
    cleanup: [
      { id: "choose", label: "Choose files", image: "cleanup", alt: "AI Label Remover tab with the image and video drop area", heading: "Drop in photos or videos.", description: "Open AI Label Remover in the extension preview, or use Remove all AI Labels in Desktop." },
      { id: "process", label: "Clean metadata", image: "cleanup", alt: "AI Label Remover controls and supported metadata", heading: "Clean supported embedded metadata.", description: "VidaClip runs the cleanup locally and saves new copies. A batch can include photos and videos." },
      { id: "results", label: "Check results", image: "cleanup", alt: "AI Label Remover panel with its usage information", heading: "Check the cleanup in Desktop.", description: "The Activity Stream shows detected markers and the result for each file." }
    ],
    speech: [
      { id: "script", label: "Write the script", image: "speech-controls", alt: "Studio text-to-speech panel with a voiceover text box", heading: "Type what you want the narrator to say.", description: "Open Text to Speech in Studio and enter your script." },
      { id: "voice", label: "Pick a voice", image: "speech-controls", alt: "Voice source, voice, speed, and style controls", heading: "Choose a voice and reading speed.", description: "Use an installed Windows voice or a local English neural voice. Generate and preview it on your PC." },
      { id: "place", label: "Add to timeline", image: "speech-track", alt: "Spoken intro on its own Studio timeline track", heading: "Place the narration on a track.", description: "Move the voiceover to match the edit, then export it with the rest of the project." }
    ],
    download: [
      { id: "paste", label: "Paste the URL", image: "download", alt: "Downloader link field with a sample video URL", heading: "Save a video from a link.", description: "Paste an individual video link in Desktop. The updated extension also offers a Downloader tab." },
      { id: "quality", label: "Choose quality", image: "download", alt: "Video Downloader with the 1080p quality setting", heading: "Pick the quality before downloading.", description: "Choose Auto or a resolution. Available quality depends on the source." },
      { id: "library", label: "Find your video", image: "clip-options", alt: "A saved video with its MP4 filename and Studio edit option", heading: "Open the result from Clips.", description: "Keep track of the download in Desktop’s Activity Stream and use the saved video in Studio." }
    ],
    editor: [
      { id: "tracks", label: "Layer the edit", image: "studio-tracks", alt: "Studio timeline with separate audio, captions, and video tracks", heading: "Give each part of the edit its own track.", description: "Split clips, drag them between tracks, and adjust captions and audio separately." },
      { id: "layout", label: "Pick a layout", image: "studio-layouts", alt: "Quick Clip layout controls beside source and output previews", heading: "Reframe for your platform.", description: "Choose a split, stack, or picture-in-picture layout for the shot." },
      { id: "export", label: "Export locally", image: "studio-export", alt: "Studio export settings for resolution, frame rate, and codec", heading: "Export the finished cut on your PC.", description: "Review resolution, frame rate, and codec. Studio exports have no VidaClip watermark." }
    ]
  };
  const topicBar = workflow.querySelector(".workflow-topics");
  const topicButtons = [...topicBar.querySelectorAll("[data-demo-topic]")];
  const choices = workflow.querySelector(".workflow-choices");
  const buttons = [...choices.querySelectorAll("[data-demo-step]")];
  const toggle = workflow.querySelector("[data-demo-toggle]");
  const heading = workflow.querySelector("[data-demo-heading]");
  const description = workflow.querySelector("[data-demo-description]");
  const shot = workflow.querySelector("[data-demo-shot]");
  const image = workflow.querySelector("[data-demo-image]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let topic = "autoClip";
  let selected = 0;
  let timer;

  function renderStep(index) {
    selected = index;
    const steps = topics[topic];
    const step = steps[index];
    workflow.dataset.topic = topic;
    workflow.dataset.step = step.id;
    heading.textContent = step.heading;
    description.textContent = step.description;
    shot.hidden = !step.image;
    if (step.image) {
      const src = "assets/walkthrough/" + step.image + ".webp";
      if (image.getAttribute("src") !== src) image.src = src;
      image.alt = step.alt;
      shot.href = src;
      shot.dataset.screenshotTitle = step.label;
    }
    for (const [position, button] of buttons.entries()) {
      button.dataset.demoStep = steps[position].id;
      button.textContent = steps[position].label;
      button.setAttribute("aria-pressed", String(position === selected));
    }
  }

  function setPlaying(playing) {
    window.clearInterval(timer);
    timer = playing ? window.setInterval(() => {
      const bounds = workflow.getBoundingClientRect();
      if (!document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight) {
        renderStep((selected + 1) % topics[topic].length);
      }
    }, 4000) : undefined;
    toggle.textContent = playing ? "Pause" : "Play";
  }

  for (const button of topicButtons) {
    button.addEventListener("click", () => {
      setPlaying(false);
      topic = button.dataset.demoTopic;
      for (const option of topicButtons) {
        option.setAttribute("aria-pressed", String(option === button));
      }
      renderStep(0);
    });
  }
  for (const [index, button] of buttons.entries()) {
    button.addEventListener("click", () => {
      setPlaying(false);
      renderStep(index);
    });
  }
  toggle.addEventListener("click", () => setPlaying(timer === undefined));
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) setPlaying(false);
  });
  topicBar.hidden = false;
  choices.hidden = false;
  toggle.hidden = false;
  renderStep(0);
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

const screenshotGallery = document.querySelector("#screenshots");
if (screenshotGallery) {
  function openLinkedGallery() {
    if (location.hash === "#screenshots") screenshotGallery.open = true;
  }
  openLinkedGallery();
  window.addEventListener("hashchange", openLinkedGallery);
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
    const width = Number(thumbnail.getAttribute("width")) || thumbnail.naturalWidth;
    const height = Number(thumbnail.getAttribute("height")) || thumbnail.naturalHeight;
    gallery.style.setProperty("--photo-ratio", width && height ? width / height : 1.6);
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
