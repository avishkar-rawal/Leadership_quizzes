document.addEventListener('DOMContentLoaded', () => {
    let barChart = null;
    
    const questions = [
        { id: 1, text: "Supporter", category: "communal" },
        { id: 2, text: "Leader", category: "agentic" },
        { id: 3, text: "Ambitious", category: "agentic" },
        { id: 4, text: "Determined", category: "agentic" },
        { id: 5, text: "Helpful", category: "communal" },
        { id: 6, text: "Dynamic", category: "agentic" },
        { id: 7, text: "Understanding", category: "communal" },
        { id: 8, text: "Compassionate", category: "communal" },
        { id: 9, text: "Assertive", category: "agentic" },
        { id: 10, text: "Sympathetic", category: "communal" },
        { id: 11, text: "Warm", category: "communal" },
        { id: 12, text: "Kind", category: "communal" },
        { id: 13, text: "Controlling", category: "agentic" },
        { id: 14, text: "Caring", category: "communal" },
        { id: 15, text: "Independent", category: "agentic" },
        { id: 16, text: "Dominant", category: "agentic" }
    ];

    const genderBiasForm = document.getElementById('genderBiasForm');
    const resultDiv = document.querySelector('.result');
    const scoreBreakdownDiv = document.getElementById('score-breakdown');
    const questionsDiv = document.getElementById('questions');
    const randomFillBtn = document.getElementById('randomFillBtn');

    function renderQuestions() {
        let questionsHTML = '';
        questions.forEach(q => {
            questionsHTML += `
                <div class="question">
                    <p>${q.id}. ${q.text}</p>
                    <div class="radio-group">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <input type="radio" id="q${q.id}o${i}" name="q${q.id}" value="${i}" required>
                            <label for="q${q.id}o${i}">${i}</label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        questionsDiv.innerHTML = questionsHTML;
    }

    // Add random fill functionality
    randomFillBtn.addEventListener('click', () => {
        questions.forEach(q => {
            const randomValue = Math.floor(Math.random() * 5) + 1; // Random value from 1-5
            const radioButton = document.querySelector(`input[name="q${q.id}"][value="${randomValue}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        });
    });

    genderBiasForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(genderBiasForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Communal characteristics: questions 1, 5, 7, 8, 10, 11, 12, and 14
        const communalScore = answers.q1 + answers.q5 + answers.q7 + answers.q8 + 
                             answers.q10 + answers.q11 + answers.q12 + answers.q14;

        // Agentic characteristics: questions 2, 3, 4, 6, 9, 13, 15, and 16
        const agenticScore = answers.q2 + answers.q3 + answers.q4 + answers.q6 + 
                            answers.q9 + answers.q13 + answers.q15 + answers.q16;

        return {
            'Communal Characteristics': communalScore,
            'Agentic Characteristics': agenticScore
        };
    }

    function getScoreInterpretation(score) {
        if (score >= 33) return 'Strong Value';
        if (score >= 25) return 'Neutral Association';
        return 'Weak Value';
    }

    function getScoreColor(score) {
        if (score >= 33) return '#48bb78';  // Green for strong
        if (score >= 25) return '#f6e05e';  // Yellow for neutral
        return '#f56565';                   // Red for weak
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        let breakdownHTML = '';
        for (const [key, value] of Object.entries(scores)) {
            const interpretation = getScoreInterpretation(value);
            const color = getScoreColor(value);
            let description = '';
            
            if (key === 'Communal Characteristics') {
                description = '<br><em>Traditionally associated with women: caring, supportive, understanding</em>';
            } else {
                description = '<br><em>Traditionally associated with men: assertive, dominant, controlling</em>';
            }
            
            breakdownHTML += `<div class="score-line" style="border-left-color: ${color}"><strong>${key}:</strong> ${value} / 40 (${interpretation})${description}</div>`;
        }

        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function createPatternedBackground(ctx, color, patternType) {
        const canvas = document.createElement('canvas');
        const patternCtx = canvas.getContext('2d');
        canvas.width = 15;
        canvas.height = 15;

        // Set base color with some transparency
        patternCtx.fillStyle = color + '60';
        patternCtx.fillRect(0, 0, 15, 15);

        // Add pattern
        patternCtx.strokeStyle = '#333';
        patternCtx.lineWidth = 1.5;

        if (patternType === 'diagonal') {
            // Diagonal lines for Communal
            patternCtx.beginPath();
            for (let i = -15; i <= 30; i += 6) {
                patternCtx.moveTo(i, 0);
                patternCtx.lineTo(i + 15, 15);
            }
            patternCtx.stroke();
        } else if (patternType === 'cross') {
            // Cross pattern for Agentic
            patternCtx.beginPath();
            for (let x = 4; x < 15; x += 8) {
                for (let y = 4; y < 15; y += 8) {
                    // Vertical line
                    patternCtx.moveTo(x, y - 2);
                    patternCtx.lineTo(x, y + 2);
                    // Horizontal line
                    patternCtx.moveTo(x - 2, y);
                    patternCtx.lineTo(x + 2, y);
                }
            }
            patternCtx.stroke();
        }

        return ctx.createPattern(canvas, 'repeat');
    }

    function renderChart(scores) {
        if (barChart) barChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const labels = Object.keys(scores);
        const data = Object.values(scores);
        const colors = data.map(score => getScoreColor(score));
        
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Leadership Values',
                    data: data,
                    backgroundColor: [
                        createPatternedBackground(ctx, colors[0], 'diagonal'),
                        createPatternedBackground(ctx, colors[1], 'cross')
                    ],
                    borderColor: colors,
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        title: {
                            display: true,
                            text: 'Importance Score (out of 40)',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Leadership Characteristic Types',
                            font: { size: 14, weight: 'bold' }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Gender-Leader Bias Assessment Results',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        labels: {
                            generateLabels: function(chart) {
                                return [
                                    {
                                        text: 'Communal (Diagonal Pattern)',
                                        fillStyle: colors[0],
                                        strokeStyle: colors[0],
                                        lineWidth: 2
                                    },
                                    {
                                        text: 'Agentic (Cross Pattern)', 
                                        fillStyle: colors[1],
                                        strokeStyle: colors[1],
                                        lineWidth: 2
                                    }
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    renderQuestions();
});
