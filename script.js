'use strict';

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable certain key combinations (Ctrl+U, Ctrl+Shift+I, F12, etc.)
document.onkeydown = function(e) {
    // Disable F12 key
    if (e.keyCode == 123) {
        return false;
    }
    // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }
}

/**
 * Add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * MOBILE NAVBAR TOGGLER
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");

const toggleNav = () => {
  navbar.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);

/**
 * HEADER ANIMATION
 * When scrolled down to 100px header will be active
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * SLIDER
 */
const slider = document.querySelector("[data-slider]");
const sliderContainer = document.querySelector("[data-slider-container]");
const sliderPrevBtn = document.querySelector("[data-slider-prev]");
const sliderNextBtn = document.querySelector("[data-slider-next]");

// Initial setup for the slider
let totalSliderVisibleItems = Number(getComputedStyle(slider).getPropertyValue("--slider-items"));
let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

let currentSlidePos = 0;

const moveSliderItem = function () {
  sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
}

/**
 * NEXT SLIDE
 */
const slideNext = function () {
  const slideEnd = currentSlidePos >= totalSlidableItems;

  if (slideEnd) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  moveSliderItem();
}

sliderNextBtn.addEventListener("click", slideNext);

/**
 * PREVIOUS SLIDE
 */
const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = totalSlidableItems;
  } else {
    currentSlidePos--;
  }

  moveSliderItem();
}

sliderPrevBtn.addEventListener("click", slidePrev);

/**
 * RESPONSIVE
 */
// Debounce function to limit the rate at which a function is executed
const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  }
}

const updateSliderDimensions = () => {
  totalSliderVisibleItems = Number(getComputedStyle(slider).getPropertyValue("--slider-items"));
  totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

  moveSliderItem();
}

window.addEventListener("resize", debounce(updateSliderDimensions, 200));

/**
 * TOUCH EVENTS FOR SLIDER
 */
let touchStartX = 0;

sliderContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

sliderContainer.addEventListener("touchmove", (e) => {
  if (!touchStartX) return;

  let touchEndX = e.touches[0].clientX;
  let touchDiff = touchStartX - touchEndX;

  if (touchDiff > 50) {
    slideNext();
    touchStartX = 0;
  } else if (touchDiff < -50) {
    slidePrev();
    touchStartX = 0;
  }
});
