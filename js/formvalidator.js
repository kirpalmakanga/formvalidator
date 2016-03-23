/*jshint esversion: 6*/
/*eslint-env es6*/
(function(document) {
  'use strict';
  const createSettings = (options) => {
    const defaults = {
      form: 'form',
      ajax: false,
      onValidation: null,
      onFormSent: null
    };

    let settings = defaults;

    for (let option in options) settings[option] = options[option];

    return settings;
  };

  const validate = (input, settings) => {
    const value = input.value.trim();
    const error = (value === '' || value === '0' ? 1 : 0);

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
    const form = document.querySelector(settings.form);
    const action = form.getAttribute('data-form-action') ? form.getAttribute('data-form-action') : form.getAttribute('action');
    const data = new FormData(form);

    const request = new Request(action, {
      method: 'POST',
      body: data
    });

    fetch(request)
      .then(response => response.text())
      .then(response => {
        callback(settings.onFormSent, {
          form: form,
          response: response
        });
      })
      .catch(error => {
        callback(settings.onError, error);
      });
  }

  function setListeners(settings) {
    const form = document.querySelector(settings.form);
    const submit = form.querySelector('[type="submit"]');
    const inputs = [].slice.call(form.querySelectorAll('[required]'));

    if (inputs.length > 1) {
      inputs.forEach(input => {
        input.addEventListener('keyup', () => validate(input, settings));
      });
    } else {
      inputs[0].addEventListener('keyup', () => validate(inputs, settings));
    }

    submit.addEventListener('click', e => {
      const errors = inputs.reduce((sum, input) => sum + validate(input, settings), 0);

      if (settings.ajax && !errors) {
        send(settings);
      }

      if (settings.ajax || !settings.ajax && errors) {
        e.preventDefault();
      }
    });
  }

  document.formValidator = options => {
    const settings = createSettings(options && typeof options === 'object' ? options : {});
    setListeners(settings);
  };

})(document);
