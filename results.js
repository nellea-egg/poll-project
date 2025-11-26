// results.js

const resultsContainer = document.getElementById('results-container');
const pollContainer = document.getElementById('poll-container');
let chartInstance = null; // To hold the Chart.js instance

/**
 * Fetches the poll results and draws a chart.
 * @param {string} finalTruthMessage - The message to display if the poll is closed.
 */
function displayResultsChart(finalTruthMessage = false) {
    console.log("--- RESULTS CHART FUNCTION STARTED ---"); // CHECKPOINT 1
    // Hide the doodle poll container
    if (pollContainer) {
        console.log("POLL CONTAINER FOUND. HIDING."); // CHECKPOINT 2
        pollContainer.style.display = 'none';
    } else {
        console.log("ERROR: pollContainer IS NULL."); // If this appears, the element wasn't found
    }
    // Show the chart container
    if (resultsContainer) {
        console.log("RESULTS CONTAINER FOUND. SHOWING."); // CHECKPOINT 3
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = ''; 
    } else {
        console.log("ERROR: resultsContainer IS NULL.");
    }
        // CRITICAL FIX: Re-create the canvas element here
        const canvas = document.createElement('canvas');
        canvas.id = 'voteChart';
        resultsContainer.appendChild(canvas);
    }

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
                truthElement.style.fontFamily = "'Permanent Marker', cursive";
                truthElement.style.color = '#d90429'; 
                truthElement.style.textAlign = 'center';
                // Prepend the message before the canvas
                resultsContainer.insertBefore(truthElement, canvas);
            }
            
            const labels = options.map(option => option); // Use options directly for labels
            const dataValues = options.map(option => counts[option]); // Get vote counts for data

            // 2. Destroy old chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }

            // 3. Create the new chart
            const ctx = document.getElementById('voteChart').getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'bar', // Using bar chart as it's cleaner than pie for multi-option polls
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
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true
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
}
