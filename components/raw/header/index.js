import $ from 'jquery'
import Headroom from 'headroom.js'
import debounce from 'throttle-debounce/throttle'

// Headroom for fixed sticky header

const myElement = document.querySelector('header')

const opts = {
  // vertical offset in px before element is first unpinned
  offset: 0,
  // you can specify tolerance individually for up/down scroll
  tolerance: {
    up: 20,
    down: 10
  },
  // css classes to apply
  classes: {
    // when element is initialised
    initial: 'Headroom',
    // when scrolling up
    pinned: 'Headroom--pinned',
    // when scrolling down
    unpinned: 'Headroom--unpinned',
    // when above offset
    top: 'Headroom--top',
    // when below offset
    notTop: 'Headroom--not-top',
    // when at bottom of scoll area
    bottom: 'Headroom--bottom',
    // when not at bottom of scroll area
    notBottom: 'Headroom--not-bottom'
  },
  // element to listen to scroll events on, defaults to `window`
  scroller: window,
  // callback when pinned, `this` is headroom object
  onPin: function() {},
  // callback when unpinned, `this` is headroom object
  onUnpin: function() {},
  // callback when above offset, `this` is headroom object
  onTop: function() {},
  // callback when below offset, `this` is headroom object
  onNotTop: function() {},
  // callback when at bottom of page, `this` is headroom object
  onBottom: function() {},
  // callback when moving away from bottom of page, `this` is headroom object
  onNotBottom: function() {}
}

let headroom = null

if (myElement) {
  headroom = new Headroom(myElement, opts)
  headroom.init()
}

/*
 *	Make space when using fixed header.
 *
 *		The no-js alternative is to set up body padding inside CSS
 *	 	assuming you know the exact header height in pixel
 *	 	(expanded and minimized for all viewport width)
 */
const headroomFixed = '.Headroom--fixed'

if ($('.' + opts.classes.initial).is(headroomFixed)) {
  // Needs to be here due to CSS transition (see on Safari)
  let headerHeight = $(headroomFixed).height()

  const _adjustPadding = function() {
    const paddingTop = headerHeight

    $('body').css({
      paddingTop: paddingTop + 'px'
    })
  }

  // Set up padding on page load
  $(document).ready(() => {
    $(headroomFixed).css({
      position: 'fixed',
      top: 0
    })
    _adjustPadding()
  })

  // Make padding respond to window resize
  $(window).resize(debounce(250, function() {
    headerHeight = $(headroomFixed).height()
    setTimeout(_adjustPadding, 250)
  }))

  // This happens *only* after a resize
  // when scrolling to top
  $(headroomFixed).on('transitionend', debounce(250, function() {
    const height = $(this).height()
    if (headerHeight < height) {
      headerHeight = height
      _adjustPadding()
    }
  }))

}

export default {
  Headroom,
  headroom
}