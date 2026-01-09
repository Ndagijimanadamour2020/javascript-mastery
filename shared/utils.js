export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function generateID() {
  return Date.now();
}
