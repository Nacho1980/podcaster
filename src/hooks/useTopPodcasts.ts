import { useEffect, useState } from "react";
import { PodcastService } from "../service/PodcastService";
import { Podcast } from "../types/Podcast";

/**
 * useTopPodcasts hook
 *
 * A hook to fetch most popular podcasts
 */
const podcastService = new PodcastService();

// Hook to retrieve the top podcasts
export const useTopPodcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPodcasts = async () => {
      try {
        setLoading(true);
        const result = await podcastService.getListOfPodcasts();
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
