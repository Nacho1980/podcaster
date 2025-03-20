import { Episode } from "./Episode";

/**
 * A simple podcast
 */
export type Podcast = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  description: string;
  episodes: Episode[];
};
