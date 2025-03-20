import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTopPodcasts } from "../hooks/useTopPodcasts";
import { setLoading } from "../reducers/podcastReducer";
import { RootState } from "../store/store";
import { Podcast } from "../types/Podcast";
import PodcastCard from "./PodcastCard";

/**
 * PodcastList component
 *
 * Displays a list of the 100 most popular podcasts retrieved from the endpoint
 */
const PodcastList = () => {
  const { podcasts, loading, error } = useTopPodcasts();
  const filterText = useSelector(
    (state: RootState) => state.podcasts.filterText
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);
  if (error) return <div>Error: {error}</div>;

  const filteredPodcasts =
    filterText && filterText.length > 0
      ? podcasts.filter(
          (pod: Podcast) =>
            pod.title.includes(filterText) || pod.author.includes(filterText)
        )
      : podcasts;

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {filteredPodcasts.map((podcast, index) => (
          <PodcastCard key={"podcast-" + index} podcast={podcast} />
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
