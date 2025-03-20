import { useSelector } from "react-redux";
import EpisodePlayer from "../components/EpisodePlayer/EpisodePlayer";
import Header from "../components/Header/Header";
import PodcastSidebar from "../components/PodcastSidebar/PodcastSidebar";
import { RootState } from "../store/store";
import { Episode } from "../types/Episode";
import { Podcast } from "../types/Podcast";

/**
 * EpisodeDetail page
 *
 * The component for the page where the detail of an episode of the podcast is displayed.
 * Shows a side bar with image, name, author and description of podcast
 * and a name, description and audio played for the episode
 */
const EpisodeDetail = () => {
  // Retrieve from the redux store the selected podcast and episode
  const selectedPodcast: Podcast | null = useSelector(
    (state: RootState) => state.podcasts.selectedPodcast
  );
  const selectedEpisode: Episode | null = useSelector(
    (state: RootState) => state.podcasts.selectedEpisode
  );
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="flex w-full w-screen gap-8">
        {selectedPodcast && selectedEpisode && (
          <>
            <PodcastSidebar podcast={selectedPodcast} />
            <EpisodePlayer episode={selectedEpisode} />
          </>
        )}
        {(!selectedPodcast || !selectedEpisode) && (
          <div>ERROR: No podcast/episode selected</div>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
