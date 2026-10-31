export function speak(text: string, lang: 'en' | 'hi' | 'mr', onStart: () => void, onEnd: () => void, onMissing: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return onMissing()
  const code = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }[lang]
  const run = () => { const voices = window.speechSynthesis.getVoices(); const voice = voices.find((item) => item.lang.toLowerCase().startsWith(code.toLowerCase())); if (!voice) return onMissing(); const utterance = new SpeechSynthesisUtterance(text); utterance.voice = voice; utterance.lang = code; utterance.rate = 0.9; utterance.onstart = onStart; utterance.onend = onEnd; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance) }
  if (window.speechSynthesis.getVoices().length) run(); else { window.speechSynthesis.addEventListener('voiceschanged', run, { once: true }); window.setTimeout(run, 500) }
}
export function stopSpeaking() { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel() }
