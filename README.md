# formvalidator
Javascript plugin for form validation.

## Install
`bower i formvalidator --save`

## Init

```js
document.formValidator({
  form: '.form',

  ajax: true, //enable ajax sending (default is false)

  //Triggered before sending form
  beforeSending:function(form) {
    return new Promise(function(send, reject) {
      /*
        send() -> no arguments, just sends the form
        reject(error) -> displays an error
      */
    });
  },

  //Triggered after each input validation
  onValidation: function(inputData) {

    /*
        inputData.input -> the current input element
        inputData.error -> the input's status (boolean)
    */

  },

  //Triggered after the form data have been sent
  onFormSent: function(data) {

    /*
        data.input -> the current form
        data.response -> the server's response
    */

  }
});
```
