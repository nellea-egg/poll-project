// results.js

const resultsContainer = document.getElementById('results-container');
const pollContainer = document.getElementById('poll-container');
let chartInstance = null; // To hold the Chart.js instance

/**
 * Fetches the poll results and draws a chart.
 * @param {string} finalTruthMessage - The message to display if the poll is closed.
 */
function displayResultsChart(finalTruthMessage = false) {
    console.log("--- RESULTS CHART FUNCTION STARTED ---");

    // Check 1: Ensure we can find the containers first
    if (!pollContainer || !resultsContainer) {
        console.error("FATAL ERROR: HTML containers not found. Check index.html IDs.");
        return; // Stop execution if containers are missing
    }

    // Hide the doodle poll container
    pollContainer.style.display = 'none';

    // Show the chart container and prepare it
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = ''; 

    // CRITICAL FIX: Re-create the canvas element here
    const canvas = document.createElement('canvas');
    canvas.id = 'voteChart';
    resultsContainer.appendChild(canvas);
    
    // NOTE: The missing brace from the previous step is now corrected,
    // and the function continues from here.

    fetch(RESULTS_API_URL)
        .then(response => response.json())
        .then(data => {
            const counts = data.currentMonth.counts;
            const options = data.currentMonth.options;
            const totalVotes = data.totalVotes;
            
            // If the final truth message is available, display it prominently
            if (finalTruthMessage) {
                const truthElement = document.createElement('h2');
                truthElement.innerHTML = finalTruthMessage;
                
                // --- STYLING FIXES (Smaller, less bold) ---
                truthElement.style.fontFamily = "'Caveat', cursive"; 
                truthElement.style.color = '#333'; // Dark gray
                truthElement.style.fontSize = '2.5em'; 
                truthElement.style.textAlign = 'center';
                
                // Prepend the message before the canvas
                resultsContainer.insertBefore(truthElement, canvas);
            }
            
            const labels = options.map(option => option);
            const dataValues = options.map(option => counts[option]);

            // 2. Destroy old chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }

            // 3. Create the new chart
            const ctx = document.getElementById('voteChart').getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'pie', // <-- FIX: Changed from 'bar' to 'pie'
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Votes (Total: ${totalVotes})`,
                        data: dataValues,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',  
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true, // <-- FIX: Changed to true to prevent expansion
                    
                    // The 'scales' block must be deleted for pie charts! 
                    // It causes errors and is unnecessary.
                    
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                // Forcing separation by increasing the box size and padding
                                boxWidth: 30, 
                                padding: 20, 
                                // 3. Legend Text Size Increase
                                font: {
                                    size: 14 // Increased size
                                }
                        },
                            datalabels:{
                                formatter: (value, context) => {
                                // Display the raw count (the 'value' is the vote count)
                                return value; 
                            },
                            color: '#fff', // White text
                            textShadowBlur: 4,
                            textShadowColor: 'black', // Black shadow for contrast on light colors
                            font: {
                                weight: 'bold',
                                size: 16 // Make the numbers stand out
                            }
                        },
                                
                        title: {
                            display: true,
                            text: 'Community Poll Results'
                        }
                    }
                }
            });

        })
        .catch(error => {
            console.error('Error loading live results:', error);
            // Display a user-friendly error message
            resultsContainer.innerHTML = `<h2 style="font-family: 'Permanent Marker'; color: red; text-align: center;">Sorry, could not load live results. Will work on it!.</h2>`;
        });
} // <-- This is the only final brace closing the function.
