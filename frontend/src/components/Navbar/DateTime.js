'use client';

import { useState, useEffect } from 'react';
import { DateTime } from 'luxon'; // Import DateTime from luxon
import { CoreAPIGET } from '../../dep/core/coreHandler';

function DateTimeTrue() {
  const [tz, setTz] = useState('UTC');
  const [currentTime, setCurrentTime] = useState(DateTime.local());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.local());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    CoreAPIGET('tz')
      .then((response) => {
        setTz(response.body.Data);
      })
      .catch((error) => {
        console.log(error);
        setTz('UTC');
      });

    const interval2 = setInterval(() => {
      CoreAPIGET('tz')
        .then((response) => {
          setTz(response.body.Data);
        })
        .catch((error) => {
          console.log(error);
          setTz('UTC');
        });
    }, 10000000);

    return () => clearInterval(interval2);
  }, []);

  const isValidTime = currentTime.isValid;
  const formattedTime = isValidTime
    ? currentTime.setZone(tz).toFormat('HH:mm:ss')
    : 'Invalid Time';
  const formattedDate = isValidTime
    ? currentTime.setZone(tz).toFormat('yyyy-MM-dd')
    : 'Invalid Date';

  return (
    <div className={`dateTimeContainer transition-opacity ${isValidTime ? 'opacity-100' : 'opacity-0'}`} suppressHydrationWarning>
      <div className={`time transition-opacity ${isValidTime ? 'opacity-100' : 'opacity-0'}`} suppressHydrationWarning>
        Current Time:
        {' '}
        {formattedTime}
      </div>
      <div className={`date transition-opacity ${isValidTime ? 'opacity-100' : 'opacity-0'}`} suppressHydrationWarning>
        Current Date:
        {' '}
        {formattedDate}
      </div>
    </div>
  );
}

export default DateTimeTrue;
