
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type SocialProvider = 'google' | 'facebook' | 'linkedin_oidc';

export const handleSocialLogin = async (provider: SocialProvider) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast.error(error.message || `Error en inicio de sesión con ${provider}`);
  }
};
