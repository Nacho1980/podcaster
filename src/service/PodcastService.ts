import {
  ALL_ORIGINS_PROXY,
  CACHE_EXPIRES_MS,
  PODCAST_DETAILS_LOCAL_STORAGE_KEY,
  PODCAST_DETAILS_URL,
  TOP_PODCASTS_LOCAL_STORAGE_KEY,
  TOP_PODCASTS_URL,
} from "../constants";
import { Episode } from "../types/Episode";
import { Podcast } from "../types/Podcast";
import { dateISOToDDMMYYYY, timeMillisToHHmmSS } from "../utils/DateTimeUtils";
import { getFirstTagContentFromUrl } from "../utils/RSSUtils";
import { PodcastServiceInterface } from "./PodcastServiceInterface";

/**
 * Implementation for the service that obtains the podcasts info
 */
export class PodcastService implements PodcastServiceInterface {
  /**
   * Retrieve the list of podcasts either from cache (if available) or from API
   * @returns list of podcasts
   */
  async getListOfPodcasts(): Promise<Podcast[]> {
    // Verify the existance of data in cache
    const cachedData = localStorage.getItem(TOP_PODCASTS_LOCAL_STORAGE_KEY);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();

      // Use data in cache if they are less than one day all
      if (now - timestamp < CACHE_EXPIRES_MS) {
        console.log("Using cached data");
        return data;
      }
      console.log("Cache expired, retrieving fresh data...");
    }

    // If no data or expired data in cache, fetch data in the endpoint
    try {
      // URL for Apple's most popular podcasts
      // Use allorigins proxy to avoid issues with CORS
      const response = await fetch(ALL_ORIGINS_PROXY + TOP_PODCASTS_URL);

      if (!response.ok) {
        throw new Error("Error in API response when fetching podcasts");
      }

      const responseData = await response.json();
      // Parse the nested JSON string
      //console.log(`Top podcasts: ${responseData.contents}`);
      const parsedData = JSON.parse(responseData.contents);
      const podcasts: Podcast[] = parsedData.feed.entry.map((pod: any) => {
        return {
          id: pod.id.attributes["im:id"],
          imageUrl: pod["im:image"][2].label, // Use the 170x170 image
          title: pod["im:name"].label,
          author: pod["im:artist"].label,
          description: pod.summary.label,
          episodes: [], // Episodes are not in this response, so initialize as empty array
        };
      });

      // Store in localStorage together with the timestamp
      const dataToCache = {
        data: podcasts,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(
        TOP_PODCASTS_LOCAL_STORAGE_KEY,
        JSON.stringify(dataToCache)
      );

      return podcasts;
    } catch (error) {
      console.error(
        "Error while trying to obtain podcasts from Apple endpoint:",
        error
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  // Retrieve the information fetched from the service and parse to episode objects
  parseEpisodes = (responseObj: any): Episode[] => {
    const episodes = [];

    // Skip the first result (index 0) as it's the podcast info
    for (let i = 1; i < responseObj.results.length; i++) {
      const episode = responseObj.results[i];
      const episodeDate = dateISOToDDMMYYYY(episode.releaseDate);

      episodes.push({
        id: episode.trackId,
        title: episode.trackName,
        date: episodeDate,
        duration: timeMillisToHHmmSS(episode.trackTimeMillis),
        description: episode.description,
        url: episode.episodeUrl,
      });
    }

    return episodes;
  };

  /**
   * Retrieves the details of a podcast
   * @param podcastId the Id of the podcast to get info from
   * @returns
   */
  async getPodcastDetails(podcastId: string): Promise<Podcast | null> {
    // Verify the existance of data in cache
    const cachedData = localStorage.getItem(
      PODCAST_DETAILS_LOCAL_STORAGE_KEY + podcastId
    );

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();

      // Use data in cache if they are less than one day all
      if (now - timestamp < CACHE_EXPIRES_MS) {
        console.log("Using cached data");
        return data;
      }
      console.log("Cache expired, retrieving fresh data...");
    }

    // If no data or expired data in cache, fetch data in the endpoint
    try {
      const url =
        //ALL_ORIGINS_PROXY + //Problematic with details
        //PROXY2 +
        PODCAST_DETAILS_URL.replace("{podcastId}", podcastId);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error fetching podcast details");
      }

      const responseData = await response.json();
      // Parse the nested JSON string
      const parsedData = JSON.parse(JSON.stringify(responseData));
      const podcastData = parsedData.results[0]; // Assuming the first result contains the podcast details

      const episodes: Episode[] = this.parseEpisodes(parsedData);

      const podcastDetails: Podcast = {
        id: podcastData.collectionId,
        title: podcastData.collectionName,
        author: podcastData.artistName,
        imageUrl: podcastData.artworkUrl600,
        episodes: episodes,
        description:
          (await getFirstTagContentFromUrl(
            podcastData.feedUrl,
            "description"
          )) ?? podcastData.collectionName,
      };

      // Store in localStorage together with the timestamp
      const dataToCache = {
        data: podcastDetails,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(
        PODCAST_DETAILS_LOCAL_STORAGE_KEY + podcastId,
        JSON.stringify(dataToCache)
      );

      return podcastDetails;
    } catch (error) {
      console.error("Error fetching podcast details:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }
}
