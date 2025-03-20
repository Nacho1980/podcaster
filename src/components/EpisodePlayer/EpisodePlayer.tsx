import { Episode } from "../../types/Episode";

/**
 * Episode player component
 *
 * Displays a short description of the episode and plays the podcast episode
 * @param episode The episode
 */
const EpisodePlayer = ({ episode }: { episode: Episode }) => {
  return (
    <div
      className="flex flex-col w-full drop-shadow-lg p-4 mt-4 mr-4"
      data-testid="episode-player"
      style={{
        boxShadow:
          "-4px 4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="font-bold text-2xl">{episode.title}</div>
      <div
        className="italic border-b border-gray-300 pt-4 pb-4"
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
      <div className="mt-4 w-full">
        <audio
          data-testid="audio-player"
          className="w-full"
          src={episode.url}
          controls
        ></audio>
      </div>
    </div>
  );
};

export default EpisodePlayer;
