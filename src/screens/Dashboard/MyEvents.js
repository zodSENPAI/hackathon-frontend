// Frontend Code (MyEvents.js)
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Modal } from 'react-native';
import { Card, Title, Paragraph, Text, IconButton, TextInput, Button } from 'react-native-paper';
import { Toastify, URL } from '../../components/Global';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthContext } from '../../contexts/AuthContext';

const MyEvents = () => {
    const { user } = useAuthContext();
    const [events, setEvents] = useState([]);
    const [filterEvents, setFilterEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedLocation, setUpdatedLocation] = useState('');

    useEffect(() => {
        axios.get(`${URL}/read`)
            .then((res) => {
                const { data } = res;
                setEvents(data);
                setFilterEvents(data);
            })
            .catch((err) => {
                console.error("Error", err);
            });
    }, []);

    const handleEdit = (event) => {
        setEditingEvent(event);
        setUpdatedTitle(event.title);
        setUpdatedDescription(event.description);
        setUpdatedLocation(event.location);
    };

    const handleUpdate = () => {
        const updatedEvent = { ...editingEvent, title: updatedTitle, description: updatedDescription, location: updatedLocation };
        axios.post(`${URL}/update`, updatedEvent)
            .then((res) => {
                Toastify(res.data, "success");
                setFilterEvents(prev => prev.map(evt => evt._id === updatedEvent._id ? updatedEvent : evt));
                setEditingEvent(null);
            })
            .catch((err) => console.error("Error", err));
    };

    const handleDelete = (event) => {
        axios.post(`${URL}/delete`, event)
            .then((res) => {
                Toastify(res.data, "success");
                setFilterEvents(prev => prev.filter(doc => doc._id !== event._id));
            })
            .catch((err) => console.error("Error", err));
    };

    const handlesearch = (search) => {
        const searchData = search.toLowerCase();
        setFilterEvents(events.filter(doc => doc.title.toLowerCase().includes(searchData)));
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.h1}>Your Events</Text>
                <TextInput
                    style={styles.formControle}
                    placeholder="Search by Title"
                    mode="outlined"
                    label="Search"
                    theme={{ roundness: 20 }}
                    onChangeText={handlesearch}
                />
                {filterEvents
                    .filter(event => event.uid === user._id)
                    .map((event) => (
                        <Card key={event._id} style={styles.card}>
                            <Card.Content>
                                <Title>{event.title}</Title>
                                <Text style={styles.location}>{event.location}</Text>
                                <Paragraph>{event.description}</Paragraph>
                                <View style={styles.buttonContainer}>
                                    <IconButton
                                        icon={() => <Icon name="edit" size={20} color="#6200ee" />}
                                        onPress={() => handleEdit(event)}
                                        style={styles.button}
                                    />
                                    <IconButton
                                        icon={() => <Icon name="delete" size={20} color="#d32f2f" />}
                                        onPress={() => handleDelete(event)}
                                        style={styles.button}
                                    />
                                </View>
                            </Card.Content>
                        </Card>
                    ))}
            </ScrollView>

            {editingEvent && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!editingEvent}
                    onRequestClose={() => setEditingEvent(null)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Event</Text>
                        <TextInput
                            style={styles.formControle}
                            label="Title"
                            value={updatedTitle}
                            onChangeText={setUpdatedTitle}
                        />
                        <TextInput
                            style={styles.formControle}
                            label="Description"
                            value={updatedDescription}
                            onChangeText={setUpdatedDescription}
                        />
                        <TextInput
                            style={styles.formControle}
                            label="Location"
                            value={updatedLocation}
                            onChangeText={setUpdatedLocation}
                        />
                        <Button mode="contained" onPress={handleUpdate}>Save Changes</Button>
                        <Button mode="text" onPress={() => setEditingEvent(null)}>Cancel</Button>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    h1: {
        fontSize: 48,
        color: "black",
        marginBottom: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#ffffff',
        elevation: 3,
    },
    location: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        padding: 0,
    },
    formControle: {
        marginBottom: 10,
        width: "100%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
});

export default MyEvents;

// Backend Code (index.js)

