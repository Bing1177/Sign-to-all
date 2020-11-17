<?php 
    include_once 'database.php';

  $sentencia_select = $conn->prepare('SELECT * FROM estudiante ORDER BY id DESC');
  $sentencia_select->execute();
  $resultado = $sentencia_select->fetchAll();

  // metodo buscar
  if(isset($_POST['btn_buscar']))
  {
    $buscar_text= $_POST['buscar'];
    $select_buscar= $conn->prepare('
      SELECT * FROM estudiante WHERE nombre_apellido LIKE :campo;'
    );

    $select_buscar->execute(array(
      ':campo' =>"%".$buscar_text."%"
    ));

    $resultado = $select_buscar->fetchAll();

  }

  session_start();

  if (isset($_SESSION['user_id_estu'])) {
      $records = $conn->prepare('SELECT nombre_apellido, identificacion, password, confir_password FROM estudiante WHERE identificacion = :ide');
      $records->bindParam(':ide', $_SESSION['user_id_estu']);
      $records->execute();
      $results = $records->fetch(PDO::FETCH_ASSOC);

       $user_estu = null;

    if (count($results) > 0) {
      $user_estu = $results;
    }

  }elseif (isset($_SESSION['user_id_prof'])) {
      $records = $conn->prepare('SELECT nombre_apellido, identificacion, password, confir_password FROM profesor_a WHERE identificacion = :ide');
      $records->bindParam(':ide', $_SESSION['user_id_prof']);
      $records->execute();
      $results = $records->fetch(PDO::FETCH_ASSOC);

      $user_prof = null;

    if (count($results) > 0) {
      $user_prof = $results;
    }
  }
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Estudiantes</title>
<link rel="shortcut icon" href="imagenes/Logo.png" type="image/png" />

<!-- Hojas de CSS  -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection"/>
<link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>
<link rel="stylesheet" href="css/style.css">


<!--css iconos-->
<link rel="stylesheet" href="css/iconos.css">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">

<!--  Scripts-->
<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="js/materialize.js"></script>
<script src="js/init.js"></script>
<style>
    .ingresar{
      margin-top: 100px;
      margin-bottom: 100px;
    }
    .ingresar .card{
      background: rgba(1, 84, 151, 0.3);
    }
</style>
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
          <?php if(empty($user_estu) && empty($user_prof)): ?>
              <li><a href="Inicio-de-Sesion.php">Iniciar sesión</a></li>
              <li><a href="Registro.php">Registrarse</a></li>

          <?php elseif(!empty($user_estu)): ?>
             <li> <a href="cierre_sesion.php">
                Cerrar Sesión
              </a></li>
              
          <?php elseif(!empty($user_prof)): ?>
             <li> <a href="CRUD.php">
                Estudiantes
              </a></li>
              <li> <a href="cierre_sesion.php">
                Cerrar Sesión
              </a></li>

          <?php endif; ?>

        
      </ul>

      <!-- menu mobile  -->
      <ul id="nav-mobile" class="sidenav">

        <li><a href="Lecciones.php">Lecciones</a></li>
        <li><a href="#abajo">Contacto</a></li>
          <?php if(empty($user_estu) && empty($user_prof)): ?>
              <li><a href="Inicio-de-Sesion.php">Iniciar sesión</a></li>
              <li><a href="Registro.php">Registrarse</a></li>

          <?php elseif(!empty($user_estu)): ?>
             <li> <a href="cierre_sesion.php">
                Cerrar Sesión
              </a></li>
              
          <?php elseif(!empty($user_prof)): ?>
             <li> <a href="CRUD.php">
                Estudiantes
              </a></li>
              <li> <a href="cierre_sesion.php">
                Cerrar Sesión
              </a></li>

          <?php endif; ?>

      </ul>

      <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    </div>
  </nav>
  <div id="index-banner" class="parallax-container">
    <div class="section no-pad-bot">
      <div class="container white-text">
        <div class="row ingresar">
          <div class="col s12 m12">
            <div class="card">
              <div class="card-action center">
	            <div class="form-field center-align">

              <h2>ESTUDIANTES</h2>

					<form action="" method="post" class="white-text formulario">

            <input type="text" name="buscar" placeholder="Buscar por nombre" class="white-text input__text"value="<?php if(isset($buscar_text)) echo $buscar_text; ?>" >

            <button type="submit" name="btn_buscar" class="waves-effect waves-light btn-large lime">Buscar</button>

            <a href="insertar_crud.php" class="waves-effect waves-light btn-large lime">Nuevo</a>
            
          </form>
          
					<table>
						<tr>
							<td>Id</td>
							<td>Nombre y Apellido</td>
							<td>Identificación</td>
							<td colspan="2">Acción</td>
						</tr>
						<?php foreach($resultado as $fila):?>
							<tr >
								<td><?php echo $fila['id']; ?></td>
								<td><?php echo $fila['nombre_apellido']; ?></td>
                <td><?php echo $fila['identificacion']; ?></td>

                <td><a href="actualizar_crud.php?id=<?php echo $fila['id']; ?>"  class="btn__update" >Editar</a></td>
					      <td><a href="eliminar_crud.php?id=<?php echo $fila['id']; ?>" class="btn__delete">Eliminar</a></td>
              </tr>
						<?php endforeach ?>
					</table>
                </div><br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fondo 1-->
    <div class="parallax"><img src="Fondo/Leo.jpg" alt="Unsplashed background img 1"></div>
  </div>

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
