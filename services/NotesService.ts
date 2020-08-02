//import axios from 'axios';
import { get } from './ApiService';

export default class NotesService {

  static loadNotes = async (sermonId: string) => {
    const response = await get("https://takenoteapp.com/takenote/api/v1/notes?user=-1&publicOnly=0&seriesId=1583071444753&sermonId=1583071464964&noteType=sermon");
    return { notes: response.sermonNotes, verses: response.sermonVerses };
  }

  static loadQuestions = async (sermonId: string) => {
    const response = await get("https://takenoteapp.com/takenote/api/v1/notes?user=-1&publicOnly=0&seriesId=1583071444753&sermonId=1583071464964&noteType=homeChurch");
    return { notes: response.homeChurchNotes, verses: response.homeChurchVerses };
  }

}
