;(function($) {

    var base;
    
    $.fn.mySlider = function(el, settings) {

        var settings = s = $.extend({}, defaults, settings);
        
        function Slider(el, settings) {

            

            // Cache DOM elements
            base          = this;
            base.$el      = $(el).addClass('sliderBase').wrap('<div class="sliderWrapper"><div class="sliderFrame" /></div>');
            base.$wrapper = base.$el.parent().closest('div.sliderWrapper');
            base.$frame   = base.$el.closest('div.sliderFrame');

            base.slide       = base.$el.children('li');
            base.slideLength = base.slide.length;
            base.slideWidth  = base.slide[0].offsetWidth;

            base.count = 0;
            base.flag  = false;

            if (s.autoPlay) base.slideStart() // Checks if autoPlay is true
            if (s.enableControls === true) base.controls() // Checks if enableControls is true
            if (s.enableNavigation === true) base.navigation() // Checks if enableNavigation is true 

        };

        Slider.prototype = {

            constructor : Slider,

            //ANIMATIONS
            transition : function() {

                base.$el.animate({
                    'margin-left' : -( base.count * base.slideWidth )
                }, s.animationTime);
            },
            

            // SLIDESHOW FUNCTIONS
            slideStart : function() {

                base.go = setInterval(function() {
                    base.goForward();
                }, s.delay );
                base.paused = false;
            },

            slidePause : function() {

                if (base.paused === false) {
                    clearInterval(base.go);
                    base.paused = true;
                } else {
                    base.slideStart();
                }
            },

            resetTimer : function() {

                clearInterval(base.go);
                base.slideStart();
            },

            // NAVIGATON FUNCTIONS
            goForward : function() {

                base.counter(1);
                base.transition();
            },

            goBack : function() {

                base.counter(-1);
                base.transition();
            },

            goToPage : function( num ) {

                base.count = num;
                base.transition();
            },

            counter : function(num) {

                var pos = base.count;
                pos += num;
                base.count = ( pos < 0 ) ? base.slideLength - 1 : pos % base.slideLength;
            },

            timeOut : function() {

                base.flag = true;
                setTimeout(function() {
                    base.flag = false;
                }, 300);
            },

            // BUILDER FUNCTIONS
            controls : function() {

                var $controlsDiv = $('<div class="slider-controls"></div>');
                $controlsDiv.appendTo(base.$wrapper);

                var $controlsClass = $('.slider-controls');
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
                        if (s.autoPlayLocked === false) base.resetTimer()
                    } 
                });

                $nextBtn.on('click', function() {
                    if (!base.flag) {
                        base.timeOut();
                        base.goForward();
                        if (s.autoPlayLocked === false) base.resetTimer()
                    }
                });

                // Pause button, easier the put all code here than make 3 different if statements
                if (s.enablePause === true) {
                    var $pauseBtn = $('<button>Pause</button>');
                    $pauseBtn.appendTo($controlsClass);
                    $pauseBtn.on('click', function() {
                        if (!base.flag) {
                            base.timeOut();
                            base.slidePause();
                        }
                    });
                }
            },

            navigation : function() {

                var $navDiv = $('<div class="slider-nav"></div>');
                $navDiv.appendTo(base.$wrapper)

                var $navClass = $('.slider-nav');
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
                            base.goToPage(index);
                            if (s.autoPlayLocked === false) base.resetTimer()
                        }    
                    });
                });
            }

        };

        return new Slider(this, settings);
    }

    var defaults = {
        // Animation
        slide              : true,
        fade               : false,

        // Autoplay
        autoPlay            : true,     // If true, the slideshow will run on its own.
        autoPlayLocked      : false,    // If true, manually changing slides will not reset the slideshow timer.
        // Need to split options for autoStart and coutinus scrolling

         // Controls
        enableControls      : true,         // If true, builds the control buttons (prev, next, pause).  
        enablePause         : true,         // If true, pause btn will be turned on, does nothing if controls = false.
        enableNavigation    : true,      // if false, navigation links will still be visible, but not clickable.

        // Times
        delay               : 2000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
        animationTime       : 400       // How long the slideshow transition takes (in milliseconds)
    };

}(jQuery));
