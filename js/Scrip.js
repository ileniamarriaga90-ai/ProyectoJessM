// Vida International Ministries — script.js

document.addEventListener('DOMContentLoaded', function () {

  // Reveal-on-scroll: sections fade + rise into view as the user scrolls,
  // matching the reveal effect used on passioncitychurch.com
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

});