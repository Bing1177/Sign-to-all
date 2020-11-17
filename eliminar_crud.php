<?php 

	include_once 'database.php';

	if(isset($_GET['id']))
	{
		$id= $_GET['id'];
		$delete=$conn->prepare('DELETE FROM estudiante WHERE id=:id');
		$delete->execute(array(
			':id'=>$id
		));
		header('Location: CRUD.php');
	}else{
		header('Location: CRUD.php');
	}
 ?>