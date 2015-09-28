# js-library

Common js code

## objects.js

Useful functions for name-value objects.

`Object.prototype.serialize()`

Converts an object into a url encoded string.

## functions.js

Useful function transformations.

`Function.prototype.curry(...args)`

Curry in a hurry.

`Function.prototype.debounce(wait, immediate)`

Underscore.js debounce.

`Function.prototype.throttle(wait, options)`

Underscore.js throttle.

## dom.js

DOM related properties and functions.

`HTMLElement.prototype.positionTop()`

Returns the top position of an element relative to the document.

## fx.js

Animations

`FX.animate(easeFn, initialValue, valueChange, duration, onTick)`

General purpose animation function. Returns a function that when called, stops the animation.

`Easing functions. i.e. function(timeElapsed, initialValue, valueChange, duration)`

Normally these functions should not be called directly, but passed to FX.animate as the first argument.

Available easing functions: FX.linear, FX.cubicEaseOut.

## utils.js

Random stuff that rarely proves useful.

`injectJS(src, cb)`

Insert a js file into the document.
