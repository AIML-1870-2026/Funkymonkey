/* ── STATE ─────────────────────────────────────────────────── */
let openaiKey = '';

/* ── DOM REFS ──────────────────────────────────────────────── */

const apiKeyInput    = document.getElementById('api-key');
const toggleKeyBtn   = document.getElementById('toggle-key');
const keyPill        = document.getElementById('key-pill');
const modelSelect    = document.getElementById('model-select');
const toneSelect      = document.getElementById('tone-select');
const intensitySlider = document.getElementById('intensity-slider');
const intensityValue  = document.getElementById('intensity-value');
const lengthSlider    = document.getElementById('length-select');
const lengthValue     = document.getElementById('length-value');
const productInput   = document.getElementById('product-name');
const categorySelect = document.getElementById('category-select');
const commentsInput  = document.getElementById('comments');
const generateBtn    = document.getElementById('generate-btn');
const clearBtn       = document.getElementById('clear-btn');
const dropZone       = document.getElementById('drop-zone');
const envFileInput   = document.getElementById('env-file-input');
const placeholder    = document.getElementById('output-placeholder');
const outputBlock    = document.getElementById('output-block');
const outputMeta     = document.getElementById('output-meta');
const outputText     = document.getElementById('output-text');
const tokenInfo      = document.getElementById('token-info');

/* ── KEY HANDLING ──────────────────────────────────────────── */
function updateKeyPill(val) {
  keyPill.classList.remove('key-set', 'bad-key', 'flash');
  if (!val) {
    keyPill.textContent = 'OAI: NO KEY';
  } else if (val.startsWith('sk-') && val.length > 20) {
    keyPill.textContent = 'OAI: KEY SET';
    keyPill.classList.add('key-set');
  } else {
    keyPill.textContent = 'OAI: BAD KEY';
    keyPill.classList.add('bad-key');
  }
}

// Init pill
updateKeyPill('');

apiKeyInput.addEventListener('input', () => {
  openaiKey = apiKeyInput.value.trim();
  updateKeyPill(openaiKey);
});

toggleKeyBtn.addEventListener('click', () => {
  apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
});

/* ── SLIDER LABELS ─────────────────────────────────────────── */
const intensityLabels = ['slightly', 'moderately', 'strongly', 'extremely'];
const lengthLabels    = ['short', 'medium', 'long'];

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

intensitySlider.addEventListener('input', () => {
  intensityValue.textContent = capitalize(intensityLabels[intensitySlider.value]);
});

lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = capitalize(lengthLabels[lengthSlider.value]);
});

/* ── .ENV FILE LOADING ─────────────────────────────────────── */
dropZone.addEventListener('click', () => envFileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) parseEnvFile(file);
});
envFileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) parseEnvFile(file);
  e.target.value = '';
});

function parseEnvFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    const lines = ev.target.result.split(/[\r\n]+/);
    lines.forEach(raw => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;
      if (!line.includes('=')) return;
      const eq  = line.indexOf('=');
      const key = line.slice(0, eq).trim().toLowerCase().replace(/["']/g, '');
      const val = line.slice(eq + 1).trim().replace(/["']/g, '');
      if (key.includes('openai')) {
        apiKeyInput.value = val;
        openaiKey = val;
        updateKeyPill(val);
      }
    });
  };
  reader.readAsText(file);
}

/* ── EXAMPLES ──────────────────────────────────────────────── */
document.querySelectorAll('.example-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    productInput.value = btn.dataset.product;
    categorySelect.value = btn.dataset.category;
  });
});

/* ── CLEAR ─────────────────────────────────────────────────── */
clearBtn.addEventListener('click', () => {
  productInput.value = '';
  commentsInput.value = '';
  outputBlock.style.display = 'none';
  placeholder.style.display = 'flex';
  tokenInfo.innerHTML = 'PROMPT TOKENS: — &nbsp;·&nbsp; COMPLETION TOKENS: — &nbsp;·&nbsp; TOTAL: —';
});

/* ── KEYBOARD SHORTCUT ─────────────────────────────────────── */
productInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); generate(); }
});

/* ── PROMPT BUILDER ────────────────────────────────────────── */
const toneInstructions = {
  balanced:      'Write a balanced, honest review covering both strengths and weaknesses.',
  enthusiastic:  'Write an enthusiastic, energetic review that highlights the product\'s best qualities.',
  critical:      'Write a critical, analytical review that focuses on weaknesses and areas for improvement.',
  professional:  'Write a professional, formal review suitable for a trade publication.',
  casual:        'Write a casual, conversational review as if recommending (or not) to a friend.'
};

