import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectPodcast } from "../../reducers/podcastReducer";
import { Podcast } from "../../types/Podcast";

/**
 * PodcastCard component
 *
 * Every item in the Podcast list, containing image, name and author for the podcast
 * @param podcast The podcast
 */
const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectPodcast(podcast));
    // Navigate to the detail of the podcast
    navigate(`/podcast/${podcast.id}`);
  };

  return (
    <div
      key={podcast.id}
      data-testid="podcast-card"
      onClick={handleClick}
      className="relative flex flex-col gap-2 text-center pt-12 pl-2 pr-2 pb-2 mt-12 cursor-pointer"
      style={{
        boxShadow:
          "-4px 4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          src={podcast.imageUrl}
          alt={podcast.title}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <div data-testid="podcast-title" className="uppercase font-bold text-sm">
        {podcast.title}
      </div>
      <div data-testid="podcast-author" className="text-sm">
        Author: {podcast.author}
      </div>
    </div>
  );
};

export default PodcastCard;
