# formvalidator
Javascript plugin for form validation.

## Install
`bower i formvalidator --save`

## Init

```js
document.formValidator({
  selector: '.form',

  ajax: true, //enable ajax sending (default is false)

  cors: true,


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
        inputData.form -> current form
        inputData.input -> current input element
        inputData.error -> input status (boolean)
    */

  },

  //Triggered after the form data have been sent
  onFormSent: function(data) {

    /*
        data.form -> current form
        data.response -> server's response
    */

  },
  onError: function(data) {
    /*
        data.form -> current form
        data.error -> server error
    */    
  }
});
```
