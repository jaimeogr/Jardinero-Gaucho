// src/screens/WorkgroupCreationScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
import useAccountController from '@/controllers/useAccountController';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';

const WorkgroupCreationScreen = ({ navigation }) => {
  const [workgroupName, setWorkgroupName] = useState('');
  const currentUser = useCurrentAccountStore((state) => state.currentUser);

  const { createNewWorkgroup } = useAccountController();

  useEffect(() => {
    setWorkgroupName('Jardineria ' + currentUser?.firstName);
  }, [currentUser]);

  const handleCreateWorkgroup = async () => {
    try {
      await createNewWorkgroup(workgroupName);
      navigation.navigate('HomeMain');
    } catch (error) {
      console.error('Error creating workgroup:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        label="Nombrá tu grupo de trabajo"
        placeholder="Ingresá el nombre de tu grupo"
        value={workgroupName}
        onChangeText={(workgroupName) => setWorkgroupName(workgroupName)}
      />
      <Button title="Siguiente" onPress={() => handleCreateWorkgroup()}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 20,
  },
});

export default WorkgroupCreationScreen;
