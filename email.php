<?
$params = json_decode(file_get_contents('php://input'),true);

$message="Will use again?: " . $params['willUse'] . "\n";
$message.="Affect choice?: " . $params['affectChoice'] . "\n";
$message.="Yes why: " . $params['yesWhy'] . "\n";
$message.="No why: " . $params['noWhy'] . "\n";
$message.="Feedback: " . $params['feedback'] . "\n";
$message.="Email: " . $params['email'] . "\n";

mail('info@mapmyemissions.com', 'Map My Emissions Feedback', $message);
?>
