import React, { useRef, useState, useEffect } from 'react';
import { Mic, MicOff, Power } from 'lucide-react';

const AIAssistant = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Initialize speech recognition
  const recognition = 'webkitSpeechRecognition' in window
    ? new (window as any).webkitSpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };
  }

  // Initialize webcam
  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing webcam:", err));
    }
  }, [isActive]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Holographic overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/20 to-transparent" />
      </div>

      {/* UI Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="p-4 rounded-full bg-blue-500/80 hover:bg-blue-600/80 text-white transition-all"
        >
          <Power className="w-6 h-6" />
        </button>
        
        {isActive && (
          <button
            onClick={toggleListening}
            className={`p-4 rounded-full ${
              isListening ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-blue-500/80 hover:bg-blue-600/80'
            } text-white transition-all`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 max-w-2xl w-full">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-blue-500/50">
            <p className="text-blue-400 font-mono">{transcript}</p>
          </div>
        </div>
      )}

      {/* Holographic Circle Animation */}
      {isActive && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-48 h-48 rounded-full border-2 border-blue-500/50 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-blue-400/40 animate-ping" />
        </div>
      )}
    </div>
  );
};

export default AIAssistant;