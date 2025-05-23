import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Transcription API called');
    const formData = await request.formData();
    const audioFile = formData.get('file') as File;
    
    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('Audio file received:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    if (audioFile.size === 0) {
      console.error('Audio file is empty');
      return NextResponse.json({ error: 'Audio file is empty' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Créer un nouveau FormData pour l'API OpenAI
    const openAIFormData = new FormData();
    
    // Déterminer le bon nom de fichier selon le type MIME
    let fileName = 'audio.wav';
    if (audioFile.type.includes('webm')) {
      fileName = 'audio.webm';
    } else if (audioFile.type.includes('mp4')) {
      fileName = 'audio.mp4';
    } else if (audioFile.type.includes('ogg')) {
      fileName = 'audio.ogg';
    } else if (audioFile.type.includes('m4a')) {
      fileName = 'audio.m4a';
    }
    
    console.log('Using filename:', fileName, 'for type:', audioFile.type);
    
    // Utiliser directement le fichier original
    openAIFormData.append('file', audioFile, fileName);
    openAIFormData.append('model', 'whisper-1');
    openAIFormData.append('language', 'fr'); // Français par défaut

    console.log('Sending to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: openAIFormData,
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json(
        { error: `OpenAI API error: ${errorText}` }, 
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('OpenAI API result:', result);
    
    if (!result.text || result.text.trim() === '') {
      console.error('No text transcribed');
      return NextResponse.json(
        { error: 'No text was transcribed from the audio' }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ text: result.text });

  } catch (error) {
    console.error('Transcription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}
