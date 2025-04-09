
import React from 'react';
import { Button } from '@/components/ui/button';
import { handleSocialLogin } from '@/utils/authUtils';

interface SocialLoginProps {
  mode: 'login' | 'register';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ mode }) => {
  const label = mode === 'login' ? 'continuar con' : 'registrarse con';
  
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O {label}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleSocialLogin('google')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.6,43.9,21.3,43.6,20z"/>
            <path fill="#FF3D00" d="M6.3,14.7l7.1,5.4C15.1,15.1,19.3,12,24,12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C16.3,4,9.6,8.4,6.3,14.7z"/>
            <path fill="#4CAF50" d="M24,44c5,0,9.6-1.6,13.5-4.3l-6.6-5.5c-2.1,1.4-4.7,2.2-6.9,2.2c-5.8,0-10.3-3.8-11.3-8h-7v5.7C9.6,39.8,16.3,44,24,44z"/>
            <path fill="#1976D2" d="M12.7,28.4h0.1L6,34c-0.4-0.8-0.7-1.6-1-2.4C4.4,29.9,4,26.9,4,24s0.4-5.9,1-8.6c0.3-0.9,0.6-1.7,1-2.4l6.8,5.7l0,0c-0.6,1.6-1,3.4-1,5.3C11.8,25.1,12.1,26.8,12.7,28.4z"/>
          </svg>
          Google
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#0d65d9] border-[#1877F2]"
          onClick={() => handleSocialLogin('facebook')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987c4.781-.75 8.438-4.887 8.438-9.878z" />
          </svg>
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] text-white hover:bg-[#084b8a] border-[#0A66C2]"
          onClick={() => handleSocialLogin('linkedin_oidc')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </Button>
      </div>
    </>
  );
};

export default SocialLogin;
