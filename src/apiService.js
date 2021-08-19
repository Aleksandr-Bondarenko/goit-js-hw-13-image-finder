export default function apiService(url) {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((reject) => {
      console.log(reject);
      return "ERROR 404";
    });
}
