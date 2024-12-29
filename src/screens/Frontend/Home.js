import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { URL } from '../../components/Global';

const Home = () => {

  const [events, setEvents] = useState([]);
  const [filterEvents, setFilterEvents] = useState([]);
  
  useEffect(() => {
    axios.get(`${URL}/read`)
      .then((res) => {
        const { data } = res; // destructure response 
        setEvents(data);
        setFilterEvents(data);
        console.log("data =>", data);
      })
      .catch((err) => {
        console.error("Error", err);
      })
      .finally(() => {
        // setIsLoading(false)
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.h1}>All Events</Text>

        {events.map((event, i) => (
          <Card key={i} style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>{event.title}</Title>
              <Text style={styles.location}>{event.location}</Text>
              <Paragraph style={styles.cardText}>{event.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Light gray background
    padding: 10,
  },
  h1: {
    fontSize: 48,
    color: "#4A90E2", // Blue color for title
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // White background for card
    elevation: 5,
    borderRadius: 8, // Rounded corners for the card
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333', // Dark gray color for the title text
  },
  location: {
    fontSize: 14,
    color: '#7B7B7B', // Medium gray for location text
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#616161', // Slightly lighter gray for description text
  },
  date: {
    fontSize: 12,
    color: '#424242', // Darker gray for date text
    marginTop: 5,
  },
});

export default Home;
