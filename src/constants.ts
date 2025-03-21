export const ALL_ORIGINS_PROXY = "https://api.allorigins.win/get?url="; //problematic with podcast details
export const PROXY2 = "https://thingproxy.freeboard.io/fetch/"; //used for podcast details
export const TOP_PODCASTS_URL =
  "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";
export const PODCAST_DETAILS_URL =
  "https://itunes.apple.com/lookup?id={podcastId}&media=podcast&entity=podcastEpisode&limit=20";
export const TOP_PODCASTS_LOCAL_STORAGE_KEY = "topPodcasts";
export const PODCAST_DETAILS_LOCAL_STORAGE_KEY = "topPodcasts";
export const CACHE_EXPIRES_MS = 24 * 60 * 60 * 1000; //1 day in millisecs
