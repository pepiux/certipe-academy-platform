
import React from "react";
import { Link } from "react-router-dom";

const LogoIcon: React.FC = () => {
  return (
    <Link to="/dashboard" className="inline-flex items-center">
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 hover:scale-110"
      >
        <rect width="24" height="24" fill="black" />
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          fill="#00B4FF" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 17L12 22L22 17" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 12L12 17L22 12" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M19 7V17" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

export default LogoIcon;
