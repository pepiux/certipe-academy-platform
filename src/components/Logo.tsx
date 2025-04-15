
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  const isMobile = useIsMobile();
  
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
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
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
      {!isMobile && (
        <div className={`font-bold ${sizeClasses[size]} flex items-center`}>
          <span className="text-white">Certi</span>
          <span className="text-brand-blue">PE</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
