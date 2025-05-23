"use client";

import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onTranscription: (text: string) => void;
}

export const useVoiceRecognition = ({ onTranscription }: UseVoiceRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Essayer différents formats supportés par ordre de préférence
      let mediaRecorder;
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      
      let selectedType = 'audio/webm';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          console.log('Using audio type:', type);
          break;
        }
      }
      
      mediaRecorder = new MediaRecorder(stream, { mimeType: selectedType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio chunks:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          console.error('No audio chunks recorded');
          alert('Aucun audio enregistré. Veuillez réessayer.');
          setIsProcessing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        console.log('Created audio blob:', {
          size: audioBlob.size,
          type: audioBlob.type
        });
        
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Erreur lors de l\'accès au microphone. Veuillez vérifier les permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      console.log('Starting transcription...', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type
      });

      if (audioBlob.size === 0) {
        throw new Error('Audio blob is empty');
      }

      const formData = new FormData();
      // Déterminer le bon nom de fichier selon le type MIME
      let fileName = 'audio.wav';
      if (audioBlob.type.includes('webm')) {
        fileName = 'audio.webm';
      } else if (audioBlob.type.includes('mp4')) {
        fileName = 'audio.mp4';
      } else if (audioBlob.type.includes('ogg')) {
        fileName = 'audio.ogg';
      } else if (audioBlob.type.includes('m4a')) {
        fileName = 'audio.m4a';
      }
      
      console.log('Using filename:', fileName, 'for blob type:', audioBlob.type);
      formData.append('file', audioBlob, fileName);

      console.log('Sending request to /api/transcribe...');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result);
      
      if (result.text && result.text.trim()) {
        onTranscription(result.text);
      } else {
        throw new Error('No text was transcribed from the audio');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de la transcription: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};
