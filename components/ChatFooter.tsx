import React from 'react';

export const ChatFooter = (props: { status: string }) => {
  const statusText = () => {
    switch (props.status) {
      case 'OPEN':
        return 'Connected';
      case 'CLOSED':
      default:
        return 'Disconnected';
    }
  };
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <span className="text-muted">
          React tmi.js client implementation -{' '}
        </span>
        <span
          className={props.status === 'OPEN' ? 'text-seccess' : 'text-danger'}
        >
          {statusText()}
        </span>
      </div>
    </footer>
  );
};
