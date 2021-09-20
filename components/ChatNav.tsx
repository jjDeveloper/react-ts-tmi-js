import React, { useState, useEffect } from 'react';

export const ChatNav = (props) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid align-items-center">
        <span className="navbar-brand">TwitchClient</span>
        <span className="navbar-text">{props.children}</span>
      </div>
    </nav>
  );
};
