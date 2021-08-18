export default function apiService(url) {
  return fetch(url).then((response) => {
    return response.json();
  });
}
