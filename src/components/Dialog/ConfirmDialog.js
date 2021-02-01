import React from 'react'
import { Confirm } from 'react-st-modal';

export default function ConfirmDialog(title, text) {
  return (
    <div>
      <button
        onClick={async () => {
          const result = await Confirm(title,
            text);
        }}>
      </button>
    </div>
  )
}
