function convertToHMS(durationInseconds: number) {
  let timeString = "";

  let hours = Math.floor(durationInseconds / 3600); // get hours
  let minutes = Math.floor((durationInseconds - hours * 3600) / 60); // get minutes
  let seconds = durationInseconds - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02

  if (hours < 10) {
    timeString += "0" + hours;
  } else {
    timeString += hours;
  }

  timeString += ":";

  if (minutes < 10) {
    timeString += "0" + minutes;
  } else {
    timeString += minutes;
  }

  timeString += ":";

  if (seconds < 10) {
    timeString += "0" + seconds;
  } else {
    timeString += seconds;
  }

  return timeString ? timeString : "00 : 00";
}

export { convertToHMS };
