# formvalidator
Javascript plugin for form validation.

## Install
`bower i formvalidator --save`

## Init
``` js
validateForm.init({
  form: '.form',
  
  ajax: false //disable ajax sending (default is true)

  //Triggered after each input validation
  onValidation: function(inputData) {

    /*
        inputData.input -> the current input element
        inputData.error -> the input's status (boolean)
    */

  },

  //Triggered after the form data have been sent
  onFormSent: function(form, response) {

  }
});
```
