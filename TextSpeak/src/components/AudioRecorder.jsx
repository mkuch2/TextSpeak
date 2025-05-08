// src/components/AudioRecorder.jsx
import { useState } from 'react';

function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        onRecordingComplete(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-2">
      {!isRecording ? (
        <button
          type="button"
          onClick={startRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>
      ) : (
        <button
          type="button"
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      )}
      {audioBlob && (
        <div className="mt-2">
          <audio src={URL.createObjectURL(audioBlob)} controls />
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;