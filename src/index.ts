import { once, timeout } from "./helper-fns";
import { initGetUserMedia } from "./init-get-user-media";
import { toggleClass } from "./dom-fns";
import { getNote } from "./music-fns";

/**
 * Copyright (C) 2021 Online Mic Test
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license
 */
console.log('Licensed under AGPL-3.0: https://github.com/onlinemictest/pitch-detector')

const WHEEL_NOTES = 24;
const BUFFER_SIZE = 4096;

const blobAnimation: (startEl: HTMLElement) => void = 'animate' in Element.prototype
  ? el => el.animate([{ transform: 'scale(0.33)' }, { transform: 'scale(1)' }], { duration: 125, easing: 'ease' })
  : el => toggleClass(el, 'blob-animation')

const shrinkAnimation: (pauseEl: HTMLElement) => void = 'animate' in Element.prototype
  ? el => el.animate([{ transform: 'scale(3) ' }, { transform: 'scale(1)' }], { duration: 125, easing: 'ease' })
  : el => toggleClass(el, 'shrink-animation');

initGetUserMedia();

if (false
  || !('WebAssembly' in window)
  || !('AudioContext' in window)
  || !('createAnalyser' in AudioContext.prototype)
  || !('createScriptProcessor' in AudioContext.prototype)
) {
  if (!('WebAssembly' in window))
    throw alert(`Browser not supported: 'WebAssembly' is not defined`);
  if (!('AudioContext' in window))
    throw alert(`Browser not supported: 'AudioContext' is not defined`)
  if (!('createAnalyser' in AudioContext.prototype))
    throw alert(`Browser not supported: 'AudioContext.prototype.createAnalyser' is not defined`)
  if (!('createScriptProcessor' in AudioContext.prototype))
    throw alert(`Browser not supported: 'AudioContext.prototype.createScriptProcessor' is not defined`)
}

// @ts-expect-error
Aubio().then(({ Pitch }) => {
  const pitchDetectorEl = document.getElementById('pitch-detector') as HTMLDivElement | null;
  const wheel = document.getElementById('pitch-wheel-svg') as HTMLImageElement | null;
  const freqSpan = document.getElementById('pitch-freq')?.querySelector('.freq') as HTMLElement | null;
  const noteSpan = document.getElementById('pitch-freq')?.querySelector('.note') as HTMLElement | null;
  const octaveSpan = document.getElementById('pitch-freq')?.querySelector('.octave') as HTMLElement | null;
  const startEl = document.getElementById('audio-start') as HTMLButtonElement | null;
  const pauseEl = document.getElementById('audio-pause') as HTMLButtonElement | null;
  const pressPlay = document.getElementById('circle-text-play') as HTMLSpanElement | null
  const errorEl = document.getElementById('circle-text-error') as HTMLSpanElement | null;
  const freqTextEl = document.getElementById('pitch-freq-text') as HTMLElement | null;
  if (
    !pitchDetectorEl ||
    !wheel ||
    !freqSpan ||
    !noteSpan ||
    !octaveSpan ||
    !startEl ||
    !pauseEl ||
    !pressPlay ||
    !errorEl ||
    !freqTextEl
  ) {
    return alert('Expected HTML element missing');
  }

  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let scriptProcessor: ScriptProcessorNode;
  let pitchDetector: Aubio.Pitch;
  let stream: MediaStream;

  pauseEl.addEventListener('click', async () => {
    startEl.style.display = 'block';
    pauseEl.style.display = 'none';
    freqTextEl.style.opacity = '0';
    pressPlay.style.display = 'block';
    blobAnimation(startEl);
    await Promise.race([once(startEl, 'animationend'), timeout(250)]);

    scriptProcessor.disconnect(audioContext.destination);
    analyser.disconnect(scriptProcessor);
    audioContext.close();
    stream.getTracks().forEach(track => track.stop());
  })

  startEl.addEventListener('click', async () => {
    pitchDetectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    startEl.style.display = 'none';
    pauseEl.style.display = 'block';
    pressPlay.style.display = 'none';
    errorEl.style.display = 'none';
    shrinkAnimation(pauseEl);
    await Promise.race([once(pauseEl, 'animationend'), timeout(250)]);

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
    pitchDetector = new Pitch('default', BUFFER_SIZE, 1, audioContext.sampleRate);

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.createMediaStreamSource(stream).connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      freqTextEl.style.opacity = '1';

      let prevDeg = 0;

      scriptProcessor.addEventListener('audioprocess', event => {
        const frequency = pitchDetector.do(event.inputBuffer.getChannelData(0));
        const note = getNote(frequency);

        const unit = (360 / WHEEL_NOTES);
        const deg = note.index * unit + (note.cents / 100) * unit;

        if (note.name) {
          const degDiff = Math.trunc(Math.abs(prevDeg - deg));
          prevDeg = deg;
          const transformTime = (degDiff + 25) * 15;

          freqSpan.innerText = note.frequency.toFixed(1);
          noteSpan.innerText = note.name;
          octaveSpan.innerText = note.octave.toString();

          wheel.style.transition = `transform ${transformTime}ms ease`;
          wheel.style.transform = `rotate(-${deg}deg)`;
        }
      });
    } catch (err) {
      startEl.style.display = 'block';
      pauseEl.style.display = 'none';
      freqTextEl.style.opacity = '0';
      blobAnimation(startEl);
      errorEl.innerText = err.message;
      pressPlay.style.display = 'none';
      errorEl.style.display = 'block';
    };
  });
});

