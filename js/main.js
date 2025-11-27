/**
 * NGC Marine - Main JavaScript
 * Navigation and Interactive Components
 * Based on Flender flyout navigation system
 */

(function($) {
    'use strict';

    // Wait for DOM to be ready
    $(document).ready(function() {

        // ========================================
        // FLYOUT NAVIGATION (MEGA MENU)
        // ========================================

        var $flyoutTriggers = $('.js-toggle-flyout-navigation');
        var $flyoutWrappers = $('.fl-header__flyout--wrapper');
        var $backgroundMask = $('.fl-background-mask--flyout');
        var activeFlyout = null;
        var closeTimeout = null;

        // Toggle flyout on click
        $flyoutTriggers.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $trigger = $(this);
            var flyoutId = $trigger.data('navigation');
            var $flyout = $('#' + flyoutId);

            // If clicking the same trigger, close it
            if (activeFlyout === flyoutId) {
                closeFlyout();
                return;
            }

            // Close any open flyout first
            if (activeFlyout) {
                closeFlyout();
            }

            // Open the clicked flyout
            openFlyout($flyout, flyoutId);
        });

        // REMOVED: Hover behavior - now click-only

        // Open flyout function
        function openFlyout($flyout, flyoutId) {
            if (!$flyout.length) return;

            $flyout.addClass('active');
            activeFlyout = flyoutId;

            // Add solid background to navbar when menu opens
            $('.fl-header').addClass('menu-open');

            // REMOVED: active state on nav items - no blue highlight needed
        }

        // Close flyout function
        function closeFlyout() {
            $flyoutWrappers.removeClass('active');
            activeFlyout = null;

            // Remove solid background from navbar when menu closes
            $('.fl-header').removeClass('menu-open');

            // REMOVED: removing active state - not needed
        }

        // Close on ESC key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                closeFlyout();
            }
        });

        // Close flyout when clicking outside
        $(document).on('click', function(e) {
            if (activeFlyout && !$(e.target).closest('.fl-header__flyout--wrapper, .js-toggle-flyout-navigation').length) {
                closeFlyout();
            }
        });

        // ========================================
        // RIGHT SIDE NAVIGATION
        // ========================================

        var $rightSideTriggers = $('.js-toggle-right-side-navigation');
        var $rightSideWrappers = $('.fl-right-side-navigation--wrapper');
        var $backgroundMaskRightSide = $('.fl-background-mask--right-side');
        var activeRightSide = null;

        $rightSideTriggers.on('click', function(e) {
            e.preventDefault();
            var navigationId = $(this).data('navigation');
            var $navigation = $('#' + navigationId);

            if (activeRightSide === navigationId) {
                closeRightSide();
                return;
            }

            if (activeRightSide) {
                closeRightSide();
            }

            openRightSide($navigation, navigationId);
        });

        function openRightSide($navigation, navigationId) {
            if (!$navigation.length) return;

            $navigation.addClass('active').css({
                'transform': 'translateX(0)',
                'opacity': '1'
            });
            $backgroundMaskRightSide.addClass('active');
            activeRightSide = navigationId;
        }

        function closeRightSide() {
            $rightSideWrappers.removeClass('active').css({
                'transform': 'translateX(100%)',
                'opacity': '0'
            });
            $backgroundMaskRightSide.removeClass('active');
            activeRightSide = null;
        }

        $backgroundMaskRightSide.on('click', function() {
            closeRightSide();
        });

        // Close buttons
        $('.fl-right-side-navigation--close').on('click', function(e) {
            e.preventDefault();
            closeRightSide();
        });

        // ========================================
        // MOBILE NAVIGATION TOGGLE
        // ========================================

        var $mobileToggle = $('.js-toggle-sm-navigation');
        var $mobileNav = $('.navigation__overflow');

        $mobileToggle.on('click', function(e) {
            e.preventDefault();
            $mobileNav.toggleClass('active');
            $backgroundMask.toggleClass('active');
        });

        // ========================================
        // NAVBAR SCROLL EFFECT - FLENDER STYLE
        // Transparent at top, solid when scrolling
        // ========================================

        var $header = $('.fl-header');
        var headerHeight = $header.outerHeight();
        var scrollThreshold = 50; // Pixels to scroll before changing

        $(window).on('scroll', function() {
            var scrollTop = $(window).scrollTop();

            if (scrollTop > scrollThreshold) {
                // Scrolled down - add solid background
                $header.addClass('scrolled');
            } else {
                // At top - remove solid background (transparent)
                $header.removeClass('scrolled');
            }
        });

        // ========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ========================================

        $('a[href^="#"]').on('click', function(e) {
            var target = $(this).attr('href');

            // Ignore navigation toggles and empty hashes
            if (target === '#' || $(this).hasClass('js-toggle-flyout-navigation') ||
                $(this).hasClass('js-toggle-right-side-navigation')) {
                return;
            }

            if ($(target).length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $(target).offset().top - headerHeight
                }, 600);
            }
        });

        // ========================================
        // LAZY LOAD IMAGES
        // ========================================

        function lazyLoadImages() {
            var lazyImages = document.querySelectorAll('img[data-src]');

            if ('IntersectionObserver' in window) {
                var imageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(function(img) {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback for older browsers
                lazyImages.forEach(function(img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        }

        lazyLoadImages();

        // ========================================
        // RESPONSIVE NAVIGATION
        // ========================================

        function handleResponsiveNav() {
            var windowWidth = $(window).width();

            if (windowWidth <= 991) {
                // Mobile: Click-based navigation
                $flyoutTriggers.off('mouseenter mouseleave');
                $flyoutWrappers.off('mouseenter mouseleave');
            } else {
                // Desktop: Hover-based navigation (already set up above)
            }
        }

        $(window).on('resize', debounce(handleResponsiveNav, 250));
        handleResponsiveNav();

        // ========================================
        // UTILITY: DEBOUNCE FUNCTION
        // ========================================

        function debounce(func, wait) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        }

        // ========================================
        // FADE IN ANIMATIONS ON SCROLL
        // ========================================

        function checkFadeIn() {
            $('.fade-in-up').each(function() {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).addClass('visible');
                }
            });
        }

        $(window).on('scroll', debounce(checkFadeIn, 100));
        checkFadeIn();

        // ========================================
        // FORM HANDLING (IF NEEDED)
        // ========================================

        $('form').on('submit', function(e) {
            // Add form validation or AJAX submission here if needed
            // e.preventDefault();
        });

        // ========================================
        // INTERACTIVE SERVICE LIFECYCLE INFOGRAPHIC
        // SVG Circle Rotation based on Scroll Position
        // ========================================

        var $infographicCircleRotating = $('.infographic-circle-rotating');
        var $serviceSections = $('.infographic__section');

        if ($infographicCircleRotating.length && $serviceSections.length) {

            // Rotation angles for each quadrant (in degrees)
            var rotationAngles = [
                0,    // Service 1/4 - Top Right (Equipment Setup)
                90,   // Service 2/4 - Top Left (Normal Operations)
                180,  // Service 3/4 - Bottom Left (Increased Wear)
                270   // Service 4/4 - Bottom Right (End of Lifecycle)
            ];

            // Current active section
            var currentSection = 0;

            // Intersection Observer to detect which section is in view
            var observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Trigger when section is 20% into viewport
                threshold: [0, 0.25, 0.5, 0.75, 1]
            };

            var sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        // Find which section index this is
                        var sectionIndex = Array.from($serviceSections).indexOf(entry.target);

                        if (sectionIndex !== -1 && sectionIndex !== currentSection) {
                            currentSection = sectionIndex;
                            rotateCircle(rotationAngles[sectionIndex]);
                            highlightQuadrant(sectionIndex);
                        }
                    }
                });
            }, observerOptions);

            // Observe all service sections
            $serviceSections.each(function() {
                sectionObserver.observe(this);
            });

            // Function to rotate only the quadrant segments (not the center text)
            function rotateCircle(degrees) {
                $infographicCircleRotating.css({
                    'transform': 'rotate(' + degrees + 'deg)',
                    'transform-origin': '186.5px 186.5px',
                    'transition': 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                });
            }

            // Function to highlight the active quadrant (optional visual enhancement)
            function highlightQuadrant(index) {
                var $segments = $('.service-circle-segment');

                // Reset all segments to normal opacity
                $segments.css({
                    'opacity': '0.6',
                    'transition': 'opacity 0.6s ease'
                });

                // Highlight the active segment
                $segments.eq(index).css('opacity', '1');
            }

            // Initialize: Set first quadrant as active
            rotateCircle(rotationAngles[0]);
            highlightQuadrant(0);

            // Alternative: Smooth scroll-based rotation (more precise)
            // Uncomment this if you want rotation tied directly to scroll position
            /*
            $(window).on('scroll', debounce(function() {
                var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();

                $serviceSections.each(function(index) {
                    var $section = $(this);
                    var sectionTop = $section.offset().top;
                    var sectionHeight = $section.outerHeight();
                    var sectionCenter = sectionTop + (sectionHeight / 2);
                    var viewportCenter = scrollTop + (windowHeight / 2);

                    // Check if section center is near viewport center
                    if (Math.abs(sectionCenter - viewportCenter) < windowHeight / 3) {
                        if (currentSection !== index) {
                            currentSection = index;
                            rotateCircle(rotationAngles[index]);
                            highlightQuadrant(index);
                        }
                    }
                });
            }, 50));
            */
        }

        // ========================================
        // SCROLL ANIMATIONS - INTERSECTION OBSERVER
        // ========================================

        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            // Create observer with options
            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px 0px -100px 0px', // Trigger slightly before element is fully visible
                threshold: 0.1 // Trigger when 10% of element is visible
            };

            // Callback function when elements intersect
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add visible class with a small delay for smoother effect
                        setTimeout(() => {
                            entry.target.classList.add('animate-visible');
                        }, 50);

                        // Stop observing this element after animation
                        observer.unobserve(entry.target);
                    }
                });
            };

            // Create the observer
            const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

            // Select all elements to animate
            const animatedElements = document.querySelectorAll('.animate-fade-in');

            // Observe each element
            animatedElements.forEach(element => {
                scrollObserver.observe(element);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            // Just make everything visible immediately
            $('.animate-fade-in').addClass('animate-visible');
        }

        // ========================================
        // HERO VIDEO CROSSFADE - HYBRID SWITCHING
        // First video: 8 seconds, Second video: full duration minus crossfade
        // ========================================

        var heroVideos = document.querySelectorAll('.hero-video');

        if (heroVideos.length >= 2) {
            var currentVideoIndex = 0;
            var switchTimer;
            var crossfadeDuration = 2000; // 2 seconds in milliseconds

            function switchVideo() {
                var currentVideo = heroVideos[currentVideoIndex];
                var nextVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
                var nextVideo = heroVideos[nextVideoIndex];

                // Start next video playing BEFORE fade begins
                nextVideo.currentTime = 0;
                nextVideo.play();
                nextVideo.classList.remove('inactive');
                nextVideo.classList.add('active');

                // Fade out current video (both videos now playing simultaneously)
                currentVideo.classList.remove('active');
                currentVideo.classList.add('inactive');

                // Update index
                currentVideoIndex = nextVideoIndex;

                // Clear any existing timer
                if (switchTimer) {
                    clearTimeout(switchTimer);
                    switchTimer = null;
                }

                // First video (index 0): use 8-second timer
                if (currentVideoIndex === 0) {
                    switchTimer = setTimeout(switchVideo, 8000);
                }
                // Second video (index 1): calculate duration minus crossfade time
                else if (currentVideoIndex === 1) {
                    var videoDuration = heroVideos[1].duration;
                    if (videoDuration && !isNaN(videoDuration)) {
                        // Start crossfade 2 seconds before video ends
                        var waitTime = (videoDuration * 1000) - crossfadeDuration;
                        switchTimer = setTimeout(switchVideo, waitTime);
                    }
                }
            }

            // Fallback: Add 'ended' event listener to second video in case duration isn't available
            heroVideos[1].addEventListener('ended', function() {
                // Only trigger if second video is currently active and no timer is set
                if (currentVideoIndex === 1 && !switchTimer) {
                    switchVideo();
                }
            });

            // Wait for metadata to load before starting
            heroVideos[1].addEventListener('loadedmetadata', function() {
                // Metadata loaded, duration is now available
            });

            // Start first video and set initial 8-second timer
            heroVideos[0].play().catch(function(error) {
                console.log('Video autoplay prevented:', error);
            });
            switchTimer = setTimeout(switchVideo, 8000);
        }

        // ========================================
        // CONSOLE MESSAGE
        // ========================================

        console.log('%c NGC Global Website ', 'background: #00224B; color: #fff; padding: 10px 20px; font-size: 16px; font-weight: bold;');
        console.log('%c Powered by Flender-inspired architecture ', 'color: #227dc6; font-size: 12px;');

    }); // End document ready

})(jQuery);
