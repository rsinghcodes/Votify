import { useAuth } from '@/providers/AuthProvider';
import { Button, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={{ padding: 10 }}>
      <Text>User id: {user?.id}</Text>

      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
