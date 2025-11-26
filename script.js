// ====================================================================================
// --- CONFIGURATION: REPLACE THESE PLACEHOLDERS WITH YOUR GOOGLE FORM IDs ---
// ====================================================================================

// 1. The full URL where your form sends data (the 'action' URL from the form tag inspection)
const GOOGLE_FORM_SUBMISSION_ENDPOINT = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc29vQXI5DAWWEfuivKYAah4PLYV6f8NO1WUp7vl-1PPs39Dg/formResponse'

// 2. The unique ID for the question field (e.g., 'entry.1234567890')
const GOOGLE_FORM_FIELD_ID = 'entry.898720741'; 

// 3. IMPORTANT: Update this value on the 1st of every month! 
// We use 'window.' to guarantee this variable is accessible in sketch.js
window.CURRENT_MONTH_ID = '2025-11'; 

// 4. The URL for your Google Apps Script Web App (API for results)
const RESULTS_API_URL = 'https://script.google.com/macros/s/AKfycbws8aBo5C_CU2dyLT6JgqhCj-OBbcTtjT4334bwxfvGN7x4R5iP4TQugWyyTOMIP28VeA/exec';

// ====================================================================================
// --- CORE LOGIC ---
// ====================================================================================

// These constants are kept global for use by the submitVote function and sketch.js
const container = document.getElementById('poll-container');
const storageKey = `voted_for_${window.CURRENT_MONTH_ID}`; // Use window.CURRENT_MONTH_ID


/**
 * Submits the vote data to Google Forms and sets the local storage flag.
 * This function is called directly by the mousePressed() function in sketch.js.
 * @param {string} voteValue - The value of the option selected by the user.
 */
function submitVote(voteValue) {
    // 1. Prepare form data
    const formData = new FormData();
    formData.append(GOOGLE_FORM_FIELD_ID, voteValue); 

    // 2. Submit the data to Google Forms using the Fetch API
    fetch(GOOGLE_FORM_SUBMISSION_ENDPOINT, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Crucial for Google Forms to allow cross-site submission
    })
    .then(() => {
        // 3. Submission successful (or at least sent), set the single-vote flag
        localStorage.setItem(storageKey, 'true');
    })
    .catch(error => {
        console.error('Error submitting vote:', error);
        alert('There was a problem submitting. Please check your connection.');
    });
}

