(function() {
  function notify(response, message, form) {
    var alert = form.querySelector('.alert');

    if (response === 'success') {
      alert.classList.remove('alert-warning');
      alert.classList.add('alert-success');
    } else {
      alert.classList.remove('alert-success');
      alert.classList.add('alert-warning');
    }

    alert.innerHTML = message;
    alert.classList.add('toggle');
    setTimeout(function() {
      alert.classList.remove('toggle');
    }, 3000);
  }

  document.formValidator({
    form: '.form',
    ajax: true, //enable ajax sending (default is false)
    //Triggered after each input validation
    onValidation: function(inputData) {
      inputData.input.classList.toggle('error', inputData.error);
      if (inputData.error) {
        notify('error', 'Veuillez renseigner tous les champs.', inputData.form);
      }
    },
    beforeSending: function(form) {
      return new Promise(function(send, reject) {
        try {
          send();
        } catch (error) {
          reject(error);
        }
      });
    },
    //Triggered after the form data have been sent
    onFormSent: function(data) {
      console.log(data.response);
      if (data.response === '"success"') {
        form.reset();
        notify('success', 'Succès, veuillez vérifier votre messagerie.', data.form);
      } else if (data.response === '"error"') {
        notify('error', 'Une erreur est survenue, veuillez renvoyer le formulaire.', data.form);
      }
    }
  });
})();
