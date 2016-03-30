'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (document) {
  'use strict';

  var createSettings = function createSettings(options) {
    var defaults = {
      selector: 'form',
      ajax: false,
      cors: false,
      onValidation: null,
      beforeSending: null,
      onFormSent: null
    };

    var settings = defaults;

    for (var option in options) {
      settings[option] = options[option];
    }return settings;
  };

  var validate = function validate(input, form, settings) {
    var value = input.value.trim();
    var error = value === '' || value === '0' ? 1 : 0;

    callback(settings.onValidation, {
      form: form,
      input: input,
      error: error
    });

    return error;
  };

  function callback(fn, parameters, after) {
    var prom = null;

    if (fn === null && after) after();

    if (fn === null) return;

    try {
      prom = fn(parameters);
    } catch (error) {
      console.error(error);
    } finally {
      if (prom && typeof prom.then === 'function') {
        prom.then(function () {
          return after();
        }).catch(function (error) {
          return console.error(error);
        });
      }
    }
  }

  function send(form, settings) {
    var action = form.getAttribute('data-form-action') ? form.getAttribute('data-form-action') : form.getAttribute('action');
    var request = new Request(action, {
      method: 'POST',
      body: new FormData(form),
      mode: settings.cors ? 'cors' : 'no-cors'
    });

    fetch(request).then(function (response) {
      return response.text();
    }).then(function (response) {
      callback(settings.onFormSent, {
        form: form,
        response: response
      });
    }).catch(function (error) {
      callback(settings.onError, {
        form: form,
        error: error
      });
    });
  }

  function setListeners(form, settings) {
    var submit = form.querySelector('[type="submit"]');
    var submitFunc = settings.ajax ? function () {
      return send(form, settings);
    } : function () {
      return form.submit();
    };
    var inputs = [].slice.call(form.querySelectorAll('[required]'));
    var inputEvents = function inputEvents(element) {
      var string = 'blur ';
      switch (element.type) {
        case 'checkbox':
        case 'radio':
        case 'select-one':
        case 'select-multiple':
          string += 'change';
          break;
        default:
          string += 'keyup';
      }
      return string;
    };

    function addEventListeners(_ref) {
      var element = _ref.element;
      var events = _ref.events;
      var handler = _ref.handler;

      events.split(' ').forEach(function (e) {
        return element.addEventListener(e, handler);
      });
    }

    inputs.map(function (input) {
      return addEventListeners({
        element: input,
        events: inputEvents(input),
        handler: function handler() {
          return validate(input, form, settings);
        }
      });
    });

    submit.addEventListener('click', function (e) {
      var errors = inputs.reduce(function (sum, input) {
        return sum + validate(input, form, settings);
      }, 0);

      e.preventDefault();

      if (!errors) callback(settings.beforeSending, form, submitFunc);
    });
  }

  document.formValidator = function (options) {
    var settings = createSettings(options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {});
    var forms = [].slice.call(document.querySelectorAll(settings.selector));

    forms.map(function (form) {
      setListeners(form, settings);
    });
  };
})(document);