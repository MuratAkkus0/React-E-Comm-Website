let lastScroll = 0;

export function checkHeaderVisibility(newY) {
  const header = document.querySelector("header");
  const basket = document.querySelector(".basket--container");
  if (newY <= 100) {
    header.style.transform = "translateY(0)";
    return;
  }
  if (lastScroll > newY) {
    header.style.transform = "translateY(0)";
    basket.style.top = "var(--header-max-height)";
  } else {
    header.style.transform = "translateY(-100%)";
    basket.style.top = "0";
  }

  lastScroll = newY;
}
