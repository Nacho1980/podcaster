/**
 * Given a RSS URL and a tag it returns the contents of the first occurence of such tag
 *  in the XML code of the URL
 * @param url
 * @param tag
 * @returns
 */
export const getFirstTagContentFromUrl = async (
  url: string,
  tag: string
): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const htmlString = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const descriptionElement = doc.querySelector(tag);

    if (descriptionElement) {
      return descriptionElement.textContent;
    } else {
      return null; // Description tag not found
    }
  } catch (error) {
    //console.error("Error fetching or parsing HTML:", error);
    return null; // Error occurred
  }
};
