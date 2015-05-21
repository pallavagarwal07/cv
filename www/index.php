<!DOCTYPE html>
<html>
    <head>
        <title>My Terminal Page</title>
        <script type="text/javascript" src="./jquery.js"></script>
        <script type="text/javascript" src="./parse.js"></script>
    </head>
    <body>
        <?php
        $str = file_get_contents("../latex/cv.tex");
        $coded = base64_encode($str);
        echo '<script type="text/javascript">LoadFile("'.$coded.'")</script>'
        ?>
    </body>
</html>
