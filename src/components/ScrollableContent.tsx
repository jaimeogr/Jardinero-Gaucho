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
    paddingHorizontal: 24, // Padding for the scrollable area
  },

  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20, // Adjust the height of the fade effect
    marginRight: 4, // Padding to match the scrollable area
  },
});

export default ScrollableContent;
