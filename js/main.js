;(function (window, $, undefined) {
    "use strict";

    // 'var instance = this' is only needed when anonymous functions are used.
    // Variable names that contain '$' probably have a jQuery selector in them.
    var radioBtnCount = 0; // Used for radio button names, so they don't clash.

    $.jSlider = function(el, settings) {
        
        var settings = this.s = $.extend({}, $.jSlider.defaults, settings);

        // Cache DOM elements
        this.$window    = $(window);
        this.base       = el;
        this.$base      = $(el).addClass('sliderbase').wrap('<div class="sliderWrapper"></div>');
        this.$wrapper   = this.$base.parent().closest('div.sliderWrapper');
        this.$slide     = this.$base.children('li');
        this.slideCount = this.$slide.length;
        this.slideWidth = 100 / this.slideCount;

        this.$base.css({ 'width' : this.slideCount * 100 + '%'});
        this.$slide.css({ 'width' : this.slideWidth + '%' });

        this.count = 0;
        this.flag  = false;

        if (this.s.autoPlay) { this.controlSlide('start'); this.s.continuousScroll = true; }  // Checks if autoPlay is true, defauls continuousScroll to true
        if (this.s.enableControls) this.buildControls() // Checks if enableControls is true
        if (this.s.enableRadioBtns) this.buildRadioBtns()  // Checks if enableNavigation is true
        if (this.s.enableTimer) this.buildTimer()  // Checks if enableTimer is true

        radioBtnCount++;
    }

    $.jSlider.prototype = {

        transition: function() {

            this.$base.animate({
                'margin-left' : -( this.count * this.slideWidth * this.slideCount ) +'%'
            }, this.s.animationTime);
        },

        counter: function(num) {

            var pos = this.count;
            pos += num;
            this.count = ( pos < 0 ) ? this.slideCount - 1 : pos % this.slideCount;
        },
            
        controlSlide: function(cmd) {

            var instance = this;

            switch (cmd) {
                case 'start':
                    this.go = setInterval(function() {
                        instance.changeSlide('forward');
                    }, this.s.delay);
                    this.paused = false;
                    break;
                case 'pause':
                    if (!this.paused) {
                        clearInterval(this.go);
                        this.paused = true;
                    } else {
                        this.controlSlide('start');
                    }
                    break;
                case 'reset': // Resets timer not slide itself
                    clearInterval(this.go);
                    this.controlSlide('start');
                    break;
            }
        },

        changeSlide: function(dir, num) {

            switch (dir) {
                case 'forward':
                    this.counter(1)
                    if (this.s.enableRadioBtns) this.$radioBtn[this.count].attr('checked', 'checked')
                    break;
                case 'back':
                    this.counter(-1)
                    if (this.s.enableRadioBtns) this.$radioBtn[this.count].attr('checked', 'checked')
                    break;
                case 'jump':
                    this.count = num
                    break;
            }
            this.transition();
        },

        bindings: function(dir, index) {

            var instance = this;

            if (!this.flag) {

                // Prevents click spam
                this.flag = true;
                setTimeout(function() {
                    instance.flag = false;
                }, 300);

                switch (dir) {
                    case 'forward':
                        this.changeSlide(dir)
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.controlSlide('reset')
                        break;
                    case 'back':
                        this.changeSlide(dir)
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.controlSlide('reset')
                        break;
                    case 'jump': 
                        this.changeSlide(dir, index)
                        if (this.s.continuousScroll && !this.s.autoPlayLocked) this.controlSlide('reset')
                        break;
                    case 'pause':
                        this.controlSlide('pause')
                        break;
                }  
            }
        },

        buildControls: function() {

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

        buildRadioBtns: function() {

            var instance = this;

            var $radioDiv = $('<div class="slider-radio"></div>');
            $radioDiv.appendTo(this.$wrapper)

            var $radioClass = $(this.$wrapper.find('.slider-radio'));
            this.$radioBtn = [];

            for (var i = 0; i < this.slideCount; i++) {
                this.$radioBtn[i] = $("<input type='radio' name='radioBtn" + radioBtnCount + "' />");
                this.$radioBtn[i].appendTo($radioClass);
            }

            this.$radioBtn[0].attr('checked', 'checked')

            // Binds click event to each button
            $.each(this.$radioBtn, function(index, val) {
                instance.$radioBtn[index].on( 'click', function() { instance.bindings('jump', index) });
            });
        },

        buildTimer: function() {

            var instance = this;
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

        // TODO
        // Swipe
        // Captions
        // Timer icon
        // Pro CSS YO!

        // Autoplay
        autoPlay            : true,     // If true, the slideshow will start on its own, it will also make continuousScroll = true.
        autoPlayLocked      : false,    // If true, manually changing slides will not reset the slideshow timer.
        continuousScroll    : false,     // If true, the slideshow will proceed on its own.

         // Controls
        enableControls      : true,         // If true, builds the control buttons (prev, next, pause).  
        enablePause         : true,         // If true, pause btn will be turned on, does nothing if controls = false.
        enableRadioBtns     : true,      // if false, navigation links will still be visible, but not clickable.
        enableTimer         : true,

        // Times
        delay               : 2000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
        animationTime       : 400       // How long the slideshow transition takes (in milliseconds)
    };

})(window, jQuery);
