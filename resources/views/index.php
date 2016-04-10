<!--
* GenesisUI Bootstrap 4 Admin Template built as framework!
* Version 1.4.0
* https://GenesisUI.com
* Copyright 2016 creativeLabs Łukasz Holeczek
* License : https://GenesisUI.com/license.html
-->
<!DOCTYPE html>
<html lang="en" ng-app="app">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="ROOT Admin - UI Admin Kit Powered by Bootstrap 4.0.0 &amp; AngularJS 1.5.0">
        <meta name="author" content="Łukasz Holeczek">
        <meta name="keyword" content="ROOT Admin - UI Admin Kit Powered by Bootstrap 4.0.0 &amp; AngularJS 1.5.0">
        <!-- <link rel="shortcut icon" href="assets/ico/favicon.png"> -->
        <title>ROOT Admin - UI Admin Kit</title>
        <!-- Main styles for this application -->
        <link href="css/all.css" rel="stylesheet">
    </head>
    <!-- BODY options, add following classes to body to change options
		1. 'compact-nav'     	  - Switch sidebar to minified version (width 50px)
		2. 'sidebar-nav'		  - Navigation on the left
			2.1. 'sidebar-off-canvas'	- Off-Canvas
				2.1.1 'sidebar-off-canvas-push'	- Off-Canvas which move content
				2.1.2 'sidebar-off-canvas-with-shadow'	- Add shadow to body elements
		3. 'fixed-nav'			  - Fixed navigation
		4. 'navbar-fixed'		  - Fixed navbar
		5. 'top-nav'			  - Navigation on top
	-->
    <body class="navbar-fixed sidebar-nav fixed-nav">
        <!-- User Interface -->
        <ui-view></ui-view>
        <!-- Bootstrap and necessary plugins -->

        <script src="js/vendor.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>