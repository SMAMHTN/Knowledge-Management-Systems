import Link from 'next/link';

function ListFile({ idArray, path }) {
  return (
    <div>
      <h2>Links:</h2>
      <ul>
        {idArray.map((id) => (
          <li key={id}>
            <Link href={`${path}${id}`}>
              {window.location.origin}
              {path}
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListFile;
