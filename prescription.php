<?php
	$Write="<?php $" . "UIDresult=''; " . "echo $" . "UIDresult;" . " ?>";
	file_put_contents('UIDContainer.php',$Write);
?>

<!DOCTYPE html>
<html lang="en">
<html>
	<head>
	
		
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>prescription Controlled Notes App</title>
		<meta name="description" content="">
		

 		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shoelace-css/1.0.0-beta16/shoelace.css">
		<link rel="stylesheet" href="styles.css"> 
	
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="utf-8">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<script src="js/bootstrap.min.js"></script>
		<style>
		html {
			font-family: Arial;
			display: inline-block;
			margin: 0px auto;
			text-align: center;
		}

		ul.topnav {
			list-style-type: none;
			margin: auto;
			padding: 0;
			overflow: hidden;
			background-color: #c22f3b;
			width: 70%;
		}

		ul.topnav li {float: left;}

		ul.topnav li a {
			display: block;
			color: white;
			text-align: center;
			padding: 14px 16px;
			text-decoration: none;
		}

		ul.topnav li a:hover:not(.active) {background-color: #817c60;}

		ul.topnav li a.active {background-color: #333;}

		ul.topnav li.right {float: right;}

		@media screen and (max-width: 600px) {
			ul.topnav li.right, 
			ul.topnav li {float: none;}
		}
		
		img {
			display: block;
			margin-left: auto;
			margin-right: auto;
		}
		</style>
		
		<title>Home : NodeMCU V3 ESP8266 / ESP12E with MYSQL Database</title>
	</head>
	
	<body>
	

	
		
		<ul class="topnav">
			<li><a href="home.php">Home</a></li>
			<li><a href="user data.php">User Data</a></li>
			<li><a href="registration.php">Registration</a></li>
			<li><a href="read tag.php">Read Tag ID</a></li>
			<li><a class="active" href="prescription.php">Prescription</a></li>
			<li><a href="reports.php">Reports</a></li>
		</ul>
		<br>
		<h3>Melbourne Institute of Medical Sciences</h3>
		<br>
		<div class="container">
			<div class="wrapper">
			  <header>
                <h3>Vocal Capturing</h3>
			  </header>
      
			  <section class="main-controls">
			    <canvas class="visualizer" height="60px"></canvas>
				<div id="buttons">
				  <button class="record">Record</button>
				  <button class="stop">Stop</button>
				</div>
			  </section>   
			  <section class="sound-clips"></section>
				  <textarea class="output"></textarea>
				<div>   
					<button id="save-note-btn" title="Save Note">Save Note</button>
				</div>
				   <p id="recording-instructions">Press the <strong>Record</strong> button and allow access.</p>
				    <ul id="notes">
				      <li>
						<p class="no-notes">You don't have any notes.</p>
				      </li>
				    </ul>
			</div>
		</div>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="./app1.js"></script>
		
		
		
	</body>
</html>
<link rel="stylesheet" href="../../stylesheets/coloringpage.css" type="text/css" media="screen, projection" />
<link rel="stylesheet" href="../../stylesheets/coloringpageprint.css" type="text/css" media="print" />