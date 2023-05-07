// src/utils/time.ts
function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, shouldPadHours = false, shouldPadMinutes = false, shouldAlwaysShowHours = false) {
  const { hours, minutes, seconds } = parseTime(duration);
  const paddedHours = shouldPadHours ? padNumberWithZeroes(hours, 2) : hours;
  const paddedMinutes = shouldPadMinutes ? padNumberWithZeroes(minutes, 2) : minutes;
  const paddedSeconds = padNumberWithZeroes(seconds, 2);
  if (hours > 0 || shouldAlwaysShowHours) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
}
function formatSpokenTime(duration) {
  const spokenParts = [];
  const { hours, minutes, seconds } = parseTime(duration);
  const pluralize = (num, word) => num === 1 ? word : `${word}s`;
  if (hours > 0) {
    spokenParts.push(`${hours} ${pluralize(hours, "hour")}`);
  }
  if (minutes > 0) {
    spokenParts.push(`${minutes} ${pluralize(minutes, "minute")}`);
  }
  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} ${pluralize(seconds, "second")}`);
  }
  return spokenParts.join(", ");
}

export { formatSpokenTime, formatTime };