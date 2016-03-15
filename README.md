# formvalidator
Javascript plugin for form validation.

## Install
`bower i formvalidator --save`

## Init
``` js
document.formValidator({
  form: '.form',
  
  ajax: true, //enable ajax sending (default is false)

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
