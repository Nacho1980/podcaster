import { useNavigate } from "react-router-dom";
import { Podcast } from "../../types/Podcast";

/**
 * PodcastSidebar component
 *
 * A side bar containing the image, title, author and brief description for the podcast.
 * Included in the pages for the detail of the podcast and the detail of the episode
 * @param podcast The podcast
 */
const PodcastSidebar = ({ podcast }: { podcast: Podcast }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the detail of the podcast
    navigate(`/podcast/${podcast.id}`);
  };
  return (
    <div
      className="flex flex-col cursor-pointer gap-2 pt-2 pl-2 pr-2 pb-3 ml-4 mt-4 flex-shrink-0 h-fit w-1/4"
      onClick={handleClick}
      data-testid="podcast-sidebar"
      style={{
        boxShadow:
          "-4px 4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex pt-4 pb-4 border-b border-gray-300 justify-center items-center">
        <img src={podcast.imageUrl} alt={podcast.title} className="w-20 h-20" />
      </div>
      <div className="flex flex-col pb-4 border-b border-gray-300 ml-2 mr-2">
        <div className="font-bold text-sm">{podcast.title}</div>
        <div className="text-sm italic">by {podcast.author}</div>
      </div>
      <div className="flex flex-col gap-2 ml-2 mr-2">
        <div className="font-bold text-sm">Description:</div>
        <div className="text-sm italic">{podcast.description}</div>
      </div>
    </div>
  );
};

export default PodcastSidebar;
