import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuthContext } from '../../contexts/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuthContext();
  const [theme, setTheme] = useState('white'); // Default to white theme

  // Toggle between themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'white') return 'dark';
      if (prevTheme === 'dark') return 'gray';
      return 'white';
    });
  };

  // Get the current theme styles
  const currentTheme =
    theme === 'dark' ? styles.dark : theme === 'gray' ? styles.gray : styles.white;

  return (
    <View style={[styles.container, currentTheme.container]}>
      {/* User Info */}
      <View style={styles.userContainer}>
        <Text style={[currentTheme.userName, styles.userName]}>{user.name}</Text>
      </View>

      {/* Create Event */}
      <Card style={[currentTheme.card, styles.card]}>
        <Card.Content>
          <Title style={currentTheme.title}>Create Event</Title>
        </Card.Content>
        <Card.Actions>
          <Button
            icon={() => <Icon name="plus" size={20} color={currentTheme.buttonTextColor} />}
            mode="contained"
            onPress={() => navigation.navigate('Create')}
            style={styles.button}
          >
            Add
          </Button>
        </Card.Actions>
      </Card>

      {/* Show Events */}
      <Card style={[currentTheme.card, styles.card]}>
        <Card.Content>
          <Title style={currentTheme.title}>Show Events</Title>
        </Card.Content>
        <Card.Actions>
          <Button
            icon={() => <Icon name="list" size={20} color={currentTheme.buttonTextColor} />}
            mode="contained"
            onPress={() => navigation.navigate('MyEvents')}
            style={styles.button}
          >
            Show
          </Button>
        </Card.Actions>
      </Card>

      {/* Toggle Button */}
      <View style={styles.switchContainer}>
        <Text style={currentTheme.switchText}>Toggle Theme</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    elevation: 3,
  },
  button: {
    borderRadius: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },

  // White theme styles
  white: {
    container: {
      backgroundColor: '#ffffff',
    },
    userName: {
      color: '#333333',
    },
    card: {
      backgroundColor: '#f5f5f5',
    },
    title: {
      color: '#333333',
    },
    buttonTextColor: '#ffffff',
    switchText: {
      color: '#333333',
    },
  },

  // Dark theme styles
  dark: {
    container: {
      backgroundColor: '#121212',
    },
    userName: {
      color: '#ffffff',
    },
    card: {
      backgroundColor: '#333333',
    },
    title: {
      color: '#ffffff',
    },
    buttonTextColor: '#000000',
    switchText: {
      color: '#ffffff',
    },
  },

  // Gray theme styles
  gray: {
    container: {
      backgroundColor: '#808080',
    },
    userName: {
      color: '#000000',
    },
    card: {
      backgroundColor: '#d3d3d3',
    },
    title: {
      color: '#333333',
    },
    buttonTextColor: '#000000',
    switchText: {
      color: '#333333',
    },
  },
});

export default DashboardScreen;
