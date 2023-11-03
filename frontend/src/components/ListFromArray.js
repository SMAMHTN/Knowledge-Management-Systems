import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ListFile({ idArray, path }) {
  const [idArrayState, setIdArrayState] = useState(idArray);

  useEffect(() => {
    if (idArray !== null) {
      setIdArrayState(idArray);
    }
  }, [idArray]);

  return (
    <div>
      <h2>Links:</h2>
      <ul>
        {idArrayState.map((id) => (
          <li key={id}>
            <Link href={`${path}${id.FileID}`}>
              {window.location.origin}
              {path}
              {id.FileID}
            </Link>
            {'                              '}
            {id.FileLoc.split('/').pop()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ListDoc({ idArray, path }) {
  const [idArrayState, setIdArrayState] = useState(idArray);

  useEffect(() => {
    console.log(idArray);
    if (idArray !== null) {
      setIdArrayState(idArray);
    }
  }, [idArray]);

  return (
    <div>
      <h2>Links:</h2>
      <ul>
        {idArrayState.map((id) => (
          <li key={id}>
            <Link href={`${path}${id.DocID}`}>
              {window.location.origin}
              {path}
              {id.DocID}
            </Link>
            {'                              '}
            {id.DocLoc.split('/').pop()}
          </li>
        ))}
      </ul>
    </div>
  );
}
