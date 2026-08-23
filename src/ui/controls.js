const MIN_SPEED = 0.1;
const MAX_SPEED = 100;

function sliderToSpeed(value) {
  return Math.pow(10, (value / 100) * 3 - 1);
}

function formatSpeed(speed) {
  if (speed >= 10) return `x${Math.round(speed)}`;
  return `x${speed.toFixed(1)}`;
}

export function initControls({ onSpeedChange, onPauseChange, onToggleOrbits, onToggleLabels }) {
  const slider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  const pauseBtn = document.getElementById('pause-btn');
  const orbitsCheckbox = document.getElementById('toggle-orbits');
  const labelsCheckbox = document.getElementById('toggle-labels');

  let paused = false;

  const applySlider = () => {
    const speed = sliderToSpeed(parseFloat(slider.value));
    speedValue.textContent = formatSpeed(speed);
    onSpeedChange(speed);
  };

  slider.addEventListener('input', applySlider);

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Reanudar' : 'Pausar';
    pauseBtn.classList.toggle('paused', paused);
    onPauseChange(paused);
  });

  orbitsCheckbox.addEventListener('change', () => onToggleOrbits(orbitsCheckbox.checked));
  labelsCheckbox.addEventListener('change', () => onToggleLabels(labelsCheckbox.checked));

  applySlider();
}

export { MIN_SPEED, MAX_SPEED };
