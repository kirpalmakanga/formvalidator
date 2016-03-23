'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (document) {
  'use strict';

  var createSettings = function createSettings(options) {
    var defaults = {
      form: 'form',
      ajax: false,
      onValidation: null,
      onFormSent: null
    };

    var settings = defaults;

    for (var option in options) {
      settings[option] = options[option];
    }return settings;
  };

  var validate = function validate(input, settings) {
    var value = input.value.trim();
    var error = value === '' || value === '0' ? 1 : 0;

    callback(settings.onValidation, {
      form: document.querySelector(settings.form),
      input: input,
      error: error
    });

    return error;
  };

  function callback(fn, parameters) {
    if (fn === null) return;

    try {
      fn(parameters);
    } catch (error) {
      console.error(error);
    }
  }

  function send(settings) {
    var form = document.querySelector(settings.form);
    var action = form.getAttribute('data-form-action') ? form.getAttribute('data-form-action') : form.getAttribute('action');
    var data = new FormData(form);

    var request = new Request(action, {
      method: 'POST',
      body: data
    });

    fetch(request).then(function (response) {
      return response.text();
    }).then(function (response) {
      callback(settings.onFormSent, {
        form: form,
        response: response
      });
    }).catch(function (error) {
      callback(settings.onError, error);
    });
  }

  function setListeners(settings) {
    var form = document.querySelector(settings.form);
    var submit = form.querySelector('[type="submit"]');
    var inputs = [].slice.call(form.querySelectorAll('[required]'));

    if (inputs.length > 1) {
      inputs.forEach(function (input) {
        input.addEventListener('keyup', function () {
          return validate(input, settings);
        });
      });
    } else {
      inputs[0].addEventListener('keyup', function () {
        return validate(inputs, settings);
      });
    }

    submit.addEventListener('click', function (e) {
      var errors = inputs.reduce(function (sum, input) {
        return sum + validate(input, settings);
      }, 0);

      if (settings.ajax && !errors) {
        send(settings);
      }

      if (settings.ajax || !settings.ajax && errors) {
        e.preventDefault();
      }
    });
  }

  document.formValidator = function (options) {
    var settings = createSettings(options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {});
    setListeners(settings);
  };
})(document);