// results.js

const resultsContainer = document.getElementById('results-container');
const pollContainer = document.getElementById('poll-container');
let chartInstance = null; // To hold the Chart.js instance

/**
 * Fetches the poll results and draws a chart.
 * @param {string} finalTruthMessage - The message to display if the poll is closed.
 */
function displayResultsChart(finalTruthMessage = false) {
    // Hide the doodle poll container
    if (pollContainer) {
        pollContainer.style.display = 'none';
    }
    // Show the chart container
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = ''; // Clear previous content
    }

    fetch(RESULTS_API_URL)
        .then(response => response.json())
        .then(data => {
            const counts = data.currentMonth.counts;
            const options = data.currentMonth.options;
            
            // If the final truth message is available, display it prominently
            if (finalTruthMessage) {
                const truthElement = document.createElement('h2');
                truthElement.innerHTML = finalTruthMessage;
                truthElement.style.fontFamily = "'Permanent Marker', cursive";
                truthElement.style.color = '#d90429'; 
                truthElement.style.textAlign = 'center';
                resultsContainer.appendChild(truthElement);
            }
            
            const labels = options.map(option => option.replace(/ \(.+\)/g, ''));
            const chartData = options.map(option => counts[option]);
            
            drawChart(labels, chartData, data.totalVotes);
        })
        .catch(error => {
            console.error('Error fetching results:', error);
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p>Sorry, could not load live results.</p>';
            }
        });
}

/**
 * Draws the Chart.js Bar Chart.
 */
function drawChart(labels, data, totalVotes) {
    const ctx = document.getElementById('voteChart').getContext('2d');
    
    // Destroy previous chart instance if it exists (for mobile resizing/re-draw)
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar', // A bar chart is usually best for poll results
        data: {
            labels: labels,
            datasets: [{
                label: `Votes (Total: ${totalVotes})`,
                data: data,
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
                    // Ensure only whole numbers are displayed for vote counts
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
                    text: 'Live Poll Results'
                }
            }
        }
    });
}
