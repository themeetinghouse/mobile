import { Audio, AVPlaybackStatus } from 'expo-av';
import { createContext } from 'react';

export type MediaData = {
    playerType: 'none' | 'audio' | 'video' | 'mini audio' | 'mini video';
    audio: { sound: Audio.Sound, status: AVPlaybackStatus } | null;
    video: { id: string, time: number } | null;
    playing: boolean;
    episode: string;
    series: string;
}

type MediaContextType = {
    media: MediaData;
    setMedia: (data: MediaData) => void;
}

const MediaContext = createContext<MediaContextType>(
    { media: { 
        playerType: 'none', 
        playing: false, 
        audio: null, 
        video: null, 
        episode: '', 
        series: '' 
    }, 
    setMedia: () => null 
});
export default MediaContext