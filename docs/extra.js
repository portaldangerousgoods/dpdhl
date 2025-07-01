document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".md-sidebar--secondary nav");

  if (nav) {
    const gif = document.createElement("img");
    gif.src = "avião-dhl.gif";
    gif.style.width = "120px";
    gif.style.marginTop = "24px";
    gif.style.marginLeft = "10px";
    nav.appendChild(gif);
  }
});
