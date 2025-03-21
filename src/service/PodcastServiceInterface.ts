import { Podcast } from "../types/Podcast";

/**
 * Interface for the service that obtains the podcasts info
 */
export interface PodcastServiceInterface {
  getListOfPodcasts(): Promise<Podcast[]>;
  getPodcastDetails(podcastId: string): Promise<Podcast | null>;
}
