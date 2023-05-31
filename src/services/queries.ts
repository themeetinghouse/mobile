export const searchComments = /* GraphQL */ `
  query SearchComments(
    $filter: SearchableCommentFilterInput
    $sort: [SearchableCommentSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableCommentAggregationInput]
  ) {
    searchComments(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        comment
        tags
        noteType
        commentType
        noteId
        textSnippet
        imageUri
        key
        date
        time
        owner
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;

export const listTMHLocations = /* GraphQL */ `
  query ListTMHLocations(
    $filter: ModelTMHLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTMHLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        regionShortName
        homeChurchGroupID
        abbreviation
        region
        contact {
          name
          email
          phone
          extension
        }
        meetings {
          date
          startTime
          endTime
          name
          description
          frequency
          location {
            name
            latitude
            longitude
            address1
            address2
            city
            state
            zip
            country
            url
          }
        }
        youth {
          name
          description
          age
          location {
            name
            latitude
            longitude
            address1
            address2
            city
            state
            zip
            country
            url
          }
          time
          facebookLink
          instagramLink
          contact {
            name
            email
            phone
            extension
          }
        }
        socials {
          facebook {
            name
            pageId
            link
          }
          instagram {
            name
            username
            pageId
            link
          }
          discord
          twitter
        }
        location {
          name
          latitude
          longitude
          address1
          address2
          city
          state
          zip
          country
          url
        }
        pastors {
          id
          email
          firstName
          lastName
          image
          phone
          extension
          sites
          position
          isTeacher
          isStaff
          isCoordinator
          isOverseer
          createdAt
          updatedAt
        }
        pastorEmail
        staff {
          id
          email
          firstName
          lastName
          image
          phone
          extension
          sites
          position
          isTeacher
          isStaff
          isCoordinator
          isOverseer
          createdAt
          updatedAt
        }
        showInLocationMap
        showInLocationList
        locationType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const searchNotes = /* GraphQL */ `
  query SearchNotes(
    $filter: SearchableNotesFilterInput
    $sort: [SearchableNotesSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableNotesAggregationInput]
  ) {
    searchNotes(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        title
        content
        questions
        jsonContent
        jsonQuestions
        episodeDescription
        episodeNumber
        seriesId
        series {
          id
          seriesType
          title
          description
          thumbnailDescription
          image
          startDate
          endDate
          createdAt
          updatedAt
        }
        pdf
        topics
        tags
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
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
    $seriesType: String!, 
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
        babyHeroImage { 
          src
          alt
        }
        bannerImage { 
          src
          alt
        }
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
      babyHeroImage { 
        src
        alt
      }
      bannerImage { 
        src
        alt
      }
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

export const listHomeChurchInfos = /* GraphQL */ `
  query ListHomeChurchInfos(
    $filter: ModelHomeChurchInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHomeChurchInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        elders
        customPills
        vaccinationRequired
        isOnline
        isYoungAdult
        isFamilyFriendly
        isHybrid
        onlineConnectUrl
        ageGroups
        petFree
        transitAccessible
        accessCode
        gender
        extendedDescription
        imageUrl
        imageAlt
        videoUrl
        createdAt
        updatedAt
        owner
      }
      nextToken
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
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        content
        questions
        pdf
        jsonContent
        jsonQuestions
        episodeDescription
        episodeNumber
        seriesId
      }
      nextToken
    }
  }
`;

export const searchVideos = /* GraphQL */ `
  query SearchVideos(
    $filter: SearchableVideoFilterInput
    $sort: [SearchableVideoSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableVideoAggregationInput]
  ) {
    searchVideos(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
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
        thumbnailDescription
        move
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const searchSeries = /* GraphQL */ `
  query SearchSeries(
    $filter: SearchableSeriesFilterInput
    $sort: [SearchableSeriesSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableSeriesAggregationInput]
  ) {
    searchSeries(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        seriesType
        title
        description
        image
      }
      nextToken
      total
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
        externalEventUrl
        eventTitle
        homepageLink
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
    $videoTypes: String!
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
      nextToken
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
