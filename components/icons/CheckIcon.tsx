import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const CheckIcon: React.FC<IconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default CheckIcon;