export const getArticle = async (
  url: string,
  signal: AbortSignal
): Promise<string> => {
  try {
    const urlParams = new URLSearchParams({ url });
    const articleApiUrl = `${process.env.EXPO_PUBLIC_BOOKMARKS_BACKEND_URL}/api/article`;
    const targetUrl = `${articleApiUrl}?${urlParams.toString()}`;
    const response = await fetch(`${articleApiUrl}?${urlParams.toString()}`, {
      signal,
    });
    const { text } = await response.json();
    return text;
  } catch (e) {
    console.error('Error on getArticle', e);
    return '';
  }
};
