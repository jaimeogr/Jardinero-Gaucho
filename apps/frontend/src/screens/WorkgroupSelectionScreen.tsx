// SettingsScreen.tsx
import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

import useWorkgroupService from '@/services/useWorkgroupService';

const WorkgroupSelectionScreen = ({ navigation }) => {
  const workgroups = useWorkgroupService.useAllWorkgroups();

  const handleWorkgroupSelection = (workgroupId: string) => {
    useWorkgroupService.setActiveWorkgroup(workgroupId);
    navigation.navigate('HomeMain');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Grupos de trabajo</Text>
        <Button mode="contained" onPress={() => navigation.navigate('WorkgroupCreation')}>
          <Text>Crear grupo de trabajo</Text>
        </Button>
        <View>
          <TouchableOpacity key={1} onPress={() => handleWorkgroupSelection('1')}>
            <Text>111111111111111111111111111111111111111</Text>
          </TouchableOpacity>
          {workgroups.map((item) => (
            <TouchableOpacity key={item.workgroupId} onPress={() => handleWorkgroupSelection(item.workgroupId)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WorkgroupSelectionScreen;
