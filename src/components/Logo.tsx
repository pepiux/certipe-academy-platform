
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
    <Link to="/" className="inline-flex items-center">
      <div className={`font-bold ${sizeClasses[size]} flex items-center`}>
        {!isMobile && <span className="text-white">Certi</span>}
        <span className="text-brand-blue">PE</span>
      </div>
    </Link>
  );
};

export default Logo;
