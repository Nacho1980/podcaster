import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  deselectEpisode,
  deselectPodcast,
} from "../../reducers/podcastReducer";
import Loader from "../Loader/Loader";

/**
 * Header component
 *
 * Common header for all pages, displays the link to the home page and the loader
 */
const Header = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    // Navigate back home, deselect selected podcast and episode
    dispatch(deselectPodcast());
    dispatch(deselectEpisode());
  };
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <Link
        to="/"
        onClick={handleClick}
        className="text-blue-500 font-bold"
        data-testid="header-title"
      >
        Podcaster
      </Link>
      <Loader />
    </div>
  );
};

export default Header;
