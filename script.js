const intro = document.querySelector('#intro');
const letter = document.querySelector('#letter');
const openButton = document.querySelector('#openLetter');
const closeButton = document.querySelector('#closeLetter');
const replyButton = document.querySelector('#replyButton');
const replyMessage = document.querySelector('#replyMessage');
const date = document.querySelector('#today');

date.textContent = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
}).format(new Date());

function openLetter() {
  openButton.setAttribute('aria-expanded', 'true');
  intro.classList.add('is-hidden');
  letter.classList.add('is-visible');
  letter.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => closeButton.focus(), 700);
}

function closeLetter() {
  openButton.setAttribute('aria-expanded', 'false');
  letter.classList.remove('is-visible');
  letter.setAttribute('aria-hidden', 'true');
  intro.classList.remove('is-hidden');
  openButton.focus();
}

openButton.addEventListener('click', openLetter);
closeButton.addEventListener('click', closeLetter);

replyButton.addEventListener('click', () => {
  replyMessage.textContent = 'Thank you. That means more than you know. ♥';
  replyButton.textContent = 'Letter received';
  replyButton.disabled = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && letter.classList.contains('is-visible')) {
    closeLetter();
  }
});
