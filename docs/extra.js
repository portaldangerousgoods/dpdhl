document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector(".md-sidebar--secondary nav");

  if (toc) {
    const img = document.createElement("img");
    img.src = "avião-dhl.gif";
    img.alt = "Avião DHL";
    img.style.width = "100px";
    img.style.display = "block";
    img.style.margin = "16px auto";

    // Insere o GIF logo após o índice
    toc.parentElement.appendChild(img);
  }
});
