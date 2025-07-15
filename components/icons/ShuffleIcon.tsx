
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const ShuffleIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 18h1.4c1.3 0 2.5-.6 3.4-1.6l1.8-2.1c.9-1 2.2-1.6 3.4-1.6h1.4" />
    <path d="M22 6h-1.4c-1.3 0-2.5.6-3.4 1.6L15.4 9.7c-.9 1-2.2 1.6-3.4 1.6H2" />
    <path d="m2 6 3 3-3 3" />
    <path d="m22 18-3-3 3-3" />
  </svg>
);

export default ShuffleIcon;
