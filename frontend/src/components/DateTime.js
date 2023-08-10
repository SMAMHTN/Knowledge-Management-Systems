// components/DateTime.js
"use client";
import { useState, useEffect } from "react";

const DateTime = ({ initialTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date(initialTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to format the date and time
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isValidTime = !isNaN(currentTime.getTime());
  const formattedTime = isValidTime ? formatTime(currentTime) : "Invalid Time";
  const formattedDate = isValidTime ? formatDate(currentTime) : "Invalid Date";

  return (
    <div
      className={`dateTimeContainer transition-opacity ${
        isValidTime ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`time transition-opacity ${
          isValidTime ? "opacity-100" : "opacity-0"
        }`}
      >
        Current Time: {isValidTime ? formatTime(currentTime) : "Invalid Time"}
      </div>
      <div
        className={`date transition-opacity ${
          isValidTime ? "opacity-100" : "opacity-0"
        }`}
      >
        Current Date : {isValidTime ? formatDate(currentTime) : "Invalid Date"}
      </div>
    </div>
  );
};

export default DateTime;
