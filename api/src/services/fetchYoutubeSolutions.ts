import axios from 'axios'
import { YOUTUBE_API_KEY } from '../constants'

const CHANNEL_ID = 'UCqL-fzHtN3NQPbYqGymMbTA' //TLE ELIMANATORS channel

interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  url: string
}

export default async function fetchYouTubeSolutions() {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          channelId: CHANNEL_ID,
          maxResults: 50,
          order: 'date',
          type: 'video',
          key: YOUTUBE_API_KEY,
        },
      }
    )

    const youtube_items = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))
    console.log(youtube_items)
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error)
    return []
  }
}
