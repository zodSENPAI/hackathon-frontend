import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { getData, Toastify, URL } from '../../components/Global';
import axios from 'axios';
import { useAuthContext } from '../../contexts/AuthContext';

const initialState = { title: "", description: "", location: "", category: "" };

export default function Create({ navigation }) {

    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const {user} = useAuthContext()

    const handleChange = (name, value) => {
        setState(s => ({ ...s, [name]: value }));
    };

    const handleAddEvent = () => {
        let { title, description, location, category } = state;

        if (!title || !description || !location ) {
            return Toastify("Please fill all inputs", "error");
        }

        title = title.trim();
        description = description.trim();
        location = location.trim();
    

        if (title.length < 3) return Toastify("Title must be at least 3 characters", "error");
        if (description.length < 10) return Toastify("Description must be at least 10 characters", "error");
    
        const {_id} = user
        const uid = _id

        let event = {
            uid,
            title,
            location,
            description,
        }

        axios.post(`${URL}/create`, event)
            .then((res) =>{
                const {data} =res
                const {message} = data
                Toastify(message,"success" )
            })
            .catch((err) =>{
                if(err.response) {
                    const { data } = err.response;
                    const { message } = data;
                    Toastify(message, "error");
                } else {
                    Toastify("An unexpected error occurred", "error");
                }
            })
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Create New Event</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput 
                    style={styles.inputField}
                    placeholder="Event Title"
                    mode="outlined"
                    label="Title"
                    onChangeText={val => handleChange("title", val)}
                />
                <TextInput 
                    style={styles.inputField}
                    placeholder="Event Description"
                    mode="outlined"
                    label="Description"
                    multiline
                    numberOfLines={4}
                    onChangeText={val => handleChange("description", val)}
                />
                <TextInput 
                    style={styles.inputField}
                    placeholder="Event Location"
                    mode="outlined"
                    label="Location"
                    onChangeText={val => handleChange("location", val)}
                />
                <Button 
                    mode="contained"
                    loading={isProcessing} 
                    disabled={isProcessing} 
                    style={styles.submitButton}
                    onPress={handleAddEvent}
                >
                    Add Event
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff', // White background for the screen
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000', // Black text for header
    },
    formContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f1f1f1', // Light gray background for form container
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    inputField: {
        marginBottom: 15,
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: '#000000', // Black button background
    },
});
