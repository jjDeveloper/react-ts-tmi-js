import React from 'react';

export const ChatContent = (props) => {
  return (
    <div className="container">
      <div className="row py-3">
        <div className="col-md-7">
          <div className="">{props.main}</div>
        </div>
        <div className="col-md-5">
          <div className="card">{props.chat}</div>
        </div>
      </div>
    </div>
  );
};
