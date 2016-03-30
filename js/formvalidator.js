/*jshint esversion: 6*/
/*eslint-env es6*/
(function(document) {
  'use strict';
  const createSettings = (options) => {
    const defaults = {
      selector: 'form',
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

  const validate = (input, form, settings) => {
    const value = input.value.trim();
    const error = (value === '' || value === '0' ? 1 : 0);

    callback(settings.onValidation, {
      form: form,
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
        callback(settings.onError, {
          form:form,
          error:error
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

    function addEventListeners({element, events, handler}) {
      events.split(' ').forEach(e => element.addEventListener(e, handler));
    }

    inputs.map(input => addEventListeners({
      element: input,
      events: inputEvents(input),
      handler:() => validate(input, form, settings)
    }));

    submit.addEventListener('click', e => {
      const errors = inputs.reduce((sum, input) => sum + validate(input, form, settings), 0);

      e.preventDefault();

      if (!errors) callback(settings.beforeSending, form, submitFunc);
    });
  }

  document.formValidator = options => {
    const settings = createSettings(options && typeof options === 'object' ? options : {});
    const forms = [].slice.call(document.querySelectorAll(settings.selector));

    forms.map(form => {
      setListeners(form, settings);
    });
  };

})(document);
