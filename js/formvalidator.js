/*jshint esversion: 6*/
/*eslint-env es6*/
(function(document) {
  'use strict';
  const createSettings = (options) => {
    const defaults = {
      form: 'form',
      ajax: false,
      cors: false,
      onValidation: null,
      beforeSending: null,
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

  function callback(fn, parameters, after) {
    let prom = null;

    if (fn === null && after) after();

    if (fn === null) return;

    try {
      prom = fn(parameters);
    } catch (error) {
      console.error(error);
    } finally {
      if (prom && typeof prom.then === 'function') {
        prom
          .then(() => after())
          .catch(error => console.error(error));
      }
    }
  }

  function send(form, settings) {

    callback(settings.beforeSending, form, () => {
      const action = form.getAttribute('data-form-action') ? form.getAttribute('data-form-action') : form.getAttribute('action');
      const request = new Request(action, {
        method: 'POST',
        body: new FormData(form),
        mode: settings.cors ? 'cors' : 'no-cors'
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
    });
  }

  function setListeners(form, settings) {
    const submit = form.querySelector('[type="submit"]');
    const submitFunc = settings.ajax ? () => send(form, settings) : () => form.submit();
    const inputs = [].slice.call(form.querySelectorAll('[required]'));
    const inputEvents = element => {
      let string = 'blur ';
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

    function addEventListeners(element, events, handler) {
      events.split(' ').forEach(e => element.addEventListener(e, handler));
    }

    if (inputs.length > 1)
      inputs.forEach(input => addEventListeners(input, inputEvents(input), () => validate(input, settings)));
    else
      addEventListeners(inputs[0], inputEvents(inputs[0]), () => validate(inputs[0], settings));

    submit.addEventListener('click', e => {
      const errors = inputs.reduce((sum, input) => sum + validate(input, settings), 0);

      e.preventDefault();

      if (!errors) callback(settings.beforeSending, form, submitFunc);
    });
  }

  document.formValidator = options => {
    const settings = createSettings(options && typeof options === 'object' ? options : {});
    const forms = [].slice.call(document.querySelectorAll(settings.form));

    if(forms.length > 1)
      forms.forEach(form => setListeners(form, settings));
    else
      setListeners(forms[0], settings);
  };

})(document);
