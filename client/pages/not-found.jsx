import React from 'react';

export default function NotFound(props) {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <div>
        <div>
          <h3>
            Uh oh, we could not find the page you were looking for!
          </h3>
          <p>
            <a href="#">Return to home page</a>
          </p>
        </div>
      </div>
    </div>
  );
}
