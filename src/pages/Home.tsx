import Filter from "../components/Filter/Filter";
import Header from "../components/Header/Header";
import PodcastList from "../components/PodcastList/PodcastList";

/**
 * Home page
 *
 * The component for the page where the list of podcasts is displayed.
 * Shows a filter for the podcasts and a list of them shown as cards
 */
const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <Filter />
      <PodcastList />
    </div>
  );
};

export default Home;
