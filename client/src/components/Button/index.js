import React, { useState } from 'react';

const Button = ({
  label = 'Button',
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <button
      type={type}
      className={`text-white ${isClicked ? 'bg-green-500' : 'bg-primary'} hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${className}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default Button;
