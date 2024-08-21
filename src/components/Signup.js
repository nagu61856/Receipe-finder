// src/components/Signup.js
import { useState } from 'react';
import { auth, googleProvider } from './firebase.config';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            history.push('/login');
        } catch (error) {
            console.error('Error signing up with email:', error);
            alert(`Failed to signup. Error: ${error.message}`);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            history.push('/recipes');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert(`Failed to sign in with Google. Error: ${error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Recipe App</h1>
            <h2 style={styles.title}>Signup</h2>
            <form onSubmit={handleEmailSignup} style={styles.form}>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Signup with Email</button>
            </form>
            <button onClick={handleGoogleSignup} style={styles.googleButton}>Signup with Google</button>
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
        color: '#fff'
    },
    title: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#fff'
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
    },
    googleButton: {
        fontSize: '1rem',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#4285F4',
        color: '#fff',
        cursor: 'pointer',
        marginTop: '10px'
    }
};

export default Signup;
