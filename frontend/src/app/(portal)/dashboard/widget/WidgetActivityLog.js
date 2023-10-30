'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { CoreAPIGET } from '@/dep/core/coreHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import TimeAgo from '@/components/Time/TimeAgo';

function WidgetActivityLog() {
  const [logData, setLogData] = useState([]);
  const newSortField = 'Time';
  const newSortParams = HandleSortParams(newSortField, false);
  useEffect(() => {
    async function fetchData() {
      try {
        const log = await CoreAPIGET(URLParamsBuilder('listhistory', null, 5, null, newSortParams));
        setLogData(log.body.Data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);
  return (
    <Table>
      {logData === null || logData.length === 0 ? (
        <TableCaption className="my-14">A list of recent Changes.</TableCaption>
      ) : null}
      <TableBody>
        {logData && logData.map((item) => (
          <TableRow key={item.HistoryID}>
            <TableCell className="text-xs ">
              <TimeAgo timestamp={item.Time} />
              &nbsp; Ago
              {/* {console.log(item.Time)} */}
            </TableCell>
            <TableCell className="text-xs">{item.Changes.length <= 30 ? item.Changes : `${item.Changes.substring(0, 50)}...`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default WidgetActivityLog;
