import { renderHook } from "@testing-library/react-hooks";
import { CACHE_EXPIRES_MS } from "../../constants";
import { Podcast } from "../../types/Podcast";
import { useTopPodcasts } from "../useTopPodcasts";

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
describe.skip("useTopPodcasts", () => {
  const mockPodcasts: Podcast[] = [
    {
      id: "1",
      imageUrl: "test1.jpg",
      title: "Podcast 1",
      author: "Author 1",
      description: "Description 1",
      episodes: [],
    },
    {
      id: "2",
      imageUrl: "test2.jpg",
      title: "Podcast 2",
      author: "Author 2",
      description: "Description 2",
      episodes: [],
    },
  ];

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorageMock.clear();
  });

  it("fetches and returns top podcasts on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        contents: JSON.stringify({
          feed: {
            entry: [
              {
                id: { attributes: { "im:id": "1" } },
                "im:image": [
                  { label: "small" },
                  { label: "medium" },
                  { label: "test1.jpg" },
                ],
                "im:name": { label: "Podcast 1" },
                "im:artist": { label: "Author 1" },
                summary: { label: "Description 1" },
              },
              {
                id: { attributes: { "im:id": "2" } },
                "im:image": [
                  { label: "small" },
                  { label: "medium" },
                  { label: "test2.jpg" },
                ],
                "im:name": { label: "Podcast 2" },
                "im:artist": { label: "Author 2" },
                summary: { label: "Description 2" },
              },
            ],
          },
        }),
      }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useTopPodcasts());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(result.current.error).toBeNull();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("returns error on fetch failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result, waitForNextUpdate } = renderHook(() => useTopPodcasts());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcasts).toEqual([]);
    expect(result.current.error).toBe(
      "Error in API response when fetching podcasts"
    );
  });

  it("uses cached data if available and not expired", async () => {
    const cachedData = {
      data: mockPodcasts,
      timestamp: new Date().getTime(),
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

    const { result } = renderHook(() => useTopPodcasts());

    expect(result.current.loading).toBe(false);
    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches fresh data if cached data is expired", async () => {
    const expiredTimestamp = new Date().getTime() - CACHE_EXPIRES_MS - 1000;
    const cachedData = {
      data: mockPodcasts,
      timestamp: expiredTimestamp,
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        contents: JSON.stringify({
          feed: {
            entry: [
              {
                id: { attributes: { "im:id": "1" } },
                "im:image": [
                  { label: "small" },
                  { label: "medium" },
                  { label: "test1.jpg" },
                ],
                "im:name": { label: "Podcast 1" },
                "im:artist": { label: "Author 1" },
                summary: { label: "Description 1" },
              },
              {
                id: { attributes: { "im:id": "2" } },
                "im:image": [
                  { label: "small" },
                  { label: "medium" },
                  { label: "test2.jpg" },
                ],
                "im:name": { label: "Podcast 2" },
                "im:artist": { label: "Author 2" },
                summary: { label: "Description 2" },
              },
            ],
          },
        }),
      }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useTopPodcasts());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(fetch).toHaveBeenCalled();
  });
});
