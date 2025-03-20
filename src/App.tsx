import { BrowserRouter, Route, Routes } from "react-router-dom";
import EpisodeDetail from "./pages/EpisodeDetail";
import Home from "./pages/Home";
import PodcastDetail from "./pages/PodcastDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
        <Route
          path="/podcast/:podcastId/episode/:episodeId"
          element={<EpisodeDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
