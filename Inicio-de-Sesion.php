<?php

  session_start();
  error_reporting(0);

if (isset($_SESSION['user_id_estu'])) {
    header('Location: /Sign-to-All');

  }

  if (isset($_SESSION['user_id_prof'])) {
    header('Location: /Sign-to-All');
}

  require "database.php";

if (!empty($_POST["nombreU"]) && !empty($_POST["contraseña"])) {

  if ($_POST['rol'] == "estudiante") {

      $records = $conn->prepare("SELECT nombre_apellido, identificacion, password, confir_password FROM estudiante WHERE nombre_apellido = :nombres");
      $records->bindParam(":nombres", $_POST["nombreU"]);
      $records->execute();
      $resultados = $records-> fetch(PDO::FETCH_ASSOC);

      $message = "";

      if (count($resultados) > 0 && $_POST['contraseña'] == $resultados['password'] ) 
      {
        $_SESSION["user_id_estu"] = $resultados["identificacion"];
        header('Location: /Sign-to-All');
        
      }else{
        $message = "Lo siento, no existe este usuario o la contraseña es incorrecta";
      }
    

  }elseif ($_POST['rol'] == "profesor_a"){


      $records = $conn->prepare("SELECT nombre_apellido, identificacion, password, confir_password FROM profesor_a WHERE nombre_apellido = :nombres");
      $records->bindParam(":nombres", $_POST["nombreU"]);
      $records->execute();
      $resultados = $records-> fetch(PDO::FETCH_ASSOC);

      $message = "";

      if (count($resultados) > 0 && $_POST['contraseña'] == $resultados['password']) 
      {
        $_SESSION["user_id_prof"] = $resultados["identificacion"];
        header('Location: /Sign-to-All');
        
      }else{
        $message = "Lo siento, no existe este usuario o la contraseña es incorrecta";
      }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Sign To All - Iniciar sesión</title>

  <link rel="shortcut icon" href="imagenes/Logo.png" type="image/png" />

  <!-- Hojas de CSS  -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection"/>
  <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>

  <!--css iconos-->
  <link rel="stylesheet" href="css/iconos.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">

  <style>
    .ingresar{
      margin-top: 100px;
      margin-bottom: 100px;
    }
    .ingresar .card{
      background: rgba(1, 84, 151, 0.3);
    }
  </style>

  <!--  Scripts-->
  <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script src="js/materialize.js"></script>
  <script src="js/init.js"></script>
</head>
<body>
  <!-- Contenedor 1  -->
  <nav class="blue lighten-2" role="navigation">
    <div class="nav-wrapper container">

      <!-- encabezado -->
      <img src="imagenes/Logo.png" style="width:65px;height:64px;border:10px"></img>
      <a id="logo-container" href="Index.php" class="brand-logo">Sign to all</a>

      <!-- menu pc -->
      <ul class="right hide-on-med-and-down">
        <li><a href="Lecciones.php">Lecciones</a></li>
        <li><a href="#abajo">Contacto</a></li>
        <li><a href="Inicio-de-Sesion.php">Iniciar sesión</a></li>
        <li><a href="Registro.php" >Registrarse</a></li>
      </ul>

      <!-- menu mobile  -->
      <ul id="nav-mobile" class="sidenav">
        <li><a href="Lecciones.php">Lecciones</a></li>
        <li><a href="#abajo">Contacto</a></li>
        <li><a href="Inicio-de-Sesion.php">Iniciar sesión</a></li>
        <li><a href="Registro.php" >Registrarse</a></li>
      </ul>

      <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    </div>
  </nav>
  <form action="Inicio-de-Sesion.php" method="post">
  <div id="index-banner" class="parallax-container">
    <div class="section no-pad-bot">
      <div class="container white-text">
        <div class="row ingresar">
          <div class="col s12 m12">
            <div class="card">
              <div class="card-action center">
                <h1>Iniciar sesión</h1>

                <?php if (!empty($message)): ?> 
                    <p> <?= $message ?></p>
                  <?php endif; ?> 

              </div>
              <div class="card-content">
                <div class="form-field">
                  <label class="white-text">Usuario: </label>
                  <input class="white-text" type="text" name="nombreU" id="usuario" required>
                </div><br>
                <div class="form-field">
                <label class="white-text">Contraseña: </label>
                  <input class="white-text" type="password" name="contraseña" id="pass" required>
                </div><br>
                <!-- Esto es lo nuevo  -->
                <div class="form-field center-align">
                  
                      <label>
                        <input name="rol" type="radio" value="estudiante"/>
                        <span class="white-text">Estudiante</span>
                      </label>
                      <label>
                        <input name="rol" type="radio" value="profesor_a"/>
                        <span class="white-text">Profesor/a</span>
                      </label>
                    
                </div><br>
                <!-- Aqui termina y borra estos comentarios  -->
                <div class="form-field">
                  <form action="#">
                    <label>
                      <input type="checkbox" id="recordar" />
                      <span  class="white-text">Recuerdame</span>
                    </label>
                  </form>
                </div><br>
                <div class="form-field center-align">
                  <button class="waves-effect waves-light btn-large lime" type="submit">Ingresar</button>
                </div><br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fondo 1-->
    <div class="parallax"><img src="Fondo/MonoCohete.jpeg" alt="Unsplashed background img 1"></div>
  </div>
</form>
  <!-- pie de pagina-->
  <a name="abajo"></a>
  <footer class="page-footer lime darken-2">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text">Sobre Nosotros</h5>
          <p class="grey-text text-lighten-4">Sign to all busca generar un entorno más ameno para niños de
            segundo grado del colegio Pablo de Tarso con discapacidades auditivas , impulsando al
            estudiante a obtener una mejor compresión y comunicación.
          </p>
        </div>
        <div class="col l3 s12">
          <h5 class="white-text">Redes Sociales</h5>
          <ul>
            <a class="btn" href="https://www.facebook.com/SIGN-to-ALL-106761894386754/?modal=admin_todo_tour"  target="_blank">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a class="btn" href="mailto:signtoall8@gmail.com"  target="_blank">
              <i class="far fa-envelope"></i>
            </a>
            <a class="btn" href="https://www.instagram.com/sign_to_all/"  target="_blank">
              <i class="fab fa-instagram"></i>
            </a>
            <a class="btn" href="https://github.com/Bing1177/Sign-to-all.git" target="_blank">
              <i class="fab fa-github"></i>
            </a>
          <!--
            <a class="btn" href="#">
              <i class="fab fa-twitter"></i>
            </a>
            <a class="btn" href="#">
              <i class="fab fa-youtube"></i>
            </a>
          -->
          </ul>
        </div>
        <div class="col l3 s12">
          <h5 class="white-text">Contactenos</h5>
          <ul>
            <li><a class="white-text email" href="mailto:clfigueroa@ucundinamarca.edu.co">clfigueroa@ucundinamarca.edu.co</a></li>
            <li><a class="white-text email" href="mailto:layara@ucundinamarca.edu.co">layara@ucundinamarca.edu.co</a></li>
            <li><a class="white-text email" href="mailto:daranda@ucundinamarca.edu.co">daranda@ucundinamarca.edu.co</a></li>
            <li><a class="white-text email" href="mailto:davaro@ucundinamarca.edu.co">davaron@ucundinamarca.edu.co</a></li>
            <li><a class="white-text email" href="mailto:nlcortes@ucundinamarca.edu.co">nlcortes@ucundinamarca.edu.co</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
      Hecho por el <a class="yellow-text darken-4" href="">Equipo de sign to all.</a>
      </div>
    </div>
  </footer>



  </body>
</html>
