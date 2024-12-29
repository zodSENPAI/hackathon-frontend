import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button, TextInput } from 'react-native-paper';
import { regex, storeData, Toastify, URL } from '../../components/Global';
import axios from 'axios';

const initialState = { email: "", password: "" };

export default function Login({ navigation }) {
    const { dispatch } = useAuthContext();
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (name, value) => {
        setState(s => ({ ...s, [name]: value }));
    };

    const handleLogin = () => {
        let { email, password } = state;

        if (!email || !password) {
            return Toastify("Please Fill all inputs", "error");
        }

        email = email.trim();
        password = password.trim();

        if (!regex.test(email)) {
            return Toastify("Invalid Email Address", "error");
        }

        setIsProcessing(true);
        axios.post(`${URL}/auth/login`, { email, password })
            .then((res) => {
                const { data } = res;
                const { message, success, jwtToken, user } = data;
                if (success) {
                    Toastify(message, "success");
                    dispatch({ action: "SET_LOGED_IN", payload: { user } });
                    storeData("jwtToken", jwtToken);
                } else {
                    Toastify(message, "error");
                }
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data;
                    Toastify(message, "error");
                } else {
                    Toastify("An unexpected error occurred", "error");
                }
            })
            .finally(() => setIsProcessing(false));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="abc@gmail.com"
                mode="outlined"
                label="Email"
                keyboardType='email-address'
                onChangeText={val => handleChange("email", val)}
                theme={{ colors: { primary: '#4A4A4A' } }}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                label="Password"
                onChangeText={val => handleChange("password", val)}
                theme={{ colors: { primary: '#4A4A4A' } }}
            />
            <Button
                mode="contained"
                loading={isProcessing}
                disabled={isProcessing}
                onPress={handleLogin}
                style={styles.button}
            >
                Login
            </Button>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.registerButton}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#121212', // Dark mode background
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for dark mode
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: '#1E1E1E', // Dark input background
        color: '#FFFFFF',
    },
    button: {
        width: '100%',
        backgroundColor: '#1d3557',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    registerText: {
        color: '#A0A0A0',
    },
    registerButton: {
        color: 'white',
        marginLeft: 5,
    }
});
