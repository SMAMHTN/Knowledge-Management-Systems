import React from 'react';

export default function TimeAgo({ timestamp }) {
  const timeORI = timestamp;
  function calculateTimeDifference() {
    const currentTime = new Date();
    const previousTime = new Date(timeORI);
    const timeDifferenceInSeconds = Math.floor((currentTime - previousTime) / 1000);
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} sec ago`;
    } if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} min`;
    } if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hours`;
    }
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} days`;
  }

  const timeAgoString = calculateTimeDifference();

  return <span>{timeAgoString}</span>;
}
