
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Linkedin } from 'lucide-react';
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
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleSocialLogin('google')}
          className="rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.6,43.9,21.3,43.6,20z"/>
            <path fill="#FF3D00" d="M6.3,14.7l7.1,5.4C15.1,15.1,19.3,12,24,12c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,5.5,29.1,4,24,4C16.3,4,9.6,8.4,6.3,14.7z"/>
            <path fill="#4CAF50" d="M24,44c5,0,9.6-1.6,13.5-4.3l-6.6-5.5c-2.1,1.4-4.7,2.2-6.9,2.2c-5.8,0-10.3-3.8-11.3-8h-7v5.7C9.6,39.8,16.3,44,24,44z"/>
            <path fill="#1976D2" d="M12.7,28.4h0.1L6,34c-0.4-0.8-0.7-1.6-1-2.4C4.4,29.9,4,26.9,4,24s0.4-5.9,1-8.6c0.3-0.9,0.6-1.7,1-2.4l6.8,5.7l0,0c-0.6,1.6-1,3.4-1,5.3C11.8,25.1,12.1,26.8,12.7,28.4z"/>
          </svg>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleSocialLogin('facebook')}
          className="rounded-full"
        >
          <Facebook className="h-5 w-5 text-[#1877F2]" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleSocialLogin('linkedin_oidc')}
          className="rounded-full"
        >
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
        </Button>
      </div>
    </>
  );
};

export default SocialLogin;
