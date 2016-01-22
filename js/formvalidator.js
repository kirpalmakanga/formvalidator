(function(plugin) {
    //Methods
    var busy = null,
        defaults = {
            form: 'form',
            onValidation: null,
            onResponse: null
        };

    function mergeObjects(defaults, options) {
        var settings = {};
        for (var defaultName in defaults) {
            settings[defaultName] = defaults[defaultName];
        }
        for (var optionName in options) {
            settings[optionName] = options[optionName];
        }
        return settings;
    }

    function callback(fn, data) {

        if (typeof fn === 'function') {

            fn(data);

        } else if (fn !== null && typeof fn !== 'function') {

            console.log('The provided callback is not a function.');

        }

    }

    function validate(inputs, options) {
        var errors = false;

        function checkInput(input) {
            var error = false,
                value = input.value.trim();

            if (value === '' || value === '0') {

                error = true;

            }

            callback(options.onValidation, {
                input: input,
                error: error
            });

            return error;
        }

        //Test if one or more inputs
        if (inputs.nodeType) {
            errors = checkInput(inputs);
        } else {
            [].map.call(inputs, function(input) {
                errors = checkInput(input);
            });
        }

        return errors;
    }

    function setListeners(options) {
        var form = document.querySelector(options.form),
            submit = form.querySelector('[type="submit"]'),
            inputs = form.querySelectorAll('[required]');

        submit.addEventListener('click', function(e) {
            var errors = validate(inputs, options);

            if (!errors) {
                send(options);
            }

            e.preventDefault();
        });

        [].map.call(inputs, function(input) {

            input.addEventListener('keyup', function() {
                validate(input, options);
            });
        });
    }

    function send(options) {
        var form = document.querySelector(options.form),
            action = form.getAttribute('data-form-action') ? form.getAttribute('data-form-action') : form.getAttribute('action'),
            data = new FormData(form),
            xhr = new XMLHttpRequest();

        if (!busy) {
            busy = true;

            xhr.open('POST', action, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    callback(options.onResponse, xhr.responseText);
                    busy = false;
                }
            };

            xhr.send(data);
        } else {
            console.log('busy');
        }
    }

    plugin.init = function(options) {

        var settings = mergeObjects(defaults, options);

        if (options && typeof options === 'object') {
            setListeners(settings);
        } else {
            console.error('ajaxForm: argument must be an object');
        }

    };

})(this.validateForm = this.validateForm || {});
