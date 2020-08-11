import { createContext } from 'react';

export type Media = any

type TeachingContext = {
    media: Media;
    setMedia: (data: Media) => void;
} | null

const TeachingContext = createContext<TeachingContext>({ media: null, setMedia: () => null });
export default TeachingContext