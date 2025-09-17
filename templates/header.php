<?php if (!isset($TITLE)) { $TITLE = 'A2 Trainer'; } ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title><?= htmlspecialchars($TITLE) ?></title>
  <link rel="stylesheet" href="<?= $BASE ?>/public/css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand">A2 Trainer</div>
      <nav class="nav">
        <a href="<?= $BASE ?>/?page=train"   class="nav-link">Trainer</a>
        <a href="<?= $BASE ?>/?page=words"   class="nav-link">Words</a>
        <a href="<?= $BASE ?>/?page=grammar" class="nav-link">Grammar</a>
      </nav>
    </div>
  </header>
