import { useRef, useState } from "react";

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) chunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
    };

    return {
        isRecording,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
        resetRecording,
    };
}
