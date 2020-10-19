// import { render, html, svg } from 'lit-html';
// import { clock } from './clock';
// import { foo } from './play-button'

type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

const middleA = 440;

const SEMI_TONE = 69;
const WHEEL_NOTES = 24;
const BUFFER_SIZE = 4096;
const NOTE_STRINGS: NoteString[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function initGetUserMedia() {
  // @ts-ignore
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  if (!window.AudioContext) {
    return alert('AudioContext not supported')
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    // @ts-ignore
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      // @ts-ignore
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert('getUserMedia is not implemented in this browser')
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
}

interface Note {
  value: number,
  index: number,
  name: NoteString
  cents: number
  octave: number,
  frequency: number,
}

function getNote(frequency: number): Note {
  const noteIndex = getNoteIndex(frequency);
  return {
    value: noteIndex % 12,
    index: noteIndex,
    name: NOTE_STRINGS[noteIndex % 12],
    cents: getCents(frequency, noteIndex),
    octave: Math.trunc(noteIndex / 12) - 1,
    frequency: frequency,
  };
}

function groupBy<X, K>(f: (x: X) => K) {
  return function(xs: Iterable<X>): Map<K, X[]> {
    const res = new Map<K, X[]>();
    for (const x of xs) {
      const key = f(x);
      const group = res.get(key) || [];
      res.set(key, [...group, x]);
    }
    return res;
  };
}

/**
 * Get musical note from frequency
 */
function getNoteIndex(frequency: number) {
  const note = 12 * (Math.log(frequency / middleA) / Math.log(2))
  return Math.round(note) + SEMI_TONE
}

/**
 * Get the musical note's standard frequency
 */
function getStandardFrequency(note: number) {
  return middleA * Math.pow(2, (note - SEMI_TONE) / 12)
}

/**
 * Get cents difference between given frequency and musical note's standard frequency
 */
function getCents(frequency: number, note: number) {
  return Math.floor((1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2));
}

; (async () => {
  // @ts-expect-error
  const { Pitch }: typeof Aubio = await Aubio();

  initGetUserMedia();

  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
  const pitchDetector = new Pitch('default', BUFFER_SIZE, 1, audioContext.sampleRate);
  pitchDetector.setTolerance(0.5);

  // let abort = new AbortController();

  const wheel = document.getElementById('pitch-wheel')?.querySelector('svg');
  const freqSpan = document.getElementById('pitch-freq')?.querySelector('.freq') as HTMLElement;
  const noteSpan = document.getElementById('pitch-freq')?.querySelector('.note') as HTMLElement;
  const octaveSpan = document.getElementById('pitch-freq')?.querySelector('.octave') as HTMLElement;
  const startEl = document.getElementById('pitch-audio-start');
  const freqTextEl = document.getElementById('pitch-freq-text');
  if (!wheel || !freqSpan || !noteSpan || !octaveSpan || !startEl || !freqTextEl) return;

  // const textEls = Array.from(wheel.querySelectorAll('text')).reverse().map((x, i) => [NOTE_STRINGS[(i + 1) % 12], x] as [NoteString, SVGTextElement])
  // const textElsByNote = new Map([...groupBy(([s]: [NoteString, SVGTextElement]) => s)(textEls)].map(([k, v]) => [k, v.map(_ => _[1])]));

  startEl.addEventListener('click', async function clickCallback() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startEl.parentNode?.removeChild(startEl);
    freqTextEl.style.display = 'block';

    audioContext.createMediaStreamSource(stream).connect(analyser);
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(audioContext.destination)

    // wheel.style.transition = `transform 500ms ease-in-out`;

    // const lastFQS: number[] = new Array(7).fill(0);

    // let lastAnim: { cancel: typeof Animation.prototype.cancel } = { cancel: () => {} };
    // let lastFrame = {};
    let prevDeg = 0;

    scriptProcessor.addEventListener('audioprocess', event => {
      const frequency = pitchDetector.do(event.inputBuffer.getChannelData(0));
      // lastFQS.shift();
      // lastFQS.push(frequency);
      // const avgFreq = [...lastFQS].sort((a, b) => a - b)[Math.trunc(lastFQS.length / 2)];
      const note = getNote(frequency);

      const unit = (360 / WHEEL_NOTES);
      const deg = note.index * unit + (note.cents / 100) * unit;

      // console.log(note.name, note.index + (note.cents / 100), lastFQS)

      // textEls?.forEach(([, x]) => x.style.fill = 'rgb(67,111,142)');
      if (note.name) {
        const degDiff = Math.trunc(Math.abs(prevDeg - deg));
        prevDeg = deg;
        // degDiff > 30 && console.log(deg ** 2)
        wheel.style.transition = `transform ${(degDiff + 25) * 15}ms ease`;
        // console.log(wheel.style.transition)

        // const avgFreq = [...lastFQS].sort((a, b) => a - b)[Math.trunc(lastFQS.length / 2)];

        // textElsByNote.get(note.name)?.forEach(svgText => svgText.style.fill = `#e25c1b`);
        freqSpan.innerText = note.frequency.toFixed(1);
        noteSpan.innerText = note.name;
        octaveSpan.innerText = note.octave.toString();
        wheel.style.transform = `rotate(-${deg}deg)`;
        // console.log(wheel.style.transform)

        // const nextFrame = { transform: `rotate(-${deg}deg)` };
        // wheel.animate([nextFrame], { duration: degDiff * 100, easing: 'ease', composite: 'add' })
        // lastFrame = nextFrame;
      }
    });
  })


  // const main = html`<div>
  //   Foobar
  //   ${clock()}
  //   ${foo}
  // </div>`;

  // render(main, document.getElementById('pitch-detector') || document.body);
})();
