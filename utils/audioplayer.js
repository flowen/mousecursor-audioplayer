export default class Player {
  constructor() {
    if (!window.AudioContext) {
      if (window.webkitAudioContext) {
        window.AudioContext = window.webkitAudioContext
      } else {
        throw new Error('audio context not supported :(')
      }
    }

    this.context = null
    this.source = null

    this.totalTime = 0 // after we fetch the buffer we assign totalTime

    this.voiceBuffer = null // buffer containing the voiceclip

    this.audioMp3Url = require('../audio/voice.mp3')
    this.audioOGGUrl = require('../audio/voice.ogg')

    this.supportsOgg = this.supportsVideoType('ogg')
    this.fetchAudioBuffer = this.fetchAudioBuffer.bind(this)
  }

  // todo: somehow this always restarts after reaching 100
  get currentProgress() {
    if (this.totalTime === 0) return false

    const current = this.context.currentTime
    const percentage = (current / this.totalTime) * 100
    if (percentage > 0) {
      return percentage
    } else {
      return false
    }
  }

  get state() {
    return this.context !== null ? this.context.state : false
  }

  supportsVideoType(type) {
    let video
    const formats = {
      ogg: 'video/ogg; codecs="theora"',
    }

    if (!video) {
      video = document.createElement('video')
    }

    return video.canPlayType(formats[type] || type)
  }

  async fetchAudioBuffer() {
    this.context = new AudioContext()
    this.source = this.context.createBufferSource()

    const url = this.supportsOgg ? this.audioOGGUrl : this.audioMp3Url
    // error in safari
    await fetch(url)
      .then((response) => response.arrayBuffer())
      .then((audioData) => this.context.decodeAudioData(audioData))
      .then((audioBuffer) => (this.voiceBuffer = audioBuffer))
  }

  createBuffer() {
    this.source.onended = () => this.closeBuffer()
    this.source.buffer = this.voiceBuffer
    this.source.connect(this.context.destination)
    this.source.start()
  }

  closeBuffer() {
    this.context.close()
    this.voiceBuffer = null
  }

  async play() {
    // only for the first time, we fetch the buffer and start
    if (!this.voiceBuffer) {
      await this.fetchAudioBuffer()
      this.createBuffer()
      this.totalTime = this.source.buffer.duration

      return
    }

    if (this.context.state === 'running') {
      this.context.suspend()
    } else if (this.context.state === 'suspended') {
      this.context.resume()
    } else if (this.context.state === 'closed') {
      this.fetchAudioBuffer()
    }
  }
}
