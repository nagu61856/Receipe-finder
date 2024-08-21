// edamamApi.js
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
// Replace with your actual Edamam API credentials
const YOUR_APP_ID = '52242f21';
const YOUR_APP_KEY = 'c03550c8706c0637990aa5a62d395a6a';

/**
 * Searches for recipes based on a query using the Edamam API.
 * @param {string} query - The search term to find recipes.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipe objects.
 */
export const searchRecipes = async (query) => {
    try {
        const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`);
        
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Log the fetched data for debugging purposes
        console.log('Fetched data:', data);

        // Return an array of recipe objects
        return data.hits.map(hit => hit.recipe);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
};
