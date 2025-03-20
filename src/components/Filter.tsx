import { useDispatch, useSelector } from "react-redux";
import { setFilterText } from "../reducers/podcastReducer";
import { RootState } from "../store/store";

/**
 * Filter component
 *
 * Filters the list of podcasts by title and author
 */
const Filter = () => {
  const filterText = useSelector(
    (state: RootState) => state.podcasts.filterText
  );
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterText(e.target.value));
    console.log("Filter: " + e.target.value); // Logs text on each key press
  };
  return (
    <div className="flex justify-end p-4 gap-2">
      <div
        className="bg-blue-500 text-xl 
      text-white font-bold p-2 text-center rounded"
      >
        100
      </div>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={filterText}
          onChange={handleChange}
          className="border border-gray-400 rounded-lg p-2 w-64 focus:outline-none h-full"
          placeholder="Filter podcasts..."
        />
      </div>
    </div>
  );
};

export default Filter;
