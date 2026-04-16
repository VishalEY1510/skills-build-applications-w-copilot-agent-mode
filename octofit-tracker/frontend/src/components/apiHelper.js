export function getApiBaseUrl() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (!codespaceName) {
    return 'http://localhost:8000/api';
  }
  return `https://${codespaceName}-8000.app.github.dev/api`;
}

export function normalizeResponseData(data) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export function logFetchedData(endpoint, data) {
  console.log(`[API] fetched from ${endpoint}`);
  console.log(data);
  return data;
}
