const gallery = document.querySelector(".gallery");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeBtn = document.querySelector(".close-viewer");

gallery.addEventListener("click", (event) => {
  const clickedImage = event.target.closest("img");
  if (!clickedImage) return;

  const src = clickedImage.getAttribute("src");
  const alt = clickedImage.getAttribute("alt");

  const fullSrc = src.replace("-small", "-full");

  modalImage.src = fullSrc;
  modalImage.alt = alt;
  modal.showModal();
});

closeBtn.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});
