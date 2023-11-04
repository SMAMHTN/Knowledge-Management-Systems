import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import { DeleteModal, alertDelete } from './Feature';

export function ListFile({ idArray, path, FileDel }) {
  const [idArrayState, setIdArrayState] = useState(idArray);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFileID, setDeletingFileID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  useEffect(() => {
    if (idArray !== null) {
      setIdArrayState(idArray);
    }
  }, [idArray]);

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (deletingFileID !== null) {
      await FileDel(deletingFileID);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white shadow mb-4 p-4 rounded-lg">
      <h2 className="font-medium">File List</h2>
      <ul className="my-2">
        {idArrayState.map((id) => (
          <li key={id.FileID} className="mb-2 text-sm">
            •
            {' '}
            <button
              type="button"
              onClick={() => {
                setDeletingFileID(id.FileID);
                setDeleteMessage(
                  `Are you sure you would like to delete "${id.FileLoc.split('/').pop()}" document? This action cannot be undone.`,
                );
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-500 hover:underline mr-4"
            >
              del
            </button>
            {' '}
            {id.FileLoc.split('/').pop()}
            {' '}
            <Link href={`${path}${id.FileID}`} className="ml-16">
              link :

              {'   '}
              <span className="text-blue-600 hover:text-blue-700 underline">
                {' '}
                {window.location.origin}
                {path}
                {id.FileID}
              </span>
            </Link>

          </li>
        ))}
      </ul>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        message={deleteMessage}
      />
    </div>
  );
}

export function ListDoc({ idArray, path, DocDel }) {
  const [idArrayState, setIdArrayState] = useState(idArray);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDocID, setDeletingDocID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  useEffect(() => {
    if (idArray !== null) {
      setIdArrayState(idArray);
    }
  }, [idArray]);

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (deletingDocID !== null) {
      await DocDel(deletingDocID);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white shadow mb-4 p-4 rounded-lg">
      <h2 className="font-medium">Document List</h2>
      <ul className="my-2">
        {idArrayState.map((id) => (
          <li key={id.DocID} className="mb-2 text-sm">
            •
            {' '}
            <button
              type="button"
              onClick={() => {
                setDeletingDocID(id.DocID);
                setDeleteMessage(
                  `Are you sure you would like to delete "${id.DocLoc.split('/').pop()}" document? This action cannot be undone.`,
                );
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:text-red-500 hover:underline mr-4"
            >
              del
            </button>
            {' '}
            {id.DocLoc.split('/').pop()}
            {' '}
            <Link href={`${path}${id.DocID}`} className="ml-16">
              link :

              {'   '}
              <span className="text-blue-600 hover:text-blue-700 underline">
                {' '}
                {window.location.origin}
                {path}
                {id.DocID}
              </span>
            </Link>

          </li>
        ))}
      </ul>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        message={deleteMessage}
      />
    </div>
  );
}
