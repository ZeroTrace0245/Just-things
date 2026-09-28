const chapters = [...document.querySelectorAll('.chapter')];
function showChapter(id) {
  chapters.forEach((chapter) => {
    const active = chapter.id === id;
    chapter.hidden = !active;
    chapter.classList.toggle('is-active', active);
  });
  if (id === 'album') startSlideshow();
  else stopSlideshow();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let audioContext;
let musicGain;
let musicTimer;
let musicOn = false;
const musicToggle = document.querySelector('#musicToggle');
const quietMusic = document.querySelector('#quietMusic');

function playMusicNote(frequency, startAt, length = 2.7) {
  if (!audioContext || !musicGain || !musicOn) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  envelope.gain.setValueAtTime(0.0001, startAt);
  envelope.gain.linearRampToValueAtTime(0.10, startAt + 0.35);
  envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + length);
  oscillator.connect(envelope).connect(musicGain);
  oscillator.start(startAt);
  oscillator.stop(startAt + length + 0.08);
}

function startMusic() {
  if (!audioContext) {
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return;
    audioContext = new AudioContextType();
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.18;
    musicGain.connect(audioContext.destination);
  }
  audioContext.resume();
  musicOn = true;
  musicGain.gain.setTargetAtTime(0.18, audioContext.currentTime, 0.12);
  if (musicToggle) {
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.querySelector('span').textContent = 'Turn off the music';
  }
  if (quietMusic) quietMusic.textContent = '♫';
  if (musicTimer) return;
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
  let index = 0;
  const playNext = () => {
    if (!musicOn || !audioContext) { musicTimer = null; return; }
    playMusicNote(notes[index % notes.length], audioContext.currentTime, 3.1);
    if (index % 3 === 0) playMusicNote(notes[(index + 2) % notes.length] / 2, audioContext.currentTime, 3.8);
    index += 1;
    musicTimer = window.setTimeout(playNext, 1750);
  };
  playNext();
}

function stopMusic() {
  musicOn = false;
  if (musicTimer) window.clearTimeout(musicTimer);
  musicTimer = null;
  if (musicGain && audioContext) musicGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.12);
  if (musicToggle) {
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.querySelector('span').textContent = 'Turn on a little music';
  }
}

function toggleMusic() {
  if (musicOn) stopMusic();
  else startMusic();
  if (quietMusic) quietMusic.textContent = musicOn ? '♫' : '♪';
}

document.querySelector('#openLetter').addEventListener('click', () => {
  const arrival = document.querySelector('#arrival');
  if (arrival.classList.contains('envelope-open')) return;
  arrival.classList.add('envelope-open');
  startMusic();
  window.setTimeout(() => {
    showChapter('letter');
    document.querySelector('#letter').classList.add('letter-revealed');
    quietMusic.hidden = false;
  }, 1450);
});

document.querySelector('#startQuest').addEventListener('click', () => showChapter('quest'));
musicToggle.addEventListener('click', toggleMusic);
quietMusic.addEventListener('click', toggleMusic);

// General Hogwarts-style riddles for now; these can be swapped for personal questions later.
const riddles = [
  { question: 'I have a face and two hands, but no arms or legs. What am I?', answers: ['A clock', 'A portrait', 'A suit of armor', 'A moon'], correct: 0, note: 'First charm unlocked: may there always be time for the things that make you happy.' },
  { question: 'The more I dry, the wetter I get. What am I?', answers: ['A rainy cloud', 'A towel', 'A potion', 'A lake'], correct: 1, note: 'Second charm unlocked: wishing you comfort, cozy moments, and absolutely no pressure.' },
  { question: 'I have many keys but cannot open a single door. What am I?', answers: ['A piano', 'A castle', 'A map', 'A house elf'], correct: 0, note: 'Final charm unlocked: your memories are waiting just beyond this little bit of magic.' }
];
let riddleIndex = 0;
let answerLocked = false;
const riddleCard = document.querySelector('#riddleCard');
const questFeedback = document.querySelector('#questFeedback');
const progressOrbs = [...document.querySelectorAll('.progress-orb')];

