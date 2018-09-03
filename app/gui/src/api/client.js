const clientFetch = (url, options) =>
  fetch(url, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    ...options,
  }).then(function(response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(json => Promise.reject(json));
  });

export const client = {
  get(url, data = {}) {
    let urlClass = new URL(url);
    Object.keys(data)
      .filter(key => data[key] !== undefined)
      .forEach(key => {
        urlClass.searchParams.append(key, data[key]);
      });
    return clientFetch(urlClass, {
      method: 'GET',
    });
  },
  put(url, data = {}) {
    return clientFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  post(url, data = {}) {
    return clientFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  delete(url) {
    return fetch(url, {
      method: 'DELETE',
    });
  },
};
