<?php
session_set_cookie_params(['httponly'=>true,'samesite'=>'Lax','secure'=>!empty($_SERVER['HTTPS'])]);
session_start();
require __DIR__.'/config.php';
header('Content-Type: application/json; charset=utf-8');
$db = __DIR__.'/../data/publications.json';
$list = file_exists($db) ? (json_decode(file_get_contents($db), true) ?: []) : [];
$a = $_GET['a'] ?? 'list';
$admin = !empty($_SESSION['admin']);
function out($d, $c = 200) { http_response_code($c); echo json_encode($d); exit; }
function save($l) { global $db; file_put_contents($db, json_encode(array_values($l), JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT), LOCK_EX); }
if ($a === 'list') out(['admin'=>$admin, 'items'=>$list]);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['error'=>'Requête POST requise'], 405);
if ($a === 'login') {
  sleep(1);
  if (hash_equals(ADMIN_USER, $_POST['user'] ?? '') && hash_equals(ADMIN_PASSWORD, $_POST['password'] ?? '')) {
    session_regenerate_id(true); $_SESSION['admin'] = true; out(['ok'=>1]);
  }
  out(['error'=>'Identifiants incorrects'], 401);
}
if ($a === 'logout') { session_destroy(); out(['ok'=>1]); }
if (!$admin) out(['error'=>'Accès non autorisé'], 403);
if ($a === 'upload') {
  $f = $_FILES['file'] ?? null;
  if (!$f || $f['error']) out(['error'=>'Fichier invalide ou trop volumineux (limite du serveur)'], 400);
  $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
  $types = ['pdf'=>'pdf', 'mp4'=>'video', 'webm'=>'video'];
  if (!isset($types[$ext])) out(['error'=>'Formats acceptés : PDF, MP4, WebM'], 400);
  $name = bin2hex(random_bytes(8)).'.'.$ext;
  move_uploaded_file($f['tmp_name'], __DIR__.'/../uploads/'.$name);
  array_unshift($list, ['id'=>uniqid(), 'title'=>trim($_POST['title'] ?? '') ?: 'Sans titre', 'desc'=>trim($_POST['desc'] ?? ''), 'type'=>$types[$ext], 'file'=>'uploads/'.$name, 'date'=>date('Y-m-d')]);
  save($list); out(['ok'=>1]);
}
if ($a === 'delete') {
  foreach ($list as $i => $p) if ($p['id'] === ($_POST['id'] ?? '')) { @unlink(__DIR__.'/../'.$p['file']); unset($list[$i]); }
  save($list); out(['ok'=>1]);
}
out(['error'=>'Action inconnue'], 400);
