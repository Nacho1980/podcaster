import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Episode } from "../../../types/Episode";
import EpisodePlayer from "../EpisodePlayer";

describe("EpisodePlayer", () => {
  const mockEpisode: Episode = {
    id: "1",
    title: "Test Episode",
    date: "2023-01-01",
    duration: "30:00",
    description: "<p>This is a test description.</p>",
    url: "http://example.com/audio.mp3",
  };

  it("renders the episode player correctly", () => {
    render(<EpisodePlayer episode={mockEpisode} />);

    // Verify title
    expect(screen.getByText("Test Episode")).toBeInTheDocument();

    // Verify description (using regex to ignore HTML tags)
    expect(screen.getByText(/This is a test description./)).toBeInTheDocument();

    // Verify audio element
    const audioElement = screen.getByTestId("audio-player") as HTMLAudioElement;
    expect(audioElement).toBeInTheDocument();
    expect(audioElement.src).toBe("http://example.com/audio.mp3");
  });
});
