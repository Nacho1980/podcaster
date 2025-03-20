import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectEpisode } from "../../reducers/podcastReducer";
import { RootState } from "../../store/store";
import { Episode } from "../../types/Episode";

/**
 * Episode list component
 *
 * Displays the list of episodes for a podcast, selecting one will take to the detail of the episode
 * @param episodes List of episodes
 */
const EpisodeList = ({ episodes }: { episodes: Episode[] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPodcast = useSelector(
    (state: RootState) => state.podcasts.selectedPodcast
  );

  const handleClick = (episode: Episode) => {
    // Navigate to the detail of the episode
    navigate(`/podcast/${selectedPodcast?.id}/episode/${episode.id}`);
    dispatch(selectEpisode(episode));
  };

  return (
    <div className="flex flex-col gap-4 mt-4 w-full mr-4 mb-4">
      <div
        className="p-4 text-2xl font-bold w-full"
        style={{
          boxShadow:
            "-4px 4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Episodes: {episodes.length}
      </div>
      <div
        className="mt-2 w-full"
        data-testid="episode-list"
        style={{
          boxShadow:
            "-4px 4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Row */}
        <div className="grid grid-cols-10 border-b border-gray-300 font-bold p-3 text-left">
          <div className="col-span-7">Title</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Duration</div>
        </div>

        {/* Episode Rows */}
        {episodes.map((episode, index) => (
          <div
            key={episode.id}
            data-testid="episode-list-item"
            className={`grid grid-cols-10 p-3 border-b border-gray-200 ${
              index % 2 !== 0 ? "bg-gray-100" : ""
            }`}
          >
            <div
              className="font-bold col-span-7 cursor-pointer text-blue-500"
              onClick={() => handleClick(episode)}
            >
              {episode.title}
            </div>
            <div className="col-span-2">{episode.date}</div>
            <div className="col-span-1">{episode.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
