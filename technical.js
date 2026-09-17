/* Progressive enhancement: every explanation is readable without JavaScript. */
(() => {
  const controls = document.querySelector('.journey-controls');
  const steps = [...document.querySelectorAll('[data-step]')];
  const stages = [...document.querySelectorAll('.stage')];
  const progress = document.querySelector('.journey-progress span');
  controls.hidden = false;
  function showStage(index) {
    stages.forEach((stage, i) => { stage.hidden = i !== index; });
    steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    progress.style.width = `${(index + 1) * 25}%`;
  }
  steps.forEach(button => button.addEventListener('click', () => showStage(Number(button.dataset.step))));
  showStage(0);
  const notes = [...document.querySelectorAll('[data-topic]')];
  const topic = document.querySelector('#topic');
  const expand = document.querySelector('#expand-notes');
  document.querySelector('.note-tools').hidden = false;
  const visibleNotes = () => notes.filter(note => !note.hidden);
  function updateButton() {
    expand.textContent = visibleNotes().every(note => note.open) ? 'Collapse all' : 'Expand all';
  }
  topic.addEventListener('change', () => {
    notes.forEach(note => { note.hidden = topic.value !== 'all' && note.dataset.topic !== topic.value; });
    document.querySelector('#note-count').textContent = `${visibleNotes().length} notes`;
    updateButton();
  });
  expand.addEventListener('click', () => {
    const open = !visibleNotes().every(note => note.open);
    visibleNotes().forEach(note => { note.open = open; });
    updateButton();
  });
  notes.forEach(note => note.addEventListener('toggle', updateButton));
})();
