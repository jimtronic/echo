import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AudioState = 'checking' | 'file' | 'speech' | 'unavailable'

export function useLessonAudio(audioPath: string, hiddenSentence: string, language: string, speed: number) {
  const audio = useMemo(() => new Audio(audioPath), [audioPath])
  const [state, setState] = useState<AudioState>('checking')
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const mounted = useRef(true)

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
      const voices = window.speechSynthesis.getVoices()
      utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === preferredLocale.toLowerCase())
        ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(language))
        ?? null
      if (voices.length > 0 && !utterance.voice && !voices.some((voice) => voice.lang.toLowerCase().startsWith(language))) {
        setState('unavailable')
        return
      }
      window.speechSynthesis.speak(utterance)
      setState('speech')
    }
  }, [audio, hiddenSentence, language, speed, state])

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

  return { play, togglePause, state, playbackState }
}