function renderRiddle() {
  const riddle = riddles[riddleIndex];
  answerLocked = false;
  questFeedback.textContent = '';
  progressOrbs.forEach((orb, index) => {
    orb.classList.toggle('is-current', index === riddleIndex);
    orb.classList.toggle('is-done', index < riddleIndex);
  });
  riddleCard.innerHTML = `<span class="riddle-number">RIDDLE ${riddleIndex + 1} OF ${riddles.length}</span><p class="riddle-question">${riddle.question}</p><div class="riddle-answers">${riddle.answers.map((answer, index) => `<button class="riddle-answer" type="button" data-answer="${index}">${answer}</button>`).join('')}</div>`;
  riddleCard.querySelectorAll('.riddle-answer').forEach((button) => {
    button.addEventListener('click', () => checkAnswer(Number(button.dataset.answer)));
  });
}

function checkAnswer(answerIndex) {
  if (answerLocked) return;
  if (answerIndex !== riddles[riddleIndex].correct) {
    questFeedback.textContent = 'Not quite — have another little guess. ✧';
    return;
  }
  answerLocked = true;
  riddleCard.querySelectorAll('.riddle-answer').forEach((button) => { button.disabled = true; });
  questFeedback.textContent = riddles[riddleIndex].note;
  progressOrbs[riddleIndex].classList.remove('is-current');
  progressOrbs[riddleIndex].classList.add('is-done');
  riddleIndex += 1;
  if (riddleIndex < riddles.length) {
    window.setTimeout(renderRiddle, 1250);
    return;
  }
  window.setTimeout(() => {
    riddleCard.innerHTML = '<div class="quest-complete"><span class="back-star">✦</span><p class="riddle-question">You did it!</p><p>The little album is all yours. Go on, turn over a memory or two.</p><button class="primary-button" id="unlockAlbum" type="button">Reveal the photos <span>✧</span></button></div>';
    document.querySelector('#unlockAlbum').addEventListener('click', () => showChapter('album'));
  }, 1250);
}

document.querySelector('#replay').addEventListener('click', () => {
  showChapter('letter');
  document.querySelector('#letter').classList.add('letter-revealed');
});
const memories = [
  { src: 'assets/IMG_20260828_120835.jpg', alt: 'A mirror selfie of the two of you together', caption: 'Anywhere beside you feels a little more like home.', card: 'My favorite place' },
  { src: 'assets/IMG-20260915-WA0009.jpg', alt: 'A cute bunny character in a little outfit', caption: 'A little bit of cute magic, saved just for you.', card: 'A little magic' },
  { src: 'assets/IMG-20260915-WA0023.jpg', alt: 'Byeole smiling in a pretty dress', caption: 'How are you this lovely, Byeole?', card: 'There you are' },
  { src: 'assets/IMG-20260919-WA0022.jpg', alt: 'A playful selfie of the two of you at the movies', caption: 'One of my favorite kinds of nights: us, doing our thing.', card: 'Our little world' },
  { src: 'assets/IMG-20260919-WA0025.jpg', alt: 'A close-up portrait of Byeole’s eyes', caption: 'Your eyes have their own kind of magic.', card: 'A little wonder' },
  { src: 'assets/IMG-20260919-WA0032.jpg', alt: 'A playful filtered selfie of the two of you together', caption: 'My favorite kind of chaos is the kind we share.', card: 'Us being us' },
  { src: 'assets/Screenshot_20260929_013609%5B1%5D.jpg', alt: 'A collage of four playful Byeole selfies', caption: 'Four little snapshots, one very favorite person.', card: 'Four smiles' }
];
let currentMemory = 0;
let slideshowTimer = null;
let slideshowPlaying = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const slideshowPhoto = document.querySelector('#slideshowPhoto');
const slideshowWrap = document.querySelector('.slideshow-photo-wrap');
const slideCaption = document.querySelector('#slideCaption');
const slideCount = document.querySelector('#slideCount');
const slideDots = document.querySelector('#slideDots');
const toggleSlideshow = document.querySelector('#toggleSlideshow');
const spiralOrbit = document.querySelector('#spiralOrbit');

