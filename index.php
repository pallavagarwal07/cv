<!DOCTYPE html>
<html>
    <head>
      <meta charset="utf-8" />
        <title>My Terminal Page</title>
        <script src="www/jquery-1.7.1.min.js"></script>
        <script src="www/parse.js"></script>
        <script src="www/jquery.mousewheel-min.js"></script>
        <script src="www/jquery.terminal-min.js"></script>
        <link href="www/jquery.terminal.css" rel="stylesheet"/>
    </head>
    <body style='font-family:"Source Code Pro", monospace'>
    <div id="tilda"></div>
    <h1>This is demo of JQuery Terminal Emulator, type tilda to open terminal</h1>
    <?php $str = file_get_contents("latex/cv.tex");
    $coded = base64_encode($str);
    echo '<script type="text/javascript">LoadFile("'.$coded.'")</script>' ?>
    </body>
</html>
