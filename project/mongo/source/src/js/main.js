//= ../../bower_components/jquery/dist/jquery.min.js
//= ../../bower_components/jquery-ui/jquery-ui.min.js
//= ../js/vendor/jquery.scrollTo.min.js
//= ../js/vendor/owl.carousel.js
//= ../js/vendor/jquery.plugin.min.js
//= ../js/vendor/jquery.countdown.min.js
//= ../js/vendor/jquery.countdown-ru.js

// Smooth scroll

  // Bind to the click of all links with a #hash in the href
  $('a[href^="#"]').click(function(e) {
    // Prevent the jump and the #hash from appearing on the address bar
    e.preventDefault();
    // Scroll the window, stop any previous animation, stop on user manual scroll
    // Check https://github.com/flesler/jquery.scrollTo for more customizability
    $(window).stop(true).scrollTo(this.hash, {duration:1000, interrupt:true});
  });



// Gallery
$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    responsive:{
        0:{
            items:1
        },
        768:{
            items:1
        },
        1200:{
            items:4
        }
    }
});

$('.owl-carousel--review').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    responsive:{
        0:{
            items:2
        },
        768:{
            items:2
        },
        1200:{
            items:2
        }
    }
});

// Tabs
$(function() {
    $( "#tabs" ).tabs();
  });

// Accordion
$(function() {
    var icons = {
      header: "ui-icon-circle-arrow-e",
      activeHeader: "ui-icon-circle-arrow-s"
    };
    $( "#accordion" ).accordion({
      icons: icons
    });
    $( "#toggle" ).button().click(function() {
      if ( $( "#accordion" ).accordion( "option", "icons" ) ) {
        $( "#accordion" ).accordion( "option", "icons", null );
      } else {
        $( "#accordion" ).accordion( "option", "icons", icons );
      }
    });
  });


// Countdown
$( "#countdown" ).countdown({until: new Date(2015, 10-1, 25)});