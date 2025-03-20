import { renderHook } from "@testing-library/react-hooks";
import { CACHE_EXPIRES_MS } from "../../constants";
import { Podcast } from "../../types/Podcast";
import { usePodcastDetails } from "../usePodcastDetails";

// Mock fetch and localStorage
global.fetch = jest.fn();
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });
// Test skipped because of incompatibility with latest version of React
describe.skip("usePodcastDetails", () => {
  const podcastId = "12345";
  const mockPodcastDetails: Podcast = {
    id: "12345",
    title: "Test Podcast",
    author: "Test Author",
    imageUrl: "test.jpg",
    episodes: [],
    description: "Test Description",
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorageMock.clear();
  });

  it("fetches and returns podcast details on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            collectionId: 12345,
            collectionName: "Test Podcast",
            artistName: "Test Author",
            artworkUrl600: "test.jpg",
            feedUrl: "mockFeedUrl",
          },
          {
            trackId: 1,
            trackName: "Episode 1",
            releaseDate: "2023-10-27T10:00:00Z",
            trackTimeMillis: 3600000,
            description: "Episode Description",
            episodeUrl: "episode.mp3",
          },
        ],
      }),
      text: async () => "<description>Test Description</description>",
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePodcastDetails(podcastId)
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcast).toEqual({
      ...mockPodcastDetails,
      episodes: [
        {
          id: "1",
          title: "Episode 1",
          date: "10/27/2023",
          duration: "01:00:00",
          description: "Episode Description",
          url: "episode.mp3",
        },
      ],
    });
    expect(result.current.error).toBeNull();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("returns error on fetch failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePodcastDetails(podcastId)
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcast).toBeNull();
    expect(result.current.error).toBe("Error fetching podcast details");
  });

  it("uses cached data if available and not expired", async () => {
    const cachedData = {
      data: mockPodcastDetails,
      timestamp: new Date().getTime(),
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

    const { result } = renderHook(() => usePodcastDetails(podcastId));

    expect(result.current.loading).toBe(false);
    expect(result.current.podcast).toEqual(mockPodcastDetails);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches fresh data if cached data is expired", async () => {
    const expiredTimestamp = new Date().getTime() - CACHE_EXPIRES_MS - 1000;
    const cachedData = {
      data: mockPodcastDetails,
      timestamp: expiredTimestamp,
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            collectionId: 12345,
            collectionName: "Test Podcast",
            artistName: "Test Author",
            artworkUrl600: "test.jpg",
            feedUrl: "mockFeedUrl",
          },
        ],
      }),
      text: async () => "<description>Test Description</description>",
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePodcastDetails(podcastId)
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcast).toEqual(mockPodcastDetails);
    expect(fetch).toHaveBeenCalled();
  });
});
