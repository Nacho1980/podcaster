import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EpisodeList from "../components/EpisodeList";
import Header from "../components/Header";
import PodcastSidebar from "../components/PodcastSidebar";
import { usePodcastDetails } from "../hooks/usePodcastDetails";
import { setLoading } from "../reducers/podcastReducer";
import { RootState } from "../store/store";
import { Podcast } from "../types/Podcast";

/**
 * PodcastDetail page
 *
 * The component for the page where the detail of a podcast is displayed.
 * Shows image, name, author, description, number and list of episodes
 */
const PodcastDetail = () => {
  const dispatch = useDispatch();
  // Retrieve from the redux store the selected podcast
  const selectedPodcast: Podcast | null = useSelector(
    (state: RootState) => state.podcasts.selectedPodcast
  );
  if (!selectedPodcast) {
    return (
      <div>ERROR: No podcast selected, could not display podcast details</div>
    );
  }
  const { podcast, loading, error } = usePodcastDetails(selectedPodcast?.id);
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);

  if (selectedPodcast) {
    if (error) {
      return <div>Error loading podcast detail</div>;
    }
    return (
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex w-full">
          {podcast && (
            <div className="flex gap-8">
              <PodcastSidebar podcast={podcast} />
              <EpisodeList episodes={podcast.episodes} />
            </div>
          )}
          {!selectedPodcast && <div>ERROR: No podcast selected</div>}
        </div>
      </div>
    );
  }
};

export default PodcastDetail;
