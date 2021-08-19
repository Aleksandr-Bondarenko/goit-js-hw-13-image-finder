import apiService from "./apiService";
import searchFormTpl from "./templates/searchFormTpl";
import galleryTpl from "./templates/galleryTpl";
import scrollIntoView from "./scrollIntoView";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import { error, Stack } from "@pnotify/core";

import * as basicLightbox from "basiclightbox";

const bodyEl = document.querySelector("body");
bodyEl.innerHTML = searchFormTpl();

const refs = {
  galleryBox: document.getElementById("gallery-container"),
  searchForm: document.getElementById("search-form"),
  moreBtn: document.getElementById("more-button"),
  inputField: document.querySelector("input"),
};

const authorization = "22971640-b13f0b0978f0830ddac6b5885";
let searchQuery = "";
let page = null;
let url = "";

const onSubmitForm = (e) => {
  e.preventDefault();
  refs.galleryBox.innerHTML = "";
  refs.moreBtn.classList.add("hidden-btn");
  page = 1;
  searchQuery = e.currentTarget.elements.query.value;
  url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${authorization}`;

  if (searchQuery.trim().length > 0) {
    apiService(url)
      .then((data) => {
        console.log(data);
        const allImages = data.totalHits;
        const currentImages = data.hits;

        if (allImages === 0) {
          console.log("error");
          const message =
            "Nothing was found of your request. Please, enter more specific request!";
          return callError(message);
        } else if (allImages <= 12) {
          refs.moreBtn.classList.add("hidden-btn");
        } else {
          refs.moreBtn.classList.remove("hidden-btn");
        }
        return currentImages;
      })
      .then(renderGallery)
      .catch(callError);

    refs.searchForm.reset();
  }
};

const renderGallery = (images) => {
  page += 1;
  url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${authorization}`;
  refs.galleryBox.insertAdjacentHTML("beforeend", galleryTpl({ list: images }));
  const nextImagesList = refs.galleryBox.lastElementChild;
  scrollIntoView(nextImagesList);

  const listEl = document.querySelector("#gallery-container");

  listEl.addEventListener("click", onImageClick);
};

const onImageClick = (e) => {
  console.log("Image Click");
  console.log(e.target.hasAttribute("src"));

  const bigImgSrc = e.target.getAttribute("bigImgSrc");

  const instance = basicLightbox.create(`
    <img src="${bigImgSrc}" width="800" height="600">
`);

  if (e.target.hasAttribute("src")) {
    instance.show();
  }
};

const onMoreClick = () => {
  console.log(url);
  apiService(url)
    .then((data) => {
      console.log(data);
      const currentImages = data.hits;
      const allImages = data.totalHits;

      if (currentImages.length < 12 || allImages % currentImages.length === 0) {
        refs.moreBtn.classList.add("hidden-btn");
      } else {
        refs.moreBtn.classList.remove("hidden-btn");
      }
      return currentImages;
    })
    .then(renderGallery);
};

const callError = (message) => {
  const myError = error({
    text: `${message}`,
    mode: "light",
    closerHover: true,
    delay: 4000,
    stack: new Stack({
      dir1: "down",
      dir2: "right",
      firstpos1: 10,
      firstpos2: 10,

      context: document.body,
    }),
    sticker: false,
  });
};

refs.searchForm.addEventListener("submit", onSubmitForm);
refs.moreBtn.addEventListener("click", onMoreClick);
