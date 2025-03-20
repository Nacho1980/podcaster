import { useEffect, useState } from "react";
import {
  ALL_ORIGINS_PROXY,
  CACHE_EXPIRES_MS,
  TOP_PODCASTS_LOCAL_STORAGE_KEY,
  TOP_PODCASTS_URL,
} from "../constants";
import { Podcast } from "../types/Podcast";

/**
 * useTopPodcasts hook
 *
 * A hook to fetch most popular podcasts
 */
const fetchTopPodcasts = async (): Promise<Podcast[]> => {
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
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Hook to retrieve the top podcasts
export const useTopPodcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPodcasts = async () => {
      try {
        setLoading(true);
        const result = await fetchTopPodcasts();
        setPodcasts(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    getPodcasts();
  }, []);

  return { podcasts, loading, error };
};
