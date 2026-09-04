const state = {
  modeIndex: 0,
  modes: ['CLASSIC', 'DUELS'],
  xp: 773410.24,
  rating: 1580,
  coins: 10322,
  perks: [
    { icon: '◉', name: 'Start Mass', value: '50%', stars: 50, level: 10 },
    { icon: '⚡', name: 'Speed', value: '6%', stars: 50, level: 12 },
    { icon: '◈', name: 'Shield duration', value: '4.5%', stars: 50, level: 9 },
    { icon: '❄', name: 'Freeze duration', value: '3.5%', stars: 50, level: 7 }
  ],
  rankings: [
    { name: 'roMoceK', score: 144419, level: 44, emoji: '🟣' },
    { name: 'RoshnaRoshn', score: 138700, level: 47, emoji: '🔵' },
    { name: 'zorkraft', score: 137740, level: 9, emoji: '⚪' },
    { name: 'W_pang', score: 1580, level: 28, emoji: '👾' },
    { name: 'position_number2', score: 1204, level: 21, emoji: '🟢' }
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let toastTimer;

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

function setView(viewId) {
  $$('.view-panel, .mode-section').forEach((panel) => panel.classList.add('hidden'));
  const target = document.getElementById(viewId);
  if (target) target.classList.remove('hidden');
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === viewId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatNumber(value) { return Math.round(value).toLocaleString('en-US'); }

function renderPodium() {
  const podium = $('#podium');
  const top = state.rankings.slice(0, 3);
  const order = [top[1], top[0], top[2]];
  podium.innerHTML = order.map((player, index) => {
    const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
    return '<div class="podium-item"><div class="podium-avatar">' + player.emoji + '</div><span class="podium-name">' + player.name + '</span><span class="podium-score">🏆 ' + player.score + '</span><div class="podium-rank">' + rank + '</div></div>';
  }).join('');
}

function renderRanks() {
  $('#rank-list').innerHTML = state.rankings.slice(3).map((player, index) => '<div class="rank-row"><span class="rank-number">' + (index + 4) + '</span><span class="rank-user">' + player.emoji + ' ' + player.name + '<small>lvl ' + player.level + '</small></span><span class="rank-score">🏆 ' + player.score + '</span></div>').join('');
}

function renderPerks() {
  $('#perk-list').innerHTML = state.perks.map((perk, index) => '<div class="perk-card"><div class="perk-icon">' + perk.icon + '</div><div class="perk-info"><strong>' + perk.name + '</strong><small><b>' + perk.value + '</b> &nbsp; ⭐ ' + perk.stars + '</small></div><div class="perk-level">lvl ' + perk.level + '/50<button data-upgrade="' + index + '">UPGRADE</button></div></div>').join('');
}

function updateProfile() {
  $('#xp-total').textContent = formatNumber(state.xp) + '.24 XP';
  $('#xp-needed').textContent = formatNumber(Math.max(0, 812000 - state.xp));
  $('#rating').textContent = state.rating;
  $('#coins').textContent = formatNumber(state.coins);
  const progress = Math.min(100, Math.round((state.xp / 812000) * 100));
  $('#xp-progress').style.width = progress + '%';
}

function cycleMode(step) {
  state.modeIndex = (state.modeIndex + step + state.modes.length) % state.modes.length;
  $('#mode-title').textContent = state.modes[state.modeIndex];
  showToast(state.modes[state.modeIndex] + ' mode selected');
}

function play() {
  const gain = state.modeIndex === 0 ? 28 : 44;
  state.xp += gain;
  state.rating += state.modeIndex === 0 ? 4 : 8;
  state.coins += 12;
  updateProfile();
  showToast('Match found — +' + gain + ' XP');
}

function openGift() {
  state.coins += 180;
  updateProfile();
  showToast('Lootbox opened: +180 coins ✨');
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-view]');
  if (nav) { setView(nav.dataset.view); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'previous-mode') cycleMode(-1);
  if (action === 'next-mode') cycleMode(1);
  if (action === 'play') play();
  if (action === 'gift') setView('gifts-view');
  if (action === 'open-gift') openGift();
  if (action === 'premium') showToast('Premium is already active');
  if (action === 'close') showToast('Close is available when running inside Telegram');
  if (action === 'expand') showToast('Mini App expanded');
  const upgrade = event.target.closest('[data-upgrade]')?.dataset.upgrade;
  if (upgrade !== undefined) {
    const perk = state.perks[Number(upgrade)];
    if (perk.level < 50) { perk.level += 1; state.coins = Math.max(0, state.coins - 25); renderPerks(); updateProfile(); showToast(perk.name + ' upgraded to level ' + perk.level); }
  }
  const rankTab = event.target.closest('[data-rank-tab]');
  if (rankTab) { $$('.leader-tabs button').forEach((button) => button.classList.toggle('active', button === rankTab)); showToast(rankTab.dataset.rankTab === 'daily' ? 'Daily rankings loaded' : 'Season rankings loaded'); }
  const profileTab = event.target.closest('[data-profile-tab]');
  if (profileTab) { $$('.sub-tabs button').forEach((button) => button.classList.toggle('active', button === profileTab)); showToast(profileTab.dataset.profileTab === 'tasks' ? 'Tasks are coming next' : 'Perks loaded'); }
});

renderPodium();
renderRanks();
renderPerks();
updateProfile();

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  document.documentElement.style.setProperty('--tg-bg', window.Telegram.WebApp.backgroundColor || '#050607');
}
