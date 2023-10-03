class Api {
  static apiUrl = process.env.REACT_APP_API_URL;

  static addMarker(markerDetails) {
    return fetch(Api.apiUrl + '/api/markers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(markerDetails)
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error adding marker:', error);
    });
  }

  static getAllMarkers() {
    return fetch(Api.apiUrl + '/api/markers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error getting markers:', error);
    });
  }
}

export default Api;