import React from 'react';

export function RequiredFieldIndicator() {
  return (
    <span className="text-red-400" aria-label="Required Field" title="Required Field">
      {' '}
      *
    </span>
  );
}

export function FieldNumOnly() {
  return (
    <p className="text-red-400 text-xs mt-1 absolute bottom">
      This field can only contain numeric values
    </p>
  );
}

export function FieldNEmailOnly() {
  return (
    <p className="text-red-400 text-xs mt-1 absolute bottom">
      Please insert a valid email
    </p>
  );
}
