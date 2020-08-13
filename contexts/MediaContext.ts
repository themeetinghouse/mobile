import { Audio, AVPlaybackStatus } from 'expo-av';
import { createContext } from 'react';

export type MediaData = {
    type: 'video' | 'audio' | 'none';
    audio: { sound: Audio.Sound, status: AVPlaybackStatus } | null;
    video: { id: string, time: number, imageUri: string } | null;
}

type MediaContextType = {
    media: MediaData;
    setMedia: (data: MediaData) => void;
}

const MediaContext = createContext<MediaContextType>({ media: { type: 'none', audio: null, video: null }, setMedia: () => null });
export default MediaContext