/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

// Preloader js    
$(window).on('load', function () {
  $('.preloader').fadeOut(100);
});

(function ($) {
  'use strict';

	// navbarDropdown
	if ($(window).width() < 992) {
		$('.navigation .dropdown-toggle').on('click', function () {
			$(this).siblings('.dropdown-menu').animate({
				height: 'toggle'
			}, 300);
		});
	}
  
  // product Slider
  $('.product-image-slider').slick({
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    customPaging: function (slider, i) {
      var image = $(slider.$slides[i]).data('image');
      return '<img class="img-fluid" src="' + image + '" alt="product-image">';
    }
  });

  // Product slider
  $('.product-slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

})(jQuery);

// puzzle animation control
// const layers = [
//     document.querySelector('.layer-1'),
//     document.querySelector('.layer-2'),
//     document.querySelector('.layer-3')
//   ];

//   let totalRotation = 0;
//   const targetRotation = 360; // degrees
//   let scrollEnabled = false;

//   // Lock page scroll initially
//   document.body.style.overflow = 'hidden';

//   window.addEventListener('wheel', (e) => {
//     if (scrollEnabled) return;

//     e.preventDefault();

//     // Adjust sensitivity
//     const delta = e.deltaY * 0.5;
//     totalRotation += delta;

//     // Cap rotation at 360
//     const clampedRotation = Math.min(totalRotation, targetRotation);

//     // Rotate each image with slight offsets
//     layers[0].style.transform = `rotate(${clampedRotation}deg)`;
//     layers[1].style.transform = `rotate(${clampedRotation + 5}deg)`;
//     layers[2].style.transform = `rotate(${clampedRotation - 5}deg)`;

//     if (totalRotation >= targetRotation) {
//       // Unlock page scroll after full rotation
//       document.body.style.overflow = 'auto';
//       scrollEnabled = true;
//     }
//   }, { passive: false });

document.querySelectorAll('img[data-src]').forEach(img => {
  const baseUrl = img.getAttribute('data-src');
  const today = new Date().toISOString().split('T')[0]; // e.g., '2025-06-23'
  img.src = baseUrl.replace('today', today);
});

// Update selected tab name on click and store in localStorage
document.querySelectorAll('.stakco-tab').forEach(link => {
  link.addEventListener('click', function () {
    const selectedName = this.getAttribute('data-name');
    localStorage.setItem('selectedPageName', selectedName);
    document.getElementById('selected-page-name').textContent = selectedName;
  });
});

// On page load, restore selected tab name from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('selectedPageName');
  if (saved) {
    document.getElementById('selected-page-name').textContent = saved;
  }

  // Clear tab name on homepage (optional reset)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    localStorage.removeItem('selectedPageName');
    document.getElementById('selected-page-name').textContent = ''; // Reset default
  }
});
