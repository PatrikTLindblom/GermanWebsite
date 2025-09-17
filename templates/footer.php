  <footer class="site-footer">
    <div class="container">
      <small>© <?= date('Y') ?> A2 Trainer — Modular PHP Site</small>
    </div>
  </footer>

  <script>
    // Make base path available to JS
    window.APP_BASE = "<?= $BASE ?>";
  </script>
  <script src="<?= $BASE ?>/public/js/app.js" type="module"></script>
</body>
</html>
