<?php
// Base path (works in subfolders and at domain root)
$BASE = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
if ($BASE === '/' || $BASE === '\\') { $BASE = ''; }

// Simple router using ?page=
$page = $_GET['page'] ?? 'train';
$allowed = ['train','words','grammar'];
if (!in_array($page, $allowed, true)) $page = 'train';

$TITLE = [
  'train'   => 'A2 Translation Trainer',
  'words'   => 'Example Words',
  'grammar' => 'Grammar Rules',
][$page];

include __DIR__ . '/templates/header.php';
?>
<main class="container">
  <?php include __DIR__ . "/pages/{$page}.php"; ?>
</main>
<?php include __DIR__ . '/templates/footer.php'; ?>
