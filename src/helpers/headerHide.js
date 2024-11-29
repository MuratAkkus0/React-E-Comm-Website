let lastScroll = 0;

export function checkHeaderVisibility(newY) {
  const header = document.querySelector("header");
  if (lastScroll > newY) {
    header.style.transform = "translateY(0)";
  } else {
    header.style.transform = "translateY(-100%)";
  }

  lastScroll = newY;
}
