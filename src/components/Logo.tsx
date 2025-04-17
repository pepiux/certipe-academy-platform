
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "medium", textColor = "text-white" }) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-3xl",
  };

  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path 
          className="st0" 
          d="M5.8,18.7l8.2,4.1l8.2-4.1"
          stroke="#FFFFFF" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          className="st0" 
          d="M22.2,11.1v11.7"
          stroke="#FFFFFF" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          className="st0" 
          d="M5.8,11.1v7.6"
          stroke="#FFFFFF" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          className="st1" 
          d="M14,5.3L2.3,11.1L14,16.9l11.7-5.8L14,5.3z"
          fill="#00B4FF" 
          stroke="#FFFFFF" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <div className={`font-bold ${sizeClasses[size]} flex items-center`}>
        <span className={textColor === "text-white" ? "text-white" : textColor}>Certi</span>
        <span className="text-brand-blue">PE</span>
      </div>
    </Link>
  );
};

export default Logo;
