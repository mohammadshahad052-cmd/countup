const elements = {
  count: document.querySelector('#count'), limit: document.querySelector('#limit'),
  progress: document.querySelector('#progress-fill'), progressCopy: document.querySelector('#progress-copy'),
  status: document.querySelector('#status-message'), increase: document.querySelector('#increase'),
  decrease: document.querySelector('#decrease'), reset: document.querySelector('#reset'),
  form: document.querySelector('#limit-form'), theme: document.querySelector('#theme-toggle')
};

let state = { count: 0, limit: 10 };
try { state = { ...state, ...JSON.parse(localStorage.getItem('countup-state')) }; } catch (_) {}

function save() { localStorage.setItem('countup-state', JSON.stringify(state)); }
function render() {
  const percent = Math.min(100, (state.count / state.limit) * 100);
  const reached = state.count >= state.limit;
  elements.count.textContent = state.count.toLocaleString();
  elements.limit.value = state.limit;
  elements.progress.style.width = `${percent}%`;
  elements.progressCopy.textContent = `${state.count.toLocaleString()} of ${state.limit.toLocaleString()}`;
  elements.increase.disabled = reached;
  elements.status.textContent = reached ? '🎉 Limit reached — brilliant work!' : state.count === 0 ? 'Ready when you are.' : `${(state.limit - state.count).toLocaleString()} more to reach your goal.`;
  elements.status.classList.toggle('reached', reached);
  save();
}
elements.increase.addEventListener('click', () => { if (state.count < state.limit) { state.count++; render(); } });
elements.decrease.addEventListener('click', () => { if (state.count > 0) { state.count--; render(); } });
elements.reset.addEventListener('click', () => { state.count = 0; render(); });
elements.form.addEventListener('submit', (event) => {
  event.preventDefault(); const nextLimit = Number(elements.limit.value);
  if (!Number.isInteger(nextLimit) || nextLimit < 1 || nextLimit > 1000000) { elements.limit.focus(); return; }
  state.limit = nextLimit; if (state.count > state.limit) state.count = state.limit; render();
});
const savedTheme = localStorage.getItem('countup-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
function renderTheme() { const dark = document.body.classList.contains('dark'); elements.theme.textContent = dark ? '☀' : '☾'; elements.theme.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); }
elements.theme.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('countup-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); renderTheme(); });
renderTheme(); render();
