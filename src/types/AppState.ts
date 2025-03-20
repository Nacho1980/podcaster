import { Episode } from "./Episode";
import { Podcast } from "./Podcast";

/**
 * The state of the app to be managed in Redux
 */
export type AppState = {
  selectedPodcast: Podcast | null;
  selectedEpisode: Episode | null;
  filterText: string;
  isLoading: boolean;
};
