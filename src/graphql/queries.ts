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
        videos {
          items {
            id
          }
        }
        image
      }
      nextToken
      total
    }
  }
`;

export const getSpeaker = /* GraphQL */ `
  query GetSpeaker($id: ID!) {
    getSpeaker(id: $id) {
      id
      name
      image
      videos(limit: 9999) {
        items {
          id
          video {
            publishedDate
            description
            audioURL
            YoutubeIdent
            id
            episodeTitle
            episodeNumber
            seriesTitle
            Youtube {
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
              contentDetails {
                videoId
              }
            }
          }
        }
      }
      hidden
      createdAt
      updatedAt
    }
  }
`;
export const tMHPersonByIsCoordinator = /* GraphQL */ `
  query TMHPersonByIsCoordinator(
    $isCoordinator: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTMHPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    TMHPersonByIsCoordinator(
      isCoordinator: $isCoordinator
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;

export const tMHPersonByIsStaff = /* GraphQL */ `
  query TMHPersonByIsStaff(
    $isStaff: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTMHPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    TMHPersonByIsStaff(
      isStaff: $isStaff
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const popularTeachingQuery = `query GetVideoByVideoType(
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
        episodeTitle
        episodeNumber
        seriesTitle
        series {
          id
        }
        publishedDate
        description
        length
        viewCount
        YoutubeIdent
        Youtube {
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
        }
        videoTypes
        notesURL
        videoURL
        audioURL
      }
      nextToken
    }
  }
  `;

export const getVideoByVideoType = `query GetVideoByVideoType(
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
        episodeTitle
        episodeNumber
        seriesTitle
        series {
          id
          title
        }
        speakers{
            items{
                speaker{
                    id
                }
            }
        }
        publishedDate
        description
        length
        viewCount
        YoutubeIdent
        Youtube {
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
        }
        videoTypes
        notesURL
        videoURL
        audioURL
      }
      nextToken
    }
  }
  `;

export const askQuestion = /* GraphQL */ `
  query AskQuestion($email: String, $body: String) {
    askQuestion(email: $email, body: $body) {
      err
      data
    }
  }
`;
export const allSermonsQuery = `query GetVideoByVideoType(
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
        episodeTitle
        episodeNumber
        seriesTitle
        series {
          id
        }
        publishedDate
        description
        length
        viewCount
        YoutubeIdent
        Youtube {
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
        }
        videoTypes
        notesURL
        videoURL
        audioURL
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
      bannerImage {
        src
        alt
      }
      babyHeroImage { 
        src
        alt
      }
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
          notesURL
          videoURL
          audioURL
          YoutubeIdent
          videoTypes
          Youtube {
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
              channelTitle
              localized {
                title
                description
              }
            }
          }
        }
        nextToken
      }
    }
  }
`;

export const getCommentsByOwner = /* GraphQL */ `
  query GetCommentsByOwner(
    $owner: String!
    $noteId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByOwner(
      owner: $owner
      noteId: $noteId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
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
    }
  }
`;

export const commentExistsQuery = /* GraphQL */ `
  query GetCommentsByOwner(
    $owner: String!
    $noteId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByOwner(
      owner: $owner
      noteId: $noteId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
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
    listSpeakers(filter: $filter, limit: $limit) {
      items {
        id
        name
        image
        videos (limit: 9999, sortDirection:DESC, nextToken: $nextToken) {
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

export const getTagsByOwner = /* GraphQL */ `
  query GetCommentsByOwner(
    $owner: String!
    $noteId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByOwner(
      owner: $owner
      noteId: $noteId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        tags
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
