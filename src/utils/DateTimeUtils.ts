/**
 * Transforms a date in ISO standard YYYYMMDDTHHmmSS to DD/MM/YYYY
 * @param dateISO
 */
export const dateISOToDDMMYYYY = (dateISO: string) => {
  if (!dateISO) {
    return "";
  }
  const dateObj = new Date(dateISO);
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  return (
    dateObj.getDate() + "/" + dateObj.getMonth() + "/" + dateObj.getFullYear()
  );
};

/**
 * Transforms a time in milliseconds to duration in HH:mm:SS
 * @param value
 * @returns
 */
export const timeMillisToHHmmSS = (value: any) => {
  if (!value) {
    return "";
  }
  const timeMillis: number = parseInt(value, 10);
  if (isNaN(timeMillis) || timeMillis < 1000) {
    return "";
  }
  const seconds = Math.floor(timeMillis / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
