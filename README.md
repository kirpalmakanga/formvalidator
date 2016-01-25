# formvalidator
Javascript plugin for form validation.

## Install
`bower i formvalidator --save`

## Init
``` js
validateForm.init({
  form: '.form',

  //Triggered after each input validation
  onValidation: function(inputData) {

    /*
        inputData.element -> the current input element
        inputData.error -> the input's status (boolean)
    */

  },

  //Triggered after the form data have been sent
  onFormSent: function(form, response) {

  }
});
```
