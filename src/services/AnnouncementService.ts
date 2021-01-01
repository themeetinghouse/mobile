//import axios from 'axios';

export interface Announcement {
  id: string;
  title: string;
  description: string;
}

export default class AnnouncementService {
  static loadAnnouncements = async (): Promise<Announcement[]> => {
    return [
      {
        id: 'announcement1',
        title: 'November Weekly Outreach',
        description:
          "We'll be meeting weekly on Thursday evenings at the clock downtown Oakville @ 5:30 pm for community outreach",
      },
      {
        id: 'announcement2',
        title: '21 Day New Year Corporate Fast',
        description:
          "We're going to kick off 2020 with some intentional time to seek the Lord.  What you fast is up to you.  We'll be talking more about it in the coming weeks.",
      },
    ];
  };
}
