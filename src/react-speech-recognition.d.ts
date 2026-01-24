declare module 'react-speech-recognition' {
  export function useSpeechRecognition(): {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  };

  const SpeechRecognition: {
    startListening: (options?: any) => Promise<void>;
    stopListening: () => void;
    abortListening: () => void;
    getRecognition: () => any;
  };

  export default SpeechRecognition;
}
