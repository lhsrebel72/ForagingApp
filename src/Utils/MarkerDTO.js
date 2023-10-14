export const createMarkerDTO = (name, date, coordinates_lat, coordinates_lng) => ({
  name, 
  date, 
  coordinates_lat, 
  coordinates_lng
});

export const createMarkerDTOFromDatabaseRow = (row) => {
  const { name, date, coordinates_lat, coordinates_lng } = row;
  return createMarkerDTO(name, date, coordinates_lat, coordinates_lng);
};

export const createMarkerDatabaseObject = (userDTO) => {
  const { name, date, coordinates_lat, coordinates_lng } = userDTO;
  return { name, date, coordinates_lat, coordinates_lng };
};