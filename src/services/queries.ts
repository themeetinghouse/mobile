export const listAnnouncements = /* GraphQL */ `
  query ListAnnouncements(
    $filter: ModelAnnouncementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        publishedDate
        expirationDate
        image
        parish
        crossRegional
        title
        description
        callToAction
        callToActionTitle
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getSeriesBySeriesType = `
  query getSeriesBySeriesType(
    $seriesType: String, 
    $startDate: ModelStringKeyConditionInput, 
    $sortDirection: ModelSortDirection, 
    $filter: ModelSeriesFilterInput, 
    $limit: Int, 
    $nextToken: String
  ) {
    getSeriesBySeriesType(seriesType: $seriesType, startDate: $startDate, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        seriesType
        title
        description
        image
        startDate
        endDate
        videos {
          items {
            id
            episodeTitle
            episodeNumber
            seriesTitle
            series {
              id
            }
            publishedDate
            description
            length
            YoutubeIdent
            videoTypes
            notesURL
            videoURL
            audioURL
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getSeries = `
  query GetSeries($id: ID!) {
    getSeries(id: $id) {
      id
      seriesType
      title
      description
      image
      startDate
      endDate
      videos {
        items {
          id
          episodeTitle
          episodeNumber
          seriesTitle
          series {
            id
          }
          publishedDate
          description
          length
          YoutubeIdent
          Youtube {
            snippet {
              thumbnails {
                high {
                  url
                }
                standard {
                  url
                }
                maxres {
                  url
                }
              }
            }
          }
          videoTypes
          notesURL
          videoURL
          audioURL
        }
        nextToken
      }
    }
  }
`;

export const getSeriesEpisodeCount = `
  query GetSeries($id: ID!) {
    getSeries(id: $id) {
      id
      videos {
        items {
          id
        }
        nextToken
      }
    }
  }
`;
export const listCustomPlaylistsForRandom = /* GraphQL */ `
  query ListCustomPlaylists(
    $filter: ModelCustomPlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        videos {
          items {
            id
          }
        }
      }
      nextToken
    }
  }
`;

export const listCustomPlaylists = /* GraphQL */ `
  query ListCustomPlaylists(
    $filter: ModelCustomPlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        seriesType
        title
        description
        thumbnailDescription
        createdAt
        updatedAt
        videos {
          items {
            id
            videoID
            customPlaylistID
            customPlaylist {
              id
              seriesType
              title
              thumbnailDescription
              videos {
                items {
                  id
                  videoID
                  customPlaylistID
                }
                nextToken
              }
            }
            video {
              id
              createdBy
              createdDate
              episodeTitle
              originalEpisodeTitle
              episodeNumber
              seriesTitle
              customPlaylistIDs
              publishedDate
              recordedDate
              description
              viewCount
              length
              YoutubeIdent
              videoTypes
              notesURL
              videoURL
              audioURL
              thumbnailDescription
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getCustomPlaylist = /* GraphQL */ `
  query GetCustomPlaylist($id: ID!) {
    getCustomPlaylist(id: $id) {
      id
      seriesType
      title
      description
      videos {
        items {
          id
          video {
            id
            episodeTitle
            originalEpisodeTitle
            episodeNumber
            seriesTitle
            publishedDate
            description
            Youtube {
              snippet {
                thumbnails {
                  high {
                    url
                  }
                  standard {
                    url
                  }
                  maxres {
                    url
                  }
                }
              }
            }
            videoURL
            audioURL
          }
        }
        nextToken
      }
    }
  }
`;

export const getFbEvents = `
  query GetFbEvents($pageId: String) {
    getFBEvents(pageId: $pageId) {
      data {
        description
        end_time
        name
        is_online
        cover{
          id
          offset_x
          offset_y
          source
        }
        ticket_uri
        online_event_format
        online_event_third_party_url
        place {
          name
          location {
            city
            country
            latitude
            longitude
            state
            street
            zip
          }
          id
        }
        start_time
        id
        event_times {
          start_time
          end_time
          id
          ticket_uri
        }
      }
      paging {
        cursors {
          before
          after
        }
      }
    }
  }
  `;

export const getInstagramByLocation = /* GraphQL */ `
  query GetInstagramByLocation(
    $locationId: String
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInstagramFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getInstagramByLocation(
      locationId: $locationId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        locationId
        thumbnails {
          src
          config_width
          config_height
        }
        altText
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listLivestreams = /* GraphQL */ `
  query ListLivestreams(
    $filter: ModelLivestreamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestreams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        startTime
        videoStartTime
        endTime
        prerollYoutubeId
        liveYoutubeId
      }
      nextToken
    }
  }
`;

export const checkIfNotesExistQuery = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
    }
  }
`;

export const getNotesNoContentCustom = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      title
      episodeNumber
      seriesId
    }
  }
`;

export const getNotesNoContent = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      title
      episodeDescription
      episodeNumber
      seriesId
      pdf
      topics
      tags
      createdAt
      updatedAt
    }
  }
`;

export const getNotes = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      title
      content
      questions
      jsonContent
      jsonQuestions
      episodeDescription
      episodeNumber
      seriesId
      pdf
      topics
      tags
      createdAt
      updatedAt
      verses {
        items {
          id
          key
          offset
          length
          dataType
          content
          youVersionUri
          noteId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;

export const getVideoByVideoType = /* GraphQL */ `
  query GetVideoByVideoType(
    $videoTypes: String
    $publishedDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVideoByVideoType(
      videoTypes: $videoTypes
      publishedDate: $publishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdBy
        createdDate
        episodeTitle
        originalEpisodeTitle
        episodeNumber
        seriesTitle
        publishedDate
        recordedDate
        description
        closedCaptioning
        referencedMedia
        campaigns
        bibleVerses
        topics
        qandeh
        length
        YoutubeIdent
        Youtube {
          id
          kind
          etag
          snippet {
            publishedAt
            channelId
            title
            description
            thumbnails {
              default {
                url
                width
                height
              }
              medium {
                url
                width
                height
              }
              high {
                url
                width
                height
              }
              standard {
                url
                width
                height
              }
              maxres {
                url
                width
                height
              }
            }
            channelTitle
            localized {
              title
              description
            }
          }
          contentDetails {
            videoId
            videoPublishedAt
            duration
            dimension
            definition
            caption
            licensedContent
            projection
          }
          status {
            uploadStatus
            privacyStatus
            license
            embeddable
            publicStatsViewable
          }
        }
        videoTypes
        notesURL
        videoURL
        audioURL
        speakers {
          items {
            id
            speaker {
              id
              name
              image
              videos {
                items {
                  id
                }
                nextToken
              }
            }
          }
          nextToken
        }
        series {
          id
          seriesType
          title
          description
          image
          startDate
          endDate
        }
      }
      nextToken
    }
  }
`;

export const listF1ListGroup2s = /* GraphQL */ `
  query ListF1ListGroup2s(
    $filter: ModelF1ListGroup2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    listF1ListGroup2s(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        startDate
        timeZone {
          name
          id
        }
        groupType {
          id
          name
        }
        location {
          id
          name
          description
          isOnline
          url
          address {
            address1
            address2
            address3
            city
            postalCode
            latitude
            longitude
          }
          createdDate
          lastUpdatedDate
        }
        schedule {
          id
          name
          description
          startTime
          endTime
          numberRecurrences
          startDate
          endDate
          recurrenceType {
            name
          }
          recurrences {
            recurrence {
              recurrenceWeekly {
                recurrenceFrequency
                occurOnSunday
                occurOnMonday
                occurOnTuesday
                occurOnWednesday
                occurOnThursday
                occurOnFriday
                occurOnSaturday
              }
              recurrenceMonthly {
                recurrenceFrequency
                recurrenceOffset
                monthDay
                monthWeekDay
              }
            }
          }
        }
      }
    }
  }
`;

export const listSpeakersNoVideos = `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        hidden
        image
      }
      nextToken
    }
  }
  `;

export const listSpeakersQuery = `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        hidden
        image
        videos (limit:1000){
          items {
            id
            video{
              publishedDate
              description
              audioURL
              YoutubeIdent
              id
              episodeTitle
              episodeNumber
              seriesTitle
              Youtube{
                snippet {
                  thumbnails {
                    default {
                      url
                    }
                    medium {
                      url
                    }
                    high {
                      url
                    }
                    standard {
                      url
                    }
                    maxres {
                      url
                    }
                  }
                }
                contentDetails{
                  videoId
                }
              }
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
  `;

export const getInstaPhotos = /* GraphQL */ `
  query GetInstaPhotos($pageId: String) {
    getInstaPhotos(pageId: $pageId) {
      data {
        id
        media_url
        caption
        comments_count
        like_count
        media_type
        thumbnail_url
        timestamp
        permalink
        shortcode
      }
      paging {
        cursors {
          before
          after
        }
      }
    }
  }
`;
