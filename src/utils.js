export const truncate = (str, len) => {
  if (str && str.length > len) {
    return str.substring(0, len) + "...";
  } else {
    return str;
  }
};

export const getRandomColor = (opacity) => {
  const r = Math.floor((Math.random() * 255) / 2);
  const g = Math.floor((Math.random() * 255) / 2);
  const b = Math.floor((Math.random() * 255) / 2);
  return `rgba(${r},${g},${b},${opacity || 1})`;
};

export const dataFormatter = (number) => {
  if (number > 1e9) {
    return Math.floor(number / 1e9).toString() + "B";
  } else if (number > 1e6) {
    return Math.floor(number / 1e6).toString() + "M";
  } else if (number > 1e3) {
    return Math.floor(number / 1e3).toString() + "K";
  } else {
    return number.toString();
  }
};

export const formattedDate = (date) => {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

