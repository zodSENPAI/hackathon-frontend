import { View, Text, StyleSheet, Platform, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import { Button, TextInput } from 'react-native-paper'
import { Toastify, regex, URL } from '../../components/Global'
import axios from 'axios'

const initialState = { name: "", email: "", password: "", confirmPassword: "" }

export default function Register({ navigation }) {

    const { dispatch } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = (name, value) => {
        setState(s => ({ ...s, [name]: value }))
    }

    const handleRegister = () => {
        let { name, email, password, confirmPassword } = state

        if (!name || !email || !password || !confirmPassword) {
            return Toastify("Please Fill all inputs", "error")
        }

        name = name.trim()
        email = email.trim()
        password = password.trim()
        confirmPassword = confirmPassword.trim()

        if (name.length < 3) return Toastify("Please Enter a valid name", "error")
        if (password.length < 6) return Toastify("Password must longer than 6 digits", "error")
        if (confirmPassword !== password) return Toastify("Please enter same password", "error")
        if (!regex.test(email)) {
            return Toastify("Invalid Email Address", "error")
        }

        setIsProcessing(true);
        axios.post(`${URL}/auth/register`, { name, email, password })
            .then((res) => {
                const { data } = res;
                const { message, success } = data;
                if (success) {
                    Toastify(message, "success")
                    navigation.navigate("Login")
                } else {
                    Toastify(message, "error")
                }

            })
            .catch((err) => {
                if (err.response) {
                    const { data } = err.response;
                    const { message } = data;
                    Toastify(message, "error");
                } else {
                    Toastify("An unexpected error occurred", "error");
                }
            })
            .finally(() => {
                setIsProcessing(false)
            })

    }

    return (
        <View style={styles.flexContainer}>
            <Text style={styles.h1}>Register</Text>

            <TextInput style={styles.formControle}
                placeholder="Name"
                mode="outlined"
                label="Full Name"
                theme={{
                    roundness: 20,
                    colors: { primary: '#6200ee', background: '#121212', text: '#ffffff' }
                }}
                onChangeText={val => handleChange("name", val)}
            />
            <TextInput style={styles.formControle}
                placeholder="abc@gmail.com"
                mode="outlined"
                label="Enter your Email"
                theme={{
                    roundness: 20,
                    colors: { primary: '#6200ee', background: '#121212', text: '#ffffff' }
                }}
                keyboardType='email-address'
                onChangeText={val => handleChange("email", val)}
            />

            <TextInput style={styles.formControle}
                placeholder="Password"
                secureTextEntry
                right={<TextInput.Icon icon="eye" />}
                theme={{
                    roundness: 20,
                    colors: { primary: '#6200ee', background: '#121212', text: '#ffffff' }
                }}
                onChangeText={val => handleChange("password", val)}
            />
            <TextInput style={styles.formControle}
                placeholder="Confirm Password"
                secureTextEntry
                right={<TextInput.Icon icon="eye" />}
                theme={{
                    roundness: 20,
                    colors: { primary: '#6200ee', background: '#121212', text: '#ffffff' }
                }}
                onChangeText={val => handleChange("confirmPassword", val)}
            />

            <View style={{ width: "100%" }}>
                <Button mode="contained" loading={isProcessing} disabled={isProcessing} onPress={handleRegister} >Register</Button>
            </View>

            <View style={styles.container}>
                <Text style={styles.text}>Already have an account?</Text>
                <TouchableHighlight
                    style={styles.btn}
                    underlayColor="#6200ee"
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableHighlight>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#121212',
    },
    h1: {
        fontSize: 48,
        color: "#ffffff",
        marginBottom: 16,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 4, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 1,
    },
    formControle: {
        marginBottom: 10,
        width: "100%",
        height: 40,
        backgroundColor: '#121212',
        color: '#ffffff'
    },
    btn: {
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    text: {
        fontSize: 16,
        marginRight: 5,
        color: '#ffffff'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    }
})