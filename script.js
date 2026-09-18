<<<<<<< HEAD
const owl=document.querySelector('#owl');
const owlFlight=document.querySelector('#owlFlight');
if(owl&&owlFlight)document.addEventListener('pointermove',event=>{const rect=owlFlight.getBoundingClientRect();if(rect.width<20)return;const x=Math.max(-7,Math.min(7,(event.clientX-(rect.left+rect.width/2))/26));const y=Math.max(-4,Math.min(4,(event.clientY-(rect.top+rect.height/2))/34));owl.style.transform=`rotate(${x*.35}deg) translate(${x}px,${y}px)`});

let audioStarted=false;
function startMagicAmbience(){if(audioStarted)return;audioStarted=true;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ctx=new AudioCtx(),master=ctx.createGain();master.gain.value=.035;master.connect(ctx.destination);const playNote=(frequency,when,duration)=>{const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,when);gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(.45,when+.12);gain.gain.exponentialRampToValueAtTime(.001,when+duration);oscillator.connect(gain).connect(master);oscillator.start(when);oscillator.stop(when+duration+.05)};const now=ctx.currentTime;[220,329.63,440,659.25,523.25].forEach((note,index)=>playNote(note,now+index*.34,1.7));setInterval(()=>playNote([261.63,329.63,392,523.25][Math.floor(Math.random()*4)],ctx.currentTime,.9),4200)}
document.addEventListener('pointerdown',startMagicAmbience,{once:true});
=======
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
  replyMessage.textContent = 'Thank you for reading it. You mean the whole wide world to me. ♡';
  replyButton.textContent = 'Tiny letter received!';
  replyButton.disabled = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && letter.classList.contains('is-visible')) {
    closeLetter();
  }
});
>>>>>>> c4ad0d093a59ea0d75d02c2bb611e0a932cacc9d
