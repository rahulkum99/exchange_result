// Placeholder API client
export async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

