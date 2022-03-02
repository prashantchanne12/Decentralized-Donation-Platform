import React from 'react';

const Supporter = ({ donor, index }) => {
  return (
    <div className={index > 0 ? `mt-10` : 'mt-7'}>
      <p>
        <span className='bg-violet-100 p-3 rounded-md'>{donor[0]}</span> donated{' '}
        <span className='text-violet-600 font-bold'>{donor[1]} Wei</span>
      </p>
    </div>
  );
};

export default Supporter;
