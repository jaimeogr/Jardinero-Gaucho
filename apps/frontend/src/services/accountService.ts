// services/accountService.ts
import camelcaseKeys from 'camelcase-keys';

import supabase from '@/api/supabase/client';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';

export async function refreshCurrentAccount(userId: string) {
  const { data, error } = await supabase.from('accounts').select('*').eq('id', userId).single();

  if (error) {
    console.error('Error retrieving account data:', error);
    return null;
  } else {
    const transformedData = { ...data, userId: data.id };
    const account = camelcaseKeys(transformedData, { deep: true });
    useCurrentAccountStore.getState().setCurrentUser(account);
    return account;
  }
}

export async function devAutoLogin() {
  // if (!__DEV__) {
  //   return false;
  // }

  const skipSignInScreen = process.env.EXPO_PUBLIC_SKIP_SIGNIN_SCREEN?.toLowerCase() === 'true';

  if (!skipSignInScreen) {
    return false;
  }

  try {
    const devEmail = process.env.EXPO_PUBLIC_SUPABASE_ACCOUNT_DEV_EMAIL?.trim() ?? '';
    const devPassword = process.env.EXPO_PUBLIC_SUPABASE_ACCOUNT_DEV_PASSWORD?.trim() ?? '';

    if (!devEmail || !devPassword) {
      console.error('❌ Missing dev email/password for auto-login.');
      return false;
    }

    console.log('🔑 Attempting dev auto-login...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: devEmail,
      password: devPassword,
    });

    if (error) {
      console.error('❌ Supabase email+password sign-in error:', error);
      return false;
    }

    if (data?.user) {
      console.log('✅ Dev auto-login successful:', data.user);
      // Refresh the account record from your "accounts" table
      await refreshCurrentAccount(data.user.id);
      return true;
    }

    console.warn('⚠️ Dev auto-login returned no user data.');
    return false;
  } catch (err) {
    console.error('❌ Dev auto-login failed with exception:', err);
    return false;
  }
}
