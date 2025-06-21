import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ url, isPlaying, onTogglePlay, styles }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);
    
    useEffect(() => {
        const audioEl = audioRef.current;
        const handleEnded = () => onTogglePlay();
        audioEl?.addEventListener('ended', handleEnded);
        return () => audioEl?.removeEventListener('ended', handleEnded);
    }, [onTogglePlay]);

    return (
        <div className={styles.audioPlayer}>
            <audio ref={audioRef} src={url} preload="metadata" />
            <button onClick={onTogglePlay} className={styles.playButton}>
                {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
            </button>
        </div>
    )
};

export default AudioPlayer; 