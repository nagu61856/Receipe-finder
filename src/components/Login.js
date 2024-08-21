// src/components/Login.js
import { useState } from 'react';
import { auth } from './firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/recipes'); // Redirect to recipes page after successful login
        } catch (error) {
            console.error('Error signing in: ', error);
            alert('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Recipe App</h1>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#28a745', // Green background color
        padding: '20px'
    },
    heading: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#fff' // White text color for contrast
    },
    title: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#fff' // White text color for contrast
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
    },
    input: {
        fontSize: '1rem',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px'
    },
    button: {
        fontSize: '1rem',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer'
    }
};

export default Login;
