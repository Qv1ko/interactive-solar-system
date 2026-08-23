let panelEl;
let titleEl;
let subtitleEl;
let rowsEl;
let followBtn;
let currentBody = null;

const callbacks = {
  onClose: null,
  onFollow: null,
};

export function initInfoPanel({ onClose, onFollow }) {
  callbacks.onClose = onClose;
  callbacks.onFollow = onFollow;

  panelEl = document.getElementById('info-panel');
  titleEl = document.getElementById('info-title');
  subtitleEl = document.getElementById('info-subtitle');
  rowsEl = document.getElementById('info-rows');
  followBtn = document.getElementById('follow-btn');

  document.getElementById('close-info').addEventListener('click', () => {
    hide();
    if (callbacks.onClose) callbacks.onClose();
  });

  followBtn.addEventListener('click', () => {
    if (!currentBody || !callbacks.onFollow) return;
    const nowFollowing = callbacks.onFollow(currentBody);
    setFollowState(nowFollowing);
  });
}

export function show(bodyName, bodyType, rows) {
  titleEl.textContent = bodyName;
  const typeNames = {
    sun: 'Estrella · G2V',
    planet: 'Planeta',
    moon: 'Luna natural',
  };
  subtitleEl.textContent = typeNames[bodyType] ?? '';

  rowsEl.innerHTML = '';
  for (const [key, value] of rows) {
    const keySpan = document.createElement('span');
    keySpan.className = 'info-key';
    keySpan.textContent = key;
    const valSpan = document.createElement('span');
    valSpan.className = 'info-val';
    valSpan.textContent = value;
    rowsEl.append(keySpan, valSpan);
  }

  panelEl.classList.remove('hidden');
  setFollowState(false);
}

export function hide() {
  panelEl.classList.add('hidden');
  currentBody = null;
}

export function setCurrentBody(name, type, rows) {
  currentBody = { name, type, rows };
}

export function setFollowState(following) {
  followBtn.classList.toggle('following', following);
  followBtn.textContent = following ? 'Dejar de seguir' : 'Seguir';
}
