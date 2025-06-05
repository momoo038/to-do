const NAVIGATION_DATA_KEY = 'userNavigationData';

export function saveDataToLocalStorage(data) {
  try {
    localStorage.setItem(NAVIGATION_DATA_KEY, JSON.stringify(data));
    console.log('Data saved to localStorage');
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

export function loadDataFromLocalStorage() {
  try {
    const dataString = localStorage.getItem(NAVIGATION_DATA_KEY);
    if (dataString) {
      console.log('Data loaded from localStorage');
      return JSON.parse(dataString);
    }
    return null;
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
    return null;
  }
}

export function clearNavigationDataFromLocalStorage() {
  try {
    localStorage.removeItem(NAVIGATION_DATA_KEY);
    console.log('Navigation data cleared from localStorage');
  } catch (e) {
    console.error('Error clearing data from localStorage:', e);
  }
}