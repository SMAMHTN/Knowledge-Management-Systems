import React from 'react';

export function RequiredFieldIndicator() {
  return (
    <span className="text-red-400" aria-label="Required Field" title="Required Field">
      {' '}
      *
    </span>
  );
}

export function ErrorMessage({ error }) {
  return (
    <p className="text-red-600 text-xs">{error}</p>
  );
}