function setMemory(index) {
  currentMemory = (index + memories.length) % memories.length;
  const memory = memories[currentMemory];
  slideshowPhoto.classList.add('is-changing');
  window.setTimeout(() => {
    slideshowPhoto.src = memory.src;
    slideshowPhoto.alt = memory.alt;
    slideCaption.textContent = memory.caption;
    slideCount.textContent = `${String(currentMemory + 1).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`;
    slideshowWrap.style.setProperty('--slide-image', `url("${memory.src}")`);
    slideshowPhoto.classList.remove('is-changing');
  }, 180);
  slideDots.querySelectorAll('.slide-dot').forEach((dot, dotIndex) => {
    const active = dotIndex === currentMemory;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-current', active ? 'true' : 'false');
  });
  spiralOrbit.querySelectorAll('.spiral-card').forEach((card, cardIndex) => {
    card.classList.toggle('is-selected', cardIndex === currentMemory);
  });
}

function updateSlideshowButton() {
  toggleSlideshow.textContent = slideshowPlaying ? 'Ⅱ  Pause slideshow' : '▶  Play slideshow';
  toggleSlideshow.setAttribute('aria-pressed', String(slideshowPlaying));
}

function startSlideshow() {
  spiralOrbit.classList.remove('is-paused');
  if (!slideshowPhoto.getAttribute('src')) setMemory(currentMemory);
  if (slideshowPlaying && !slideshowTimer) {
    slideshowTimer = window.setInterval(() => setMemory(currentMemory + 1), 4800);
  }
  updateSlideshowButton();
}

function stopSlideshow() {
  if (slideshowTimer) window.clearInterval(slideshowTimer);
  slideshowTimer = null;
  spiralOrbit.classList.add('is-paused');
}

function buildMemoryOrbit() {
  const angleStep = 360 / memories.length;
  memories.forEach((memory, index) => {
    const angle = angleStep * index;
    const counterAngle = -angle;
    const verticalOffset = Math.sin((angle * Math.PI) / 90) * 36;
    const tilt = index % 2 === 0 ? -3 : 3;
    const card = document.createElement('button');
    card.className = 'spiral-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Show photo ${index + 1}: ${memory.card}`);
    card.innerHTML = `<img src="${memory.src}" alt="" loading="lazy"><span>${memory.card}</span>`;
    card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--orbit-radius)) translateY(${verticalOffset}px) rotateY(${counterAngle}deg) rotateZ(${tilt}deg)`;
    card.addEventListener('click', () => {
      setMemory(index);
      slideshowWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    spiralOrbit.append(card);
  });
  function sizeOrbit() {
    const width = spiralOrbit.parentElement.clientWidth;
    const radius = Math.max(150, Math.min(330, width * 0.38));
    spiralOrbit.style.setProperty('--orbit-radius', `${radius}px`);
  }
  sizeOrbit();
  window.addEventListener('resize', sizeOrbit, { passive: true });
}

memories.forEach((memory, index) => {
  const dot = document.createElement('button');
  dot.className = 'slide-dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show photo ${index + 1}: ${memory.card}`);
  dot.addEventListener('click', () => setMemory(index));
  slideDots.append(dot);
});
document.querySelector('#previousPhoto').addEventListener('click', () => setMemory(currentMemory - 1));
document.querySelector('#nextPhoto').addEventListener('click', () => setMemory(currentMemory + 1));
toggleSlideshow.addEventListener('click', () => {
  slideshowPlaying = !slideshowPlaying;
  if (slideshowPlaying) startSlideshow();
  else { stopSlideshow(); updateSlideshowButton(); }
});
buildMemoryOrbit();
slideDots.firstElementChild.classList.add('is-active');
slideDots.firstElementChild.setAttribute('aria-current', 'true');
updateSlideshowButton();
renderRiddle();
