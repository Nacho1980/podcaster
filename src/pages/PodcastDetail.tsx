import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EpisodeList from "../components/EpisodeList/EpisodeList";
import Header from "../components/Header/Header";
import PodcastSidebar from "../components/PodcastSidebar/PodcastSidebar";
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
  const { podcast, loading, error } = usePodcastDetails(
    selectedPodcast?.id || ""
  );
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="flex w-full">
        {!error && podcast && (
          <div className="flex gap-8">
            <PodcastSidebar podcast={podcast} />
            <EpisodeList episodes={podcast.episodes} />
          </div>
        )}
        {!error && !selectedPodcast && <div>ERROR: No podcast selected</div>}
        {error && <div>ERROR: Could not fetch podcast detail</div>}
      </div>
    </div>
  );
};

export default PodcastDetail;
