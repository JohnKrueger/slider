;(function (window, $, undefined) {
    "use strict";

    // 'var instance = this' is only needed when anonymous functions are used.
    
    $.jSlider = function(el, settings) {
        
        var settings = this.s = $.extend({}, $.jSlider.defaults, settings);

        // Cache DOM elements
        this.$el      = $(el).addClass('sliderbase').wrap('<div class="sliderWrapper"><div class="sliderFrame" /></div>');
        this.$wrapper = this.$el.parent().closest('div.sliderWrapper');
        this.$frame   = this.$el.closest('div.sliderFrame');

        this.slide       = this.$el.children('li');
        this.slideLength = this.slide.length;
        this.slideWidth  = this.slide[0].offsetWidth;

        this.count = 0;
        this.flag  = false;

        if (this.s.autoPlay) { this.slideStart(); this.s.continuousScroll = true; }  // Checks if autoPlay is true, defauls continuousScroll to true
        if (this.s.enableControls) this.controls() // Checks if enableControls is true
        if (this.s.enableNavigation) this.navigation()  // Checks if enableNavigation is true
    }

    $.jSlider.prototype = {

        //ANIMATIONS
        transition: function() {

            this.$el.animate({
                'margin-left' : -( this.count * this.slideWidth )
            }, this.s.animationTime);
        },
            

        // SLIDESHOW FUNCTIONS
        slideStart: function() {
            
            var instance = this;

            this.go = setInterval(function() {
                instance.goForward();   
            }, this.s.delay );
            this.paused = false;
        },

        slidePause: function() {

            if (!this.paused) {
                clearInterval(this.go);
                this.paused = true;
            } else {
                this.slideStart();
            }
        },

        resetTimer: function() {

            clearInterval(this.go);
            this.slideStart();
        },

        // NAVIGATON FUNCTIONS
        goForward: function() {
            
            this.counter(1);
            this.transition();
        },

        goBack: function() {

            this.counter(-1);
            this.transition();
        },

        goToSlide: function(num) {

            this.count = num;
            this.transition();
        },

        counter: function(num) {

            var pos = this.count;
            pos += num;
            this.count = ( pos < 0 ) ? this.slideLength - 1 : pos % this.slideLength;
        },

        timeOut: function() {
            
            var instance = this;

            this.flag = true;
            setTimeout(function() {
                instance.flag = false;
            }, 300);
        },

        // BUILDER FUNCTIONS
        bindings: function(cmd, index) {

            if (!this.flag) {
                this.timeOut();
                switch (cmd) {
                    case 'forward':
                        this.goForward()
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.resetTimer()
                        break;

                    case 'back':
                        this.goBack()
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.resetTimer()
                        break;

                    case 'pause':
                        this.slidePause()
                        break;

                    case 'slide':
                        this.goForward()
                        this.goToSlide(index)
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.resetTimer()
                        break;
                }  
            }
        },

        controls: function() {

            var instance = this;

            var $controlsDiv = $('<div class="slider-controls"></div>');
            $controlsDiv.appendTo(this.$wrapper);

            var $controlsClass = $(this.$wrapper.find('.slider-controls'));
            var $prevBtn = $('<button>Previous</button>');
            var $nextBtn = $('<button>Next</button>');

            // Append buttons
            $prevBtn.appendTo($controlsClass);
            $nextBtn.appendTo($controlsClass);

            // Bind click events
            $prevBtn.on( 'click', function() { instance.bindings('back') });
            $nextBtn.on( 'click', function() { instance.bindings('forward') });

            // Pause button, easier the put all code here than make 3 different if statements
            if (this.s.continuousScroll && this.s.enablePause) {
                var $pauseBtn = $('<button>Pause</button>');
                $pauseBtn.appendTo($controlsClass);
                $pauseBtn.on( 'click', function() { instance.bindings('pause') });
            }
        },

        navigation: function() {

            var instance = this;

            var $navDiv = $('<div class="slider-nav"></div>');
            $navDiv.appendTo(this.$wrapper)

            var $navClass = $(this.$wrapper.find('.slider-nav'));
            var $navBtn = [];

            // Creates a button for each slide
            for (var i = 0; i < this.slideLength; i++) {
                $navBtn[i] = $('<button>Slide # ' + (i + 1) + '</button>');
                $navBtn[i].appendTo($navClass);
            }

            // Binds click event to each button
            $.each($navBtn, function(index, val) {
                $navBtn[index].on( 'click', function() { instance.bindings('slide', index) });
            });
        }  
    };
    
    $.fn.mySlider = function(settings) {

        return this.each(function() {
          
            var $this = $(this),
                data  = $this.data("mySlider");

                if (!data) $this.data("mySlider", (data = new $.jSlider(this, settings)));
        });
    }

    $.jSlider.defaults = {

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
