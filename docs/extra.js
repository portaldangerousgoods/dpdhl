document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".md-sidebar--secondary");
  if (sidebar) {
    const img = document.createElement("img");
    img.src = "avião-dhl.gif";
    img.alt = "Avião DHL";
    img.style.width = "100px";
    img.style.display = "block";
    img.style.margin = "20px auto 0";
    sidebar.appendChild(img);
  }
});
