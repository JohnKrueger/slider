;(function (window, $, undefined) {
    "use strict";
    
    $.jSlider = function(el, settings) {

        var base = el;
        var settings = base.s = $.extend({}, defaults, settings);


        base.init = function() {

            // Cache DOM elements
            base.$el      = $(el).addClass('sliderbase').wrap('<div class="sliderWrapper"><div class="sliderFrame" /></div>');
            base.$wrapper = base.$el.parent().closest('div.sliderWrapper');
            base.$frame   = base.$el.closest('div.sliderFrame');

            base.slide       = base.$el.children('li');
            base.slideLength = base.slide.length;
            base.slideWidth  = base.slide[0].offsetWidth;

            base.count = 0;
            base.flag  = false;

            if (base.s.autoPlay) { base.slideStart(); base.s.continuousScroll = true; }  // Checks if autoPlay is true, defauls continuousScroll to true
            if (base.s.enableControls) base.controls() // Checks if enableControls is true
            if (base.s.enableNavigation) base.navigation()  // Checks if enableNavigation is true
            
        }

        //ANIMATIONS
        base.transition = function() {

            base.$el.animate({
                'margin-left' : -( base.count * base.slideWidth )
            }, base.s.animationTime);
        }
            

        // SLIDESHOW FUNCTIONS
        base.slideStart = function() {

            base.go = setInterval(function() {
                base.goForward();
            }, base.s.delay );
            base.paused = false;
        }

        base.slidePause = function() {

            if (!base.paused) {
                clearInterval(base.go);
                base.paused = true;
            } else {
                base.slideStart();
            }
        }

        base.resetTimer = function() {

            clearInterval(base.go);
            base.slideStart();
        }

        // NAVIGATON FUNCTIONS
        base.goForward = function() {

            base.counter(1);
            base.transition();
        }

        base.goBack = function() {

            base.counter(-1);
            base.transition();
        }

        base.goToSlide = function( num ) {

            base.count = num;
            base.transition();
        }

        base.counter = function(num) {

            var pos = base.count;
            pos += num;
            base.count = ( pos < 0 ) ? base.slideLength - 1 : pos % base.slideLength;
        }

        base.timeOut = function() {

            base.flag = true;
            setTimeout(function() {
                base.flag = false;
            }, 300);
        },

        // BUILDER FUNCTIONS
        base.controls = function() {

            var $controlsDiv = $('<div class="slider-controls"></div>');
            $controlsDiv.appendTo(base.$wrapper);

            var $controlsClass = $(base.$wrapper.find('.slider-controls'));
            var $prevBtn = $('<button>Previous</button>');
            var $nextBtn = $('<button>Next</button>');

            // Append buttons
            $prevBtn.appendTo($controlsClass);
            $nextBtn.appendTo($controlsClass);

            // Bind click events
            $prevBtn.on('click', function() {
                if (!base.flag) {
                    base.timeOut();
                    base.goBack();
                    if (base.s.continuousScroll && !base.s.autoPlayLocked) base.resetTimer()
                } 
            });

            $nextBtn.on('click', function() {
                if (!base.flag) {
                    base.timeOut();
                    base.goForward();
                    if (base.s.continuousScroll && !base.s.autoPlayLocked) base.resetTimer()
                }
            });

            // Pause button, easier the put all code here than make 3 different if statements
            if (base.s.continuousScroll && base.s.enablePause) {
                var $pauseBtn = $('<button>Pause</button>');
                $pauseBtn.appendTo($controlsClass);
                $pauseBtn.on('click', function() {
                    if (!base.flag) {
                        base.timeOut();
                        base.slidePause();
                    }
                });
            }
        }

        base.navigation = function() {

            var $navDiv = $('<div class="slider-nav"></div>');
            $navDiv.appendTo(base.$wrapper)

            var $navClass = $(base.$wrapper.find('.slider-nav'));
            var $navBtn = [];

            // Creates a button for each slide
            for (var i = 0; i < base.slideLength; i++) {
                $navBtn[i] = $('<button>Slide # ' + (i + 1) + '</button>');
                $navBtn[i].appendTo($navClass);
            }

            // Binds click event to each button
            $.each($navBtn, function(index, val) {
                $navBtn[index].on('click', function() {

                    if (!base.flag) {
                        base.timeOut();
                        base.goToSlide(index);
                        if (base.s.continuousScroll && !base.s.autoPlayLocked) base.resetTimer()
                    }    
                });
            });
        }

        return base.init()
    }


    
    $.fn.mySlider = function(settings) {

        return this.each(function() {
          
            var $this = $(this),
                data  = $this.data("mySlider");

                if (!data) $this.data("mySlider", (data = new $.jSlider(this, settings)));
        });
    }

    var defaults = {

        // Animation
        slide              : true,
        fade               : false,

        // Autoplay
        autoPlay            : true,     // If true, the slideshow will start on its own, it will also make continuousScroll = true.
        autoPlayLocked      : false,    // If true, manually changing slides will not reset the slideshow timer.
        continuousScroll    : false,     // If true, the slideshow will proceed on its own.

         // Controls
        enableControls      : true,         // If true, builds the control buttons (prev, next, pause).  
        enablePause         : true,         // If true, pause btn will be turned on, does nothing if controls = false.
        enableNavigation    : true,      // if false, navigation links will still be visible, but not clickable.

        // Times
        delay               : 2000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
        animationTime       : 400       // How long the slideshow transition takes (in milliseconds)
    };

})(window, jQuery);
