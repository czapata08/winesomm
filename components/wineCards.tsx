// components/Card.js
import React from "react";

type CardProps = {
  title: string;
  content: string;
};

const WineCard = ({ title, content }: CardProps) => {
  return (
    <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3'>
      <div className='md:flex'>
        {/* <div className='md:flex-shrink-0'>
          <img
            className='h-48 w-full object-cover md:w-48'
            src='/wine.jpg'
            alt='Wine bottle'
          />
        </div> */}
        <div className='p-8'>
          <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
            {title}
          </div>
          <p className='mt-2 text-gray-500'>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
