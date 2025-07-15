
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const SeatIcon: React.FC<IconProps> = (props) => (
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
        <path d="M7 21h10" />
        <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
        <path d="M19 12v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" />
        <path d="M21 12H3" />
        <path d="M17 12v-2" />
        <path d="M7 12v-2" />
    </svg>
);

export default SeatIcon;
