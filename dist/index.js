"use strict";
/**
 * Copyright (C) 2020 Online Mic Test
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
 */console.log("Licensed under AGPL-3.0: https://github.com/onlinemictest/pitch-detector");var e=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],t=function(e){for(var t,n,o=[],i=1;i<arguments.length;i++)o[i-1]=arguments[i];(t=e.classList).remove.apply(t,o),e.offsetWidth,(n=e.classList).add.apply(n,o)};function n(t){var n=function(e){var t=Math.log(e/440)/Math.log(2)*12;return Math.round(t)+69}(t);return{value:n%12,index:n,name:e[n%12],cents:o(t,n),octave:Math.trunc(n/12)-1,frequency:t}}function o(e,t){return Math.floor(1200*Math.log(e/function(e){return 440*Math.pow(2,(e-69)/12)}(t))/Math.log(2))}Aubio().then((function(e){var o,i,a,r,d=e.Pitch;if(function(){if(window.AudioContext=window.AudioContext||window.webkitAudioContext,!window.AudioContext)return alert("AudioContext not supported");void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return t||alert("getUserMedia is not implemented in this browser"),new Promise((function(n,o){t.call(navigator,e,n,o)}))})}(),!("WebAssembly"in window&&"AudioContext"in window&&"createAnalyser"in AudioContext.prototype&&"createScriptProcessor"in AudioContext.prototype&&"trunc"in Math))return alert("Browser not supported");var c,s,l,u,v=null===(o=document.getElementById("pitch-wheel"))||void 0===o?void 0:o.querySelector("svg"),y=null===(i=document.getElementById("pitch-freq"))||void 0===i?void 0:i.querySelector(".freq"),m=null===(a=document.getElementById("pitch-freq"))||void 0===a?void 0:a.querySelector(".note"),p=null===(r=document.getElementById("pitch-freq"))||void 0===r?void 0:r.querySelector(".octave"),f=document.getElementById("audio-start"),g=document.getElementById("audio-pause"),h=document.getElementById("pitch-freq-text"),w=document.querySelector(".audio-block-2");v&&y&&m&&p&&f&&g&&h&&(g.addEventListener("click",(function(){l.disconnect(c.destination),s.disconnect(l),c.close(),f.style.display="block",g.style.display="none",h.style.display="none",w&&(w.style.display="block"),t(f,"blob-animation")})),f.addEventListener("click",(function(){c=new AudioContext,s=c.createAnalyser(),l=c.createScriptProcessor(4096,1,1),u=new d("default",4096,1,c.sampleRate),navigator.mediaDevices.getUserMedia({audio:!0}).then((function(e){c.createMediaStreamSource(e).connect(s),s.connect(l),l.connect(c.destination),f.style.display="none",g.style.display="block",h.style.display="block",w&&(w.style.display="none"),t(g,"shrink-animation");var o=0;l.addEventListener("audioprocess",(function(e){var t=n(u.do(e.inputBuffer.getChannelData(0))),i=15*t.index+t.cents/100*15;if(t.name){var a=Math.trunc(Math.abs(o-i));o=i;var r=15*(a+25);y.innerText=t.frequency.toFixed(1),m.innerText=t.name,p.innerText=t.octave.toString(),v.style.transition="transform "+r+"ms ease",v.style.transform="rotate(-"+i+"deg)"}}))}))})))}));
//# sourceMappingURL=index.js.map
