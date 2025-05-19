export const API_KEY = "6d39c61";
export const API_BASE_URL = "http://www.omdbapi.com/";
export const SEARCH_DELAY = 1500;

export const getApiUrl = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    ...params
  });
  return `${API_BASE_URL}?${searchParams.toString()}`;
}; 