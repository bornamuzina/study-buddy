let kontekst = null

function dohvatiKontekst() {
  if (!kontekst) kontekst = new AudioContext()
  if (kontekst.state === 'suspended') kontekst.resume()
  return kontekst
}

export function pripremiZvuk() {
  dohvatiKontekst()
}

export function zvukKraja(visina = 880) {
  const audio = dohvatiKontekst()
  const pocetak = audio.currentTime
  ;[0, 0.28].forEach((pomak) => {
    const oscilator = audio.createOscillator()
    const glasnoca = audio.createGain()
    oscilator.frequency.value = visina
    glasnoca.gain.setValueAtTime(0.0001, pocetak + pomak)
    glasnoca.gain.exponentialRampToValueAtTime(0.25, pocetak + pomak + 0.02)
    glasnoca.gain.exponentialRampToValueAtTime(0.0001, pocetak + pomak + 0.22)
    oscilator.connect(glasnoca).connect(audio.destination)
    oscilator.start(pocetak + pomak)
    oscilator.stop(pocetak + pomak + 0.24)
  })
}
