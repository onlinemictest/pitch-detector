import { Tuner } from './tuner.js';

class Application {
  constructor() {
    this.initA4()
    this.tuner = new Tuner(this.a4)
    // this.notes = new Notes('.notes', this.tuner)
    // this.meter = new Meter('.meter')
    // this.frequencyBars = new FrequencyBars('.frequency-bars')
    this.update({ name: 'A', frequency: this.a4, octave: 4, value: 69, cents: 0 })
  }

  initA4() {
    // this.$a4 = document.querySelector('.a4 span');
    this.a4 = parseInt(localStorage.getItem('a4')) || 440;
    // this.$a4.innerHTML = this.a4
  }

  start() {
    this.tuner.onNoteDetected = (note) => {
      console.log(note);
      // if (this.notes.isAutoMode) {
      //   if (this.lastNote === note.name) {
      //     this.update(note)
      //   } else {
      //     this.lastNote = note.name
      //   }
      // }
    }

    // swal.fire('Welcome online tuner!').then(function () {
    this.tuner.init()
    this.frequencyData = new Uint8Array(this.tuner.analyser.frequencyBinCount)
    // })

    // this.$a4.addEventListener('click', function () {
    //   swal.fire({
    //     input: 'number',
    //     inputValue: self.a4,
    //   }).then(function ({ value: a4 }) {
    //     if (!parseInt(a4) || a4 === self.a4) {
    //       return
    //     }
    //     self.a4 = a4
    //     self.$a4.innerHTML = a4
    //     self.tuner.middleA = a4
    //     self.notes.createNotes()
    //     self.update({ name: 'A', frequency: self.a4, octave: 4, value: 69, cents: 0 })
    //     localStorage.setItem('a4', a4)
    //   })
    // })

    this.updateFrequencyBars()
  }

  updateFrequencyBars() {
    if (this.tuner.analyser) {
      // this.tuner.analyser.getByteFrequencyData(this.frequencyData)
      // this.frequencyBars.update(this.frequencyData)
    }
    // requestAnimationFrame(this.updateFrequencyBars.bind(this))
  }

  update(note) {
    // this.notes.update(note)
    // this.meter.update((note.cents / 50) * 45)
  }

  // noinspection JSUnusedGlobalSymbols
  toggleAutoMode() {
    // this.notes.toggleAutoMode()
  }
}

const app = new Application()
app.start()
