"use client";

import { useRef, useState, useEffect } from "react";
import {
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const videos = [
  {
    id: 1,
    title: "Isadora Pompeo",
    artist: "Youtube",
    src: "/assets/video.mp4", 
    thumbnail: "/assets/is.avif",
  },
  {
    id: 2,
    title: "Pássaros Cantando",
    artist: "Sons da Natureza",
    src: "/assets/video1.mp4",
    thumbnail: "/assets/ps.jpg", 
  },
  {
    id: 3,
    title: "Ondas do Oceano",
    artist: "Relaxamento",
    src: "/assets/video2.mp4",
    thumbnail: "/assets/oc.jpeg",
  },
];

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setCurrentTime(video.currentTime);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handlePlay = () => {
        setPlaying(true);
      };

      const handlePause = () => {
        setPlaying(false);
      };

      const handleVolumeChange = () => {
        setVolume(video.volume);
        setMuted(video.muted);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("volumechange", handleVolumeChange);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("volumechange", handleVolumeChange);
      };
    }
  }, [currentVideo]); 

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(time, duration));
    video.currentTime = newTime;
  };

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (muted) {
      video.volume = prevVolume;
      video.muted = false;
    } else {
      setPrevVolume(video.volume);
      video.muted = true;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVideoSelect = (video: typeof videos[0]) => {
    setCurrentVideo(video);
    setPlaying(false); 
    if (videoRef.current) {
      videoRef.current.load(); 
      videoRef.current.play(); 
    }
  };

  return (
    <div className="w-full h-screen bg-[#222222] flex justify-center items-start p-4 space-x-4">
      <div className="w-[40vw] max-w-lg bg-[#2A313C] rounded-xl shadow-lg flex flex-col p-4">
        <div
          className="w-full relative rounded-lg overflow-hidden mb-2"
          style={{ paddingTop: "56.25%" }}
        >
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={currentVideo.src} 
            loop
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-md text-white text-xs z-10 font-bold">
            TikTok
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-white text-2xl font-bold">{currentVideo.title}</h2>
          <p className="text-gray-400 text-lg">{currentVideo.artist}</p>
        </div>

        <div className="w-full flex items-center space-x-2 mb-4">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <span className="text-white text-sm">
            {playing && duration > 0
              ? `-${formatTime(Math.max(0, duration - currentTime))}`
              : formatTime(duration)}
          </span>
        </div>

        <div className="w-full flex justify-around items-center mb-4">
          <button
            onClick={() => configCurrentTime(currentTime - 10)}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-2"
            aria-label="Voltar 10 segundos"
          >
            <FaBackward />
          </button>

          <button
            onClick={playPause}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform duration-150"
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          >
            {playing ? (
              <FaPause className="text-red-500 text-3xl" />
            ) : (
              <FaPlay className="text-red-500 text-3xl" />
            )}
          </button>

          <button
            onClick={() => configCurrentTime(currentTime + 10)}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-2"
            aria-label="Avançar 10 segundos"
          >
            <FaForward />
          </button>
        </div>
        <div className="w-full flex items-center space-x-2 mb-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-2"
            aria-label={muted ? "Desmutar" : "Mutar"}
          >
            {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      <div className="w-[25vw] max-w-sm bg-[#2A313C] rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto max-h-[80vh]">
        <h3 className="text-white text-xl font-bold mb-4">Lista de Vídeos</h3>
        {videos.map((video) => (
          <div
            key={video.id}
            className={`flex items-center space-x-4 p-3 mb-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              currentVideo.id === video.id ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => handleVideoSelect(video)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <p className="text-white font-semibold">{video.title}</p>
              <p className="text-gray-400 text-sm">{video.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}