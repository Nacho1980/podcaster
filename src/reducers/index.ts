import { combineReducers } from "redux";
import podcastReducer from "./podcastReducer";

/**
 * Root reducer for Redux pointing to the reducer that will manage state updates
 */
const rootReducer = combineReducers({
  podcasts: podcastReducer,
});

export default rootReducer;
