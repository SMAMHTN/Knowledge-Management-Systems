import React from 'react';

export function RequiredFieldIndicator() {
  return (
    <span className="text-red-600" aria-label="Required Field" title="Required Field">
      &nbsp;*
    </span>
  );
}

export function ErrorMessage({ error }) {
  return (
    <p className="text-red-600 text-xs absolute">{error}</p>
  );
}

export function Separator() {
  return <hr className="w-full border-t border-gray-300 mb-4" />;
}
