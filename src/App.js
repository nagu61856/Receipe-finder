// src/App.js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Recipes from './components/Recipes'; // Import your Recipes component

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/recipes" component={Recipes} />
                <Route path="/" exact component={Signup} /> {/* Redirect to Signup if needed */}
            </Switch>
        </Router>
    );
}

export default App;
