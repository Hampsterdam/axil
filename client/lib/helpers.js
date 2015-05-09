
//////////////////////////////////////////
//                                      //
//           Polyfills                  //
//                                      //
//////////////////////////////////////////

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


function flatten(array) {
  return array.reduce(function(memo, el) {
    var items = Array.isArray(el) ? flatten(el) : [el];
    return memo.concat(items);
  }, []);
}

//////////////////////////////////////////







//////////////////////////////////////////
//                                      //
//              Mithril                 //
//                                      //
//////////////////////////////////////////


m.localStorageProp = function (propName, defaultValue) {
  var store = localStorage.getItem(propName) || defaultValue
  return function (value) {
    if (value !== undefined) {
      store = value
      localStorage.setItem(propName, store)
    }
    return store
  }
}


reactive = function(controller) {
  return function() {
    var instance = {}
    var computation = Deps.autorun(function() {
      m.startComputation()
      controller.call(instance)
      m.endComputation()
    })

    // when the component is removed, stop checking for 
    // changes. This could perhaps be more effecient
    instance.onunload = function() {
      computation.stop()
    }
    return instance
  }
}


//////////////////////////////////////////

M = {}

M.component = function () {
  var component = function (props, content) {
    return m.module(component, props, content)
  }
  return component
}


//Widget = M.component()

// Example use:
 
// m.module(document.body, {
//   view: function () {
//     return m('.app', [
//       m('h1', "Welcome!"),
//       Widget({ id: m.route.param('id') }) // <----- (!)
//       m.module(Widget, { id: m.route.param('id') }) // <----- (!)
//     ])
//   }
// })



//////////////////////////////////////////
//                                      //
//        Function Prototypes           //
//                                      //
//////////////////////////////////////////



Function.prototype.obind = function (ctx, obj) {
  var f = this
  var args = arguments
  return function () {
    arguments[0] = Object.assign(obj, arguments[0])
    return f.apply(ctx, arguments)
  }
}
 
// Example use:
// var add = function (params) {
//   return params.x + params.y
// }
// var add10 = add.obind({ x: 10 })
// add10({ y: 20 }) //=> 30
 


//////////////////////////////////////////
//                                      //
//          Component Helpers           //
//                                      //
//////////////////////////////////////////

var M = {}

var animating = false;

// Define an animator consisting of optional incoming and outgoing animations. 
// alwaysAnimate is false unless specified as true: false means an incoming animation will only trigger if an outgoing animation is also in progress.
// forcing dontClone to true means the outward animation will use the original element rather than a clone. This could improve performance by recycling elements, but can lead to trouble: clones have the advantage of being stripped of all event listeners.
M.animator = function( incoming, outgoing, alwaysAnimate, dontClone ){
  // The resulting animator can be applied to any number of components
  return function animate( x, y, z ){
    var originalConfig;
    var parent;
    var next;

    // When used as a config function 
    if( x.nodeType ){
      return animationConfig( x, y, z );
    }
    // When passed a virtual DOM node (the output of m)
    else if( x.attrs ){
      return bindConfigTo( x );
    }
    // When applied to a Mithril module / component 
    else if( x.view ){
      return {
        controller : x.controller || noop,
        view       : function animatedView( ctrl ){
          return bindConfigTo( x.view( ctrl ) );
        }
      };
    }
    
    function bindConfigTo( node ){
      originalConfig = node.attrs.config;

      node.attrs.config = animationConfig;

      return node;
    }

    function animationConfig( el, init, context ){
      var output;
      var onunload;

      if( originalConfig ){
        output   = originalConfig( el, init, context );
        // If the root element already has a config, it may also have an onunload which we should take care to preserve 
        onunload = context.onunload;
      }

      if( !init ){
        if( incoming && alwaysAnimate || animating ){
          incoming( el, noop, context );
        }

        context.onunload = outgoing ? (onunload ? function onunloadWrapper(){
          teardown();
          onunload();
        } : teardown) : onunload;

        parent = el.parentElement;
        next   = el.nextSibling;
      }

      return output;

      function teardown(){
        var insertion = dontClone ? el : el.cloneNode( true );
        var reference = null;

        if( next && parent && next.parentNode === parent ){
          reference = next;
        }
        
        animating = true;
        
        setTimeout( function resetAnimationFlag(){
          animating = false;
        }, 0 );

        parent.insertBefore( insertion, reference );

        outgoing( insertion, function destroy(){
          if( parent.contains( insertion ) ){
            parent.removeChild( insertion );
          }
        }, context );
      }
    }
  };
}







//////////////////////////////////////////
//                                      //
//          Object Prototypes           //
//                                      //
//////////////////////////////////////////

_ = {}
_.clone = function(obj) {
  if (null == obj || "object" != typeof obj || obj instanceof Array) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
_.extend = function(base) {
  if(typeof base !== 'object' || base instanceof Array) return base
  var args = Array.prototype.slice.call(arguments)
  var obj = Object.create(base)
  for(var x = 1; x < args.length; x++){
    if(typeof args[x] === 'object' && !(args[x] instanceof Array)) {
      for (var i in args[x]) {
        if (args[x].hasOwnProperty(i) && !base.hasOwnProperty(i)) {
           base[i] = args[x][i];
        }
      }      
    }
  }
  return base
}






function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var fadeIn = function(element, isInitialized, context) {
    if (!isInitialized) {
        element.style.opacity = 0
        Velocity(element, {opacity: 1}, {
          duration: 200,
        })
    }
}



var fadeOut = function(containerId) {
  return function(element, isInitialized, context) {
    if (!isInitialized) {
      element.onclick = function(e) {
        e.preventDefault()
        Velocity(document.getElementById(containerId), {opacity: 0}, {
          duration: 200,
          complete: function() {
              m.route(element.getAttribute("href"))
          }
        })
      }
    }
  }
}

function slideIn( el, callback ){
  el.style.left       = '-100%';
  el.style.top        = '0';
  el.style.position   = 'fixed';
  el.style.transition = 'left .5s ease-in-out';

  setTimeout( function transit(){
    el.style.left = '0%';
  } );
    
  el.addEventListener( 'transitionend', callback, false );
}

// Slide out.
function slideOut( el, callback ){
  el.style.left       = '0%';
  el.style.top        = '0';
  el.style.position   = 'fixed';
  el.style.transition = 'left .5s ease-in-out';

  setTimeout( function transit(){
    el.style.left = '100%';
  } );

    // Remember to fire the callback when the animation is finished.
  el.addEventListener( 'transitionend', callback, false );
}

function noop(){}