const intensityModifiers = {
  balanced:      ['mildly balanced', 'balanced', 'strongly balanced', 'strictly neutral and balanced'],
  enthusiastic:  ['slightly enthusiastic', 'moderately enthusiastic', 'very enthusiastic', 'extremely enthusiastic and effusive'],
  critical:      ['mildly critical', 'moderately critical', 'harshly critical', 'brutally and extremely critical'],
  professional:  ['somewhat professional', 'professional', 'highly professional and formal', 'extremely formal and authoritative'],
  casual:        ['slightly casual', 'moderately casual', 'very casual and relaxed', 'extremely casual and conversational']
};

const wordTargets = { short: 100, medium: 250, long: 500 };

function buildPrompts() {
  const category  = categorySelect.value;
  const tone      = toneSelect.value;
  const intensity = parseInt(intensitySlider.value);
  const length    = lengthLabels[lengthSlider.value];
  const modifier  = intensityModifiers[tone][intensity];
  const product   = productInput.value.trim();
  const comments  = commentsInput.value.trim();

  const systemPrompt =
    `You are an expert product reviewer specialising in ${category}.\n` +
    `${toneInstructions[tone]} Make the tone ${modifier}.\n` +
    `Aim for approximately ${wordTargets[length]} words.\n` +
    `Structure your review naturally: open with an overall impression, discuss key features, mention any notable pros and cons, and close with a recommendation.\n` +
    `Do not use markdown headers or bullet points — write in flowing prose only.`;

  let userMessage = `Write a product review for: ${product} (Category: ${category})`;
  if (comments) {
    userMessage += `\n\nAdditional context and instructions:\n${comments}`;
  }

  return { systemPrompt, userMessage };
}

/* ── GENERATE ──────────────────────────────────────────────── */
generateBtn.addEventListener('click', generate);

async function generate() {
  // Validate key
  if (!openaiKey || !openaiKey.startsWith('sk-') || openaiKey.length <= 20) {
    keyPill.classList.remove('flash');
    void keyPill.offsetWidth; // reflow to restart animation
    keyPill.classList.add('flash');
    return;
  }

  // Validate product name
  if (!productInput.value.trim()) {
    productInput.classList.remove('flash-error');
    void productInput.offsetWidth;
    productInput.classList.add('flash-error');
    productInput.addEventListener('animationend', () => productInput.classList.remove('flash-error'), { once: true });
    return;
  }

  const model    = modelSelect.value;
  const tone     = toneSelect.value;
  const category = categorySelect.value;
  const { systemPrompt, userMessage } = buildPrompts();

  // UI: loading state
  generateBtn.textContent = 'GENERATING…';
  generateBtn.classList.add('loading');
  generateBtn.disabled = true;
  outputBlock.style.display = 'none';
  placeholder.style.display = 'flex';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }

    // Parse response
    const reviewText = data.choices[0].message.content;

    const usage = data.usage || {};
    const promptTokens     = usage.prompt_tokens     ?? '—';
    const completionTokens = usage.completion_tokens ?? '—';
    const total = (typeof promptTokens === 'number' && typeof completionTokens === 'number')
      ? promptTokens + completionTokens
      : '—';

    // Render
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    outputMeta.textContent = `MODEL: ${model}  ·  TONE: ${tone.toUpperCase()}  ·  CATEGORY: ${category.toUpperCase()}  ·  ${now}`;
    outputText.textContent = reviewText;
    tokenInfo.innerHTML =
      `PROMPT TOKENS: ${promptTokens} &nbsp;·&nbsp; COMPLETION TOKENS: ${completionTokens} &nbsp;·&nbsp; TOTAL: ${total} &nbsp;·&nbsp; MODEL: ${model}`;

    placeholder.style.display = 'none';
    outputBlock.style.display = 'flex';

  } catch (err) {
    placeholder.style.display = 'none';
    outputBlock.style.display = 'flex';
    outputMeta.textContent = 'ERROR';
    outputText.textContent = err.message;
  }

  // UI: reset button
  generateBtn.textContent = 'GENERATE REVIEW';
  generateBtn.classList.remove('loading');
  generateBtn.disabled = false;
}
