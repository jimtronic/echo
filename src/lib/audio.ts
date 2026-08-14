import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AudioState = 'checking' | 'file' | 'speech' | 'unavailable'

export function useLessonAudio(audioPath: string, hiddenSentence: string, language: string, speed: number) {
  const baseLanguage = language.split('-')[0].toLowerCase()
  const audio = useMemo(() => new Audio(audioPath), [audioPath])
  const [state, setState] = useState<AudioState>('checking')
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState(() => localStorage.getItem(`echo-voice-${language}`) ?? '')
  const mounted = useRef(true)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith(baseLanguage)))
    updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices)
  }, [baseLanguage])

  const setSelectedVoice = useCallback((voiceURI: string) => {
    setSelectedVoiceState(voiceURI)
    if (voiceURI) localStorage.setItem(`echo-voice-${language}`, voiceURI)
    else localStorage.removeItem(`echo-voice-${language}`)
  }, [language])

  useEffect(() => {
    mounted.current = true
    const ready = () => mounted.current && setState('file')
    const failed = () => mounted.current && setState('speechSynthesis' in window ? 'speech' : 'unavailable')
    const playing = () => mounted.current && setPlaybackState('playing')
    const paused = () => mounted.current && !audio.ended && setPlaybackState('paused')
    const ended = () => mounted.current && setPlaybackState('idle')
    audio.preload = 'metadata'
    audio.addEventListener('canplaythrough', ready)
    audio.addEventListener('error', failed)
    audio.addEventListener('play', playing)
    audio.addEventListener('pause', paused)
    audio.addEventListener('ended', ended)
    audio.load()
    return () => {
      mounted.current = false
      audio.pause()
      audio.removeEventListener('canplaythrough', ready)
      audio.removeEventListener('error', failed)
      audio.removeEventListener('play', playing)
      audio.removeEventListener('pause', paused)
      audio.removeEventListener('ended', ended)
      window.speechSynthesis?.cancel()
    }
  }, [audio])

  const play = useCallback(async () => {
    if (state === 'file') {
      audio.currentTime = 0
      audio.playbackRate = speed
      await audio.play()
      return
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(hiddenSentence)
      const preferredLocale = language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : language
      utterance.lang = preferredLocale
      utterance.rate = speed
      utterance.onstart = () => mounted.current && setPlaybackState('playing')
      utterance.onend = () => mounted.current && setPlaybackState('idle')
      utterance.onerror = () => mounted.current && setPlaybackState('idle')
      const browserVoices = window.speechSynthesis.getVoices()
      utterance.voice = browserVoices.find((voice) => voice.voiceURI === selectedVoice)
        ?? browserVoices.find((voice) => voice.lang.toLowerCase() === preferredLocale.toLowerCase())
        ?? browserVoices.find((voice) => voice.lang.toLowerCase().startsWith(baseLanguage))
        ?? null
      if (browserVoices.length > 0 && !utterance.voice && !browserVoices.some((voice) => voice.lang.toLowerCase().startsWith(baseLanguage))) {
        setState('unavailable')
        return
      }
      window.speechSynthesis.speak(utterance)
      setState('speech')
    }
  }, [audio, baseLanguage, hiddenSentence, language, selectedVoice, speed, state])

  const togglePause = useCallback(async () => {
    if (playbackState === 'playing') {
      if (state === 'file') audio.pause()
      else window.speechSynthesis.pause()
      setPlaybackState('paused')
      return
    }
    if (playbackState === 'paused') {
      if (state === 'file') await audio.play()
      else window.speechSynthesis.resume()
      setPlaybackState('playing')
    }
  }, [audio, playbackState, state])

  return { play, togglePause, state, playbackState, voices, selectedVoice, setSelectedVoice }
}
