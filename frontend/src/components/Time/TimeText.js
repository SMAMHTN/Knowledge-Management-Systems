import React from 'react';

export default function TimeText({ timestamp }) {
  if (!timestamp) {
    return <span />;
  }

  const previousTime = new Date(timestamp);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = previousTime.toLocaleDateString(undefined, options);
  const formattedTime = previousTime.toLocaleTimeString();
  const completeTimeText = `${formattedDate} ${formattedTime}`;

  return <span className="text-xs">{completeTimeText}</span>;
}
