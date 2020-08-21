import { Audio, AVPlaybackStatus } from 'expo-av';
import { createContext } from 'react';

export type MediaData = {
    playerType: 'none' | 'audio' | 'video' | 'mini audio' | 'mini video';
    audio: { sound: Audio.Sound, status: AVPlaybackStatus } | null;
    video: string | null;
    videoTime: number;
    playing: boolean;
    episode: string;
    series: string;
}

type MediaContextType = {
    media: MediaData;
    setMedia: (data: MediaData) => void;
    setVideoTime: (time: number) => void;
    closeAudio: () => void;
    setAudioNull: () => void;
}

const MediaContext = createContext<MediaContextType>(
    {
        media: {
            playerType: 'none',
            playing: false,
            audio: null,
            video: null,
            videoTime: 0,
            episode: '',
            series: ''
        },
        setMedia: () => null,
        setVideoTime: () => null,
        closeAudio: () => null,
        setAudioNull: () => null
    });
export default MediaContext