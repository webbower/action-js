/**
 * ActionJS - Simplify your UI actions
 *
 *
 *
 */
;(function(w, $) {
  // Map to store handlers
  var handlers = Object.create(null);

  var ActionJS = w.ActionJS = {
    register: function register(key, handler) {
      // Handle multi-handler definition
      // Check handler arg first since it's a cheaper operation
      if (handler == null && $.isPlainObject(key)) {
        $.each(key, function(k, h) {
          ActionJS.register(k, h);
        });
        return;
      }

      // key needs to be a string
      if (typeof key !== 'string') {
        throw new TypeError('ActionJS.register expects first argument to be a string. ' + (typeof key) + ' given.');
      }

      // handler needs to be a function
      if (! $.isFunction(handler)) {
        throw new TypeError('ActionJS.register expects second argument to be a function. ' + (typeof handler) + ' given.');
      }

      // Disallow overriding handlers
      if (handlers[key]) {
        throw new Error('ActionJS handler already registered for ' + key + '. Aborting.');
      }

      handlers[key] = handler;
    },

    dump: function dump() {
      console.dir(handlers);
    }
  };

  // Bind the handler for data-actions
  window.addEventListener('DOMContentLoaded', function() {
    $(document).on('click', '[data-action]', function(ev) {
      var handler = handlers[this.getAttribute('data-action')];

      if (handler) {
        return handler.call(this, ev);
      }
    });
  }, false);
})(window, jQuery);
