import Image from "next/image";
import { useEffect, useState } from "react";

export function VideoThumbnail({ url }: { url: string }) {
    const [duration, setDuration] = useState<string>("0:00");
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    useEffect(() => {
        const video = document.createElement("video");
        video.src = url;
        video.addEventListener("loadedmetadata", () => {
            const mins = Math.floor(video.duration / 60);
            const secs = Math.floor(video.duration % 60)
                .toString()
                .padStart(2, "0");
            setDuration(`${mins}:${secs}`);
        });

        // створюємо прев'ю кадру
        video.addEventListener("loadeddata", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL("image/jpeg"));
            }
        });
    }, [url]);

    return (
        <div className="relative w-full h-[140px] overflow-hidden">
            {thumbnail && (
                <Image
                    src={thumbnail}
                    alt="video thumbnail"
                    fill
                    className="object-cover"
                />
            )}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                {duration}
            </div>
        </div>
    );
}
