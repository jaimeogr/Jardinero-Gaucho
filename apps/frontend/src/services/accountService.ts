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
