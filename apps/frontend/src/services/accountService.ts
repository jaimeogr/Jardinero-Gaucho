// services/accountService.ts
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import supabase from '@/utils/supabase';

export async function refreshCurrentAccount(userId: string) {
  const { data: account, error } = await supabase.from('accounts').select('*').eq('id', userId).single();

  if (error) {
    console.error('Error retrieving account data:', error);
    return null;
  } else {
    useCurrentAccountStore.getState().setCurrentUser(account);
    console.log(JSON.stringify(account, null, 2));
    return account;
  }
}
