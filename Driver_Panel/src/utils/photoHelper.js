/**
 * Helper to get and set driver-specific profile photo safely
 * Ensures each driver has their own isolated profile picture
 */

export const getDriverPhotoKey = (driver) => {
  const id = driver?.driverId || driver?._id;
  return id ? `driver_photo_${id}` : null;
};

export const getDriverPhoto = (driver) => {
  if (!driver) return '';
  if (driver.photo) return driver.photo;
  if (driver.avatar) return driver.avatar;
  const key = getDriverPhotoKey(driver);
  if (key) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return saved;
    } catch {}
  }
  return '';
};

export const saveDriverPhoto = (driver, photoData) => {
  const key = getDriverPhotoKey(driver);
  if (key) {
    try {
      if (photoData) {
        localStorage.setItem(key, photoData);
      } else {
        localStorage.removeItem(key);
      }
    } catch {}
  }
  // Clear any legacy shared global key so other drivers don't see it
  try {
    localStorage.removeItem('driver_custom_photo');
  } catch {}
};

export const clearDriverPhoto = (driver) => {
  const key = getDriverPhotoKey(driver);
  if (key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
  try {
    localStorage.removeItem('driver_custom_photo');
  } catch {}
};
