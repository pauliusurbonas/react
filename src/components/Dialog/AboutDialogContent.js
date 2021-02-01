import React from 'react'
import './style/AboutDialogContent.scss';

export default function AboutDialogContent() {
  return (
    <div className="dialog-content">
      Demo weather app React project. Author: <a href={'mailto:paulius.urb@gmail.com'}>paulius.urb@gmail.com</a>. Source code: <a href={'https://github.com/pauliusurbonas/react'} target={'_blank'} rel={'noreferrer'}>Github</a>
    </div>
  );
}
