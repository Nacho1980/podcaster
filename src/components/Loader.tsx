import { useSelector } from "react-redux";
import { RootState } from "../store/store";

/**
 * Loader component
 *
 * Displays a loading indicator while data is being fetched using the shared state from Redux
 */
const Loader = () => {
  const isLoading = useSelector((state: RootState) => state.podcasts.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping"></div>
      </div>
    );
  }
};

export default Loader;
