import { useEffect, useState } from "react";
import { PodcastService } from "../service/PodcastService";
import { Podcast } from "../types/Podcast";

/**
 * usePodcastDetails hook
 *
 * A hook to fetch most details for the selected podcast
 */

const podcastService = new PodcastService();

// Hook to retrieve podcast details
export const usePodcastDetails = (podcastId: string) => {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPodcastDetails = async () => {
      try {
        setLoading(true);
        const result = await podcastService.getPodcastDetails(podcastId);
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
