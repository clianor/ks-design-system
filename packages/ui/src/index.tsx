import React from 'react';
import { roll } from '@ks-design-system/utils';

export interface ButtonProps {
  label: string;
  roll?: true;
}

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button>
      {props.label} {props.roll ? roll('1d20') : ''}
    </button>
  );
};
