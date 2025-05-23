"use client";

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVoiceRecognition } from '@/hooks/use-voice-recognition';

interface VoiceRecognitionButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
}

export const VoiceRecognitionButton: React.FC<VoiceRecognitionButtonProps> = ({
  onTranscription,
  className = '',
}) => {
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecognition({
    onTranscription,
  });

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-medium hidden sm:inline">Envoi...</span>
        </>
      );
    }

    if (isRecording) {
      return (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <MicOff className="w-4 h-4" />
          </motion.div>
          <span className="text-xs font-medium hidden sm:inline">Stop</span>
        </>
      );
    }

    return (
      <>
        <Mic className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">🎤</span>
      </>
    );
  };

  const getButtonStyles = () => {
    if (isProcessing) {
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    }
    
    if (isRecording) {
      return "bg-red-500 hover:bg-red-600 text-white animate-pulse";
    }

    return "bg-blue-500 hover:bg-blue-600 text-white";
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isProcessing}
      className={`
        flex items-center gap-1 px-3 py-2 rounded-full font-medium
        transition-all duration-200 shadow-lg border-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getButtonStyles()}
        ${className}
      `}
      title={
        isProcessing 
          ? "Transcription et envoi en cours..." 
          : isRecording 
          ? "Cliquez pour arrêter et envoyer le message vocal" 
          : "Cliquez pour enregistrer et envoyer un message vocal"
      }
    >
      {getButtonContent()}
    </motion.button>
  );
};
