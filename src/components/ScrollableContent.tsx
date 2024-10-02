// ScrollableContent.tsx
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';

import ScrollableItemForTodaysLots from './ScrollableItemForTodaysLots';

const ScrollableContent = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />

        <Divider style={styles.divider} bold={true} />
        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
        <Divider style={styles.divider} bold={true} />

        <ScrollableItemForTodaysLots
          number="505"
          area="2"
          neighbourhood="El Canton asd asd asdas asdasdasd"
          extraNotes="El Gingko Biloba necesita poda asd das ds sd asd asd sa das ds ds das"
        />
      </ScrollView>

      {/* Fade effect at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']} // Adjust colors for the fade effect
        style={styles.fadeEffect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    width: '100%',
    backgroundColor: 'lightgray',
  },
  scrollContent: {
    paddingVertical: 10, // Padding for the scrollable area
    paddingHorizontal: 24, // Padding for the scrollable area
  },
  scrollItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 7,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40, // Adjust the height of the fade effect
  },
});

export default ScrollableContent;
