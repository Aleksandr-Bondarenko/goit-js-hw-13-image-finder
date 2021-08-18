import apiService from "./apiService";
import searchFormTpl from "./templates/searchFormTpl";
import galleryTpl from "./templates/galleryTpl";
import scrollIntoView from "./scrollIntoView";
import * as basicLightbox from "basiclightbox";

const bodyEl = document.querySelector("body");
bodyEl.innerHTML = searchFormTpl();

const galleryBox = document.getElementById("gallery-container");
const searchForm = document.getElementById("search-form");
const searchBtn = document.querySelector(".search-button");
const moreBtn = document.getElementById("more-button");
const inputField = searchForm.querySelector("input");

const renderGallery = (images) => {
  page += 1;
  url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${authorization}`;
  galleryBox.insertAdjacentHTML("beforeend", galleryTpl({ list: images }));
  moreBtn.classList.remove("hidden-btn");

  const nextImagesList = galleryBox.lastElementChild;
  scrollIntoView(nextImagesList);
};

const authorization = "22971640-b13f0b0978f0830ddac6b5885";
let searchQuery = "";
let page = 1;
let url = "";

const onSubmitForm = (e) => {
  e.preventDefault();
  galleryBox.innerHTML = "";
  searchBtn.classList.add("hidden-btn");

  page = 1;
  searchQuery = e.currentTarget.elements.query.value;

  url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${authorization}`;

  if (searchQuery.trim().length > 0) {
    apiService(url)
      .then((data) => {
        const images = data.hits;
        return images;
      })
      .then(renderGallery);

    searchForm.reset();
  }
};

const onMoreClick = () => {
  apiService(url)
    .then((data) => {
      const images = data.hits;
      return images;
    })
    .then(renderGallery);
};

const instance = basicLightbox.create(`
    <div class="modal">
    
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <img class="lightbox__image" src="" alt="" />
      </div>
    </div>
`);

instance.show();

searchForm.addEventListener("submit", onSubmitForm);
moreBtn.addEventListener("click", onMoreClick);
inputField.addEventListener("focus", () => {
  searchBtn.classList.remove("hidden-btn");
});
