import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';



const Progress = ({ percentageConvert }) => {

  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setInterval(() => setCompleted(Math.floor(Math.random() * 100) + 1), 2000);
  }, []);

  return (
    <div className='progress'>
      <div
        className='progress-bar bg-info" progress-bar-striped bg-success'
        role='progressbar'
        style={{ width: `${percentageConvert}%` }}
      >
        {percentageConvert}%
      </div>

    </div>
  );
};

Progress.propTypes = {
    percentageConvert: PropTypes.number.isRequired
};

export default Progress;