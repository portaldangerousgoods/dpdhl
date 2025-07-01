document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector(".md-sidebar--secondary nav");

  if (toc) {
    const img = document.createElement("img");
    img.src = "/dpdhl/avião-dhl.gif"; // <-- Caminho absoluto
    img.alt = "Avião DHL";
    img.style.width = "100px";
    img.style.display = "block";
    img.style.margin = "16px auto";

    toc.parentElement.appendChild(img);
  }
});
