<section class="card">
  <div class="card-head">
    <h1 class="card-title">A2 Translation Trainer</h1>

    <div class="controls">
      <div class="segmented">
        <button id="modeDeEn" class="seg-btn active">DE → EN</button>
        <button id="modeEnDe" class="seg-btn">EN → DE</button>
      </div>

      <select id="topicSelect" class="select"></select>

      <button id="shuffleBtn" class="btn">Shuffled</button>
      <button id="resetBtn" class="btn">Reset</button>

      <span id="progress" class="pill">0 / 0</span>
    </div>
  </div>

  <div class="card-body">
    <div class="prompt">
      <div class="label">Translate:</div>
      <div id="sourceText" class="prompt-text">...</div>
    </div>

    <div class="answer-row">
      <input id="answer" type="text" class="input" placeholder="Type your translation" />
      <button id="showBtn" class="btn">Show</button>
      <button id="nextBtn" class="btn primary">Next</button>
    </div>

    <div id="status" class="status"></div>
    <div id="reveal" class="reveal" style="display:none"></div>
  </div>
</section>

<section class="card">
  <div class="card-head">
    <h2 class="card-title">Settings</h2>
  </div>
  <div class="card-body">
    <p class="muted">The trainer automatically loads <code>/data/spektrum_a2_pairs_clean.json</code>.</p>
    <p>You can replace that file later or add another loader to support additional datasets.</p>
  </div>
</section>
