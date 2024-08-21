import { db } from './firebase.config';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { searchRecipes } from '../utils/edamamApi'; // Import the search function

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [form, setForm] = useState({
        title: '',
        desc: '',
        ingredients: [],
        steps: []
    });
    const [popupActive, setPopupActive] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const recipesCollectionRef = collection(db, 'recipes');

    useEffect(() => {
        const unsubscribe = onSnapshot(recipesCollectionRef, snapshot => {
            setRecipes(snapshot.docs.map(doc => ({
                id: doc.id,
                viewing: false,
                ...doc.data()
            })));
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleView = (id) => {
        const recipesClone = recipes.map(recipe => ({
            ...recipe,
            viewing: recipe.id === id ? !recipe.viewing : false
        }));
        setRecipes(recipesClone);
    };

    const handleSearchView = (index) => {
        const searchResultsClone = searchResults.map((result, i) => ({
            ...result,
            viewing: i === index ? !result.viewing : false
        }));
        setSearchResults(searchResultsClone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.desc || !form.ingredients.length || !form.steps.length) {
            alert('Please fill out all fields');
            return;
        }
        await addDoc(recipesCollectionRef, form);
        setForm({ title: '', desc: '', ingredients: [], steps: [] });
        setPopupActive(false);
    };

    const handleIngredient = (e, i) => {
        const ingredientsClone = [...form.ingredients];
        ingredientsClone[i] = e.target.value;
        setForm({ ...form, ingredients: ingredientsClone });
    };

    const handleStep = (e, i) => {
        const stepsClone = [...form.steps];
        stepsClone[i] = e.target.value;
        setForm({ ...form, steps: stepsClone });
    };

    const handleIngredientCount = () => {
        setForm({ ...form, ingredients: [...form.ingredients, ''] });
    };

    const handleStepCount = () => {
        setForm({ ...form, steps: [...form.steps, ''] });
    };

    const removeRecipe = async (id) => {
        await deleteDoc(doc(db, 'recipes', id));
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        if (searchQuery.length > 2) {
            try {
                const results = await searchRecipes(searchQuery);
                setSearchResults(results.map(result => ({ ...result, viewing: false })));
            } catch (error) {
                console.error('Search error:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>My Recipes</h1>
            <div style={styles.searchBar}>
                <input 
                    type="text" 
                    placeholder="Search Recipes..." 
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    style={styles.input}
                />
                <button onClick={handleSearch} style={styles.searchButton}>Search</button>
            </div>
            <div style={styles.searchResults}>
                {searchResults.map((result, i) => (
                    <div key={i} style={styles.searchResult}>
                        <h3>{result.label}</h3>
                        <p>{result.source}</p>
                        <img src={result.image} alt={result.label} style={styles.image} />
                        <button onClick={() => handleSearchView(i)} style={styles.viewButton}>
                            {result.viewing ? 'Hide Details' : 'View Details'}
                        </button>
                        {result.viewing && (
                            <div style={styles.recipeDetails}>
                                <h4>Ingredients</h4>
                                <ul>
                                    {result.ingredientLines.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                                <h4>Instructions</h4>
                                <p>{result.url}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={() => setPopupActive(!popupActive)} style={styles.addButton}>Add Recipe</button>

            <div style={styles.recipeList}>
                {recipes.map((recipe) => (
                    <div style={styles.recipe} key={recipe.id}>
                        <h3>{recipe.title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>

                        {recipe.viewing && (
                            <div>
                                <h4>Ingredients</h4>
                                <ul>
                                    {recipe.ingredients.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                    ))}
                                </ul>
                                <h4>Steps</h4>
                                <ol>
                                    {recipe.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <div style={styles.buttons}>
                            <button onClick={() => handleView(recipe.id)} style={styles.viewButton}>
                                View {recipe.viewing ? 'less' : 'more'}
                            </button>
                            <button onClick={() => removeRecipe(recipe.id)} style={styles.removeButton}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {popupActive && (
                <div style={styles.popup}>
                    <div style={styles.popupInner}>
                        <h2>Add a New Recipe</h2>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    style={styles.formInput}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    value={form.desc}
                                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                                    style={styles.formTextarea}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label>Ingredients</label>
                                {form.ingredients.map((ingredient, i) => (
                                    <input
                                        type="text"
                                        key={i}
                                        value={ingredient}
                                        onChange={(e) => handleIngredient(e, i)}
                                        style={styles.formInput}
                                    />
                                ))}
                                <button type="button" onClick={handleIngredientCount} style={styles.addButton}>
                                    Add Ingredient
                                </button>
                            </div>
                            <div style={styles.formGroup}>
                                <label>Steps</label>
                                {form.steps.map((step, i) => (
                                    <input
                                        type="text"
                                        key={i}
                                        value={step}
                                        onChange={(e) => handleStep(e, i)}
                                        style={styles.formInput}
                                    />
                                ))}
                                <button type="button" onClick={handleStepCount} style={styles.addButton}>
                                    Add Step
                                </button>
                            </div>
                            <div style={styles.formGroup}>
                                <button type="submit" style={styles.submitButton}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundImage: 'url(/images.jpeg)',
        backgroundSize: 'cover', // Ensures the image covers the entire element
        backgroundPosition: 'center', // Centers the image within the element
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        backgroundAttachment: 'fixed', // Keeps the background image fixed during scrolling (optional)
        color: 'green', // Adjust text color for better contrast against the background
        minHeight: '100vh', // Ensure the container covers the full viewport height
    },
    heading: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#343a40',
    },
    searchBar: {
        display: 'flex',
        marginBottom: '20px',
        backgroundColor: '#ffffff', // White background for search bar
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginRight: '10px',
    },
    searchButton: {
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    searchResults: {
        marginBottom: '20px',
    },
    searchResult: {
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    image: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '4px',
    },
    viewButton: {
        marginTop: '10px',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
    },
    recipeDetails: {
        marginTop: '10px',
    },
    addButton: {
        marginTop: '20px',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'green',
        cursor: 'pointer',
    },
    recipeList: {
        marginTop: '20px',
    },
    recipe: {
        padding: '20px',
        marginBottom: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    buttons: {
        marginTop: '10px',
    },
    removeButton: {
        marginLeft: '10px',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#dc3545',
        color: '#fff',
        cursor: 'pointer',
    },
    popup: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popupInner: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '600px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '10px',
    },
    formInput: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '5px',
    },
    formTextarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '5px',
        height: '100px',
    },
    submitButton: {
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default Recipes;
