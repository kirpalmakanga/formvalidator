<html>
<head>
  <link rel="stylesheet" href="demo/main.css">
</head>
  <body>
    <form class="form" method="POST" data-form-action="response.php" action="response.php">

      <div class="form-group">
        <input name="name" type="text" required/>
      </div>

      <div class="form-group">
        <input name="email" type="email" required/>
      </div>

      <!-- <div class="form-group">
        <select class="" name="" required>
          <option value="0"></option>
          <option value="1"></option>
        </select>
      </div>
      <div class="form-group">
        <select class="" name="" required>
          <option value="0"></option>
          <option value="1"></option>
        </select>
      </div>

      <div class="form-group">
        <input type="checkbox" name="name" value="" required>
      </div>

      <div class="form-group">
        <input type="radio" name="test" value="1" required>
        <input type="radio" name="test" value="0">
      </div>

      <div class="form-group">
        <input type="week" name="name" value="" required>
      </div>
      <div class="form-group">
      </div> -->

      <div class="form-group">
        <input class="form-submit" type="submit" value="Validate"/>
      </div>



      <div class="alert-container">
          <div class="alert alert-warning"></div>
      </div>

    </form>

  </body>
  <script type="text/javascript" src="bower_components/fetch/fetch.js"></script>
  <script type="text/javascript" src="dist/formvalidator.js"></script>
  <script type="text/javascript" src="demo/main.js"></script>
</html>
