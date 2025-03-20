import { useEffect, useState } from "react";
import {
  ALL_ORIGINS_PROXY,
  CACHE_EXPIRES_MS,
  PODCAST_DETAILS_LOCAL_STORAGE_KEY,
  PODCAST_DETAILS_URL,
} from "../constants";
import { Episode } from "../types/Episode";
import { Podcast } from "../types/Podcast";
import { dateISOToDDMMYYYY, timeMillisToHHmmSS } from "../utils/DateTimeUtils";
import { getFirstTagContentFromUrl } from "../utils/RSSUtils";

const parseEpisodes = (responseObj: any): Episode[] => {
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
 * usePodcastDetails hook
 *
 * A hook to fetch most details for the selected podcast
 */
const fetchPodcastDetails = async (podcastId: string): Promise<Podcast> => {
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
      ALL_ORIGINS_PROXY +
      +PODCAST_DETAILS_URL.replace("{podcastId}", podcastId);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error fetching podcast details");
    }

    const responseData = await response.json();
    // Parse the nested JSON string
    const parsedData = JSON.parse(JSON.stringify(responseData));
    const podcastData = parsedData.results[0]; // Assuming the first result contains the podcast details

    const episodes: Episode[] = parseEpisodes(parsedData);

    const podcastDetails: Podcast = {
      id: podcastData.collectionId,
      title: podcastData.collectionName,
      author: podcastData.artistName,
      imageUrl: podcastData.artworkUrl600,
      episodes: episodes,
      description:
        (await getFirstTagContentFromUrl(podcastData.feedUrl, "description")) ??
        podcastData.collectionName,
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
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Hook to retrieve podcast details
export const usePodcastDetails = (podcastId: string) => {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPodcastDetails = async () => {
      try {
        setLoading(true);
        const result = await fetchPodcastDetails(podcastId);
        setPodcast(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (podcastId) {
      getPodcastDetails();
    }
  }, [podcastId]);

  return { podcast, loading, error };
};
