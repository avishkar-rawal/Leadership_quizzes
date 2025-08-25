// quiz3.js

const questions = [
  "I enjoy getting into the details of how things work.",
  "As a rule, adapting ideas to people's needs is easy for me.",
  "I enjoy working with abstract ideas.",
  "Technical things fascinate me.",
  "Being able to understand others is the most important part of my work.",
  "Seeing the big picture comes easy for me.",
  "One of my skills is being good at making things work.",
  "My main concern is to have a supportive communication climate.",
  "I am intrigued by complex organizational problems.",
  "Following directions and filling out forms comes easily for me.",
  "Understanding the social fabric of the organization is important to me.",
  "I would enjoy working out strategies for my organization's growth.",
  "I am good at completing the things I've been assigned to do.",
  "Getting all parties to work together is a challenge I enjoy.",
  "Creating a mission statement is rewarding work.",
  "I understand how to do the basic things required of me.",
  "I am concerned with how my decisions affect the lives of others.",
  "Thinking about organizational values and philosophy appeals to me."
];

const categories = {
  technical: [1, 4, 7, 10, 13, 16],
  human: [2, 5, 8, 11, 14, 17],
  conceptual: [3, 6, 9, 12, 15, 18]
};

// Pre-quiz global variables and Google Sheets integration
const scriptURL = 'https://script.google.com/macros/s/AKfycbyEFAHKPfDgRbtHeAHWbMMg2gtYeJ3USfmn_vTwQwyE4VEHxzaGpMBiy4Et-gL5Gc0r/exec';
let preQuizData = {};
let chartInstance = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing pre-quiz and quiz');

  // Initialize pre-quiz functionality
  initializePreQuiz();
  
  // Quiz initialization
  const container = document.getElementById("questions");
  if (!container) {
    console.error('Questions container not found');
    return;
  }

  questions.forEach((q, i) => {
    const num = i + 1;
    const div = document.createElement("div");
    div.className = "question";

    const questionLabel = document.createElement("label");
    questionLabel.innerHTML = `<strong>${num}.</strong> ${q}`;
    questionLabel.style.marginBottom = "10px";
    div.appendChild(questionLabel);

    const radioGroup = document.createElement("div");
    radioGroup.className = "radio-group";

    [1, 2, 3, 4, 5].forEach((val) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");
      input.type = "radio";
      input.name = `q${num}`;
      input.value = val;
      input.required = true;
      span.textContent = val;

      input.addEventListener('change', function() {
        const allLabels = radioGroup.querySelectorAll('label');
        allLabels.forEach(l => l.classList.remove('checked'));
        if (this.checked) {
          label.classList.add('checked');
        }
      });

      label.appendChild(input);
      label.appendChild(span);
      radioGroup.appendChild(label);
    });

    div.appendChild(radioGroup);
    container.appendChild(div);
  });

  console.log('Quiz questions initialized');
});

function initializePreQuiz() {
  // Checkbox functionality (replacing toggle)
  const professionalCheckbox = document.getElementById('professionalCheckbox');
  const studentCheckbox = document.getElementById('studentCheckbox');
  const studentSections = document.querySelectorAll('.student-section');
  const professionalSections = document.querySelectorAll('.professional-section');

  // Ensure only one checkbox can be selected at a time
  if (professionalCheckbox && studentCheckbox) {
    professionalCheckbox.addEventListener('change', function() {
      if (this.checked) {
        studentCheckbox.checked = false;
        // Show professional sections, hide student sections
        professionalSections.forEach(section => {
          section.style.display = 'block';
          section.style.opacity = '1';
        });
        studentSections.forEach(section => {
          section.style.display = 'none';
          section.style.opacity = '0.5';
        });
        clearStudentFields();
      }
    });

    studentCheckbox.addEventListener('change', function() {
      if (this.checked) {
        professionalCheckbox.checked = false;
        // Show student sections, hide professional sections
        studentSections.forEach(section => {
          section.style.display = 'block';
          section.style.opacity = '1';
        });
        professionalSections.forEach(section => {
          section.style.display = 'none';
          section.style.opacity = '0.5';
        });
        clearProfessionalFields();
      }
    });
  }

  // Submit pre-quiz
  document.getElementById('submitPreQuiz').addEventListener('click', function() {
    if (validatePreQuizForm()) {
      preQuizData = collectPreQuizData();
      showQuizContent();
    }
  });

  // Skip pre-quiz
  document.getElementById('skipPreQuiz').addEventListener('click', function() {
    if (validateUserTypeSelection()) {
      preQuizData = collectPreQuizDataForSkip();
      showQuizContent();
    }
  });

  // Back to pre-quiz
  document.getElementById('backToPreQuizBtn').addEventListener('click', function() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('preQuizForm').style.display = 'block';
  });
}

function validateUserTypeSelection() {
  const professionalCheckbox = document.getElementById('professionalCheckbox');
  const studentCheckbox = document.getElementById('studentCheckbox');
  
  if (!professionalCheckbox.checked && !studentCheckbox.checked) {
    alert('Please choose between Student or Working Professional before proceeding from the top. \n\nYou may skip to the quiz without answering the pre-quiz questions after you choose one of the options.');
    return false;
  }
  return true;
}

function validatePreQuizForm() {
  if (!validateUserTypeSelection()) {
    return false;
  }
  
  const requiredFields = ['age', 'gender', 'country', 'educationLevel', 'fieldOfStudy', 'institutionType', 'leadershipCourses'];
  
  for (let fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      alert(`Please fill in the required field: ${field.previousElementSibling.textContent}`);
      field.focus();
      return false;
    }
  }
  return true;
}

function collectPreQuizData() {
  const isStudent = document.getElementById('studentCheckbox').checked;
  
  return {
    // Common fields
    fullName: document.getElementById('fullName').value.trim() || null,
    age: document.getElementById('age').value || null,
    gender: document.getElementById('gender').value || null,
    genderOther: document.getElementById('genderOther').value.trim() || null,
    country: document.getElementById('country').value.trim() || null,
    email: document.getElementById('email').value.trim() || null,
    phone: document.getElementById('phone').value.trim() || null,
    
    // Education fields
    educationLevel: document.getElementById('educationLevel').value || null,
    fieldOfStudy: document.getElementById('fieldOfStudy').value || null,
    institutionType: document.getElementById('institutionType').value || null,
    leadershipCourses: document.getElementById('leadershipCourses').value || null,
    
    // User type
    userType: isStudent ? 'student' : 'professional',
    
    // Student-specific fields
    howOftenLead: isStudent ? (document.getElementById('howOftenLead').value || null) : null,
    typicalGroupSize: isStudent ? (document.getElementById('typicalGroupSize').value || null) : null,
    groupProjectSuccess: isStudent ? (document.getElementById('groupProjectSuccess').value || null) : null,
    peerRating: isStudent ? (document.getElementById('peerRating').value || null) : null,
    currentGPA: isStudent ? (document.getElementById('currentGPA').value.trim() || null) : null,
    
    // Professional-specific fields
    currentTeamSize: !isStudent ? (document.getElementById('currentTeamSize').value || null) : null,
    teamRetentionRate: !isStudent ? (document.getElementById('teamRetentionRate').value || null) : null,
    projectSuccessRate: !isStudent ? (document.getElementById('projectSuccessRate').value || null) : null,
    industry: !isStudent ? (document.getElementById('industry').value || null) : null,
    companySize: !isStudent ? (document.getElementById('companySize').value || null) : null,
    rolePosition: !isStudent ? (document.getElementById('rolePosition').value || null) : null
  };
}

function collectPreQuizDataForSkip() {
  const isStudent = document.getElementById('studentCheckbox').checked;
  
  return {
    // Common fields - preserve what user entered, null for empty
    fullName: document.getElementById('fullName').value.trim() || null,
    age: document.getElementById('age').value || null,
    gender: document.getElementById('gender').value || null,
    genderOther: document.getElementById('genderOther').value.trim() || null,
    country: document.getElementById('country').value.trim() || null,
    email: document.getElementById('email').value.trim() || null,
    phone: document.getElementById('phone').value.trim() || null,
    
    // Education fields - preserve what user entered, null for empty
    educationLevel: document.getElementById('educationLevel').value || null,
    fieldOfStudy: document.getElementById('fieldOfStudy').value || null,
    institutionType: document.getElementById('institutionType').value || null,
    leadershipCourses: document.getElementById('leadershipCourses').value || null,
    
    // User type - based on checkbox selection (required)
    userType: isStudent ? 'student' : 'professional',
    
    // Student-specific fields - preserve if student selected
    howOftenLead: isStudent ? (document.getElementById('howOftenLead').value || null) : null,
    typicalGroupSize: isStudent ? (document.getElementById('typicalGroupSize').value || null) : null,
    groupProjectSuccess: isStudent ? (document.getElementById('groupProjectSuccess').value || null) : null,
    peerRating: isStudent ? (document.getElementById('peerRating').value || null) : null,
    currentGPA: isStudent ? (document.getElementById('currentGPA').value.trim() || null) : null,
    
    // Professional-specific fields - preserve if professional selected
    currentTeamSize: !isStudent ? (document.getElementById('currentTeamSize').value || null) : null,
    teamRetentionRate: !isStudent ? (document.getElementById('teamRetentionRate').value || null) : null,
    projectSuccessRate: !isStudent ? (document.getElementById('projectSuccessRate').value || null) : null,
    industry: !isStudent ? (document.getElementById('industry').value || null) : null,
    companySize: !isStudent ? (document.getElementById('companySize').value || null) : null,
    rolePosition: !isStudent ? (document.getElementById('rolePosition').value || null) : null
  };
}

function clearStudentFields() {
  const studentFields = ['howOftenLead', 'typicalGroupSize', 'groupProjectSuccess', 'peerRating', 'currentGPA'];
  studentFields.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = '';
  });
}

function clearProfessionalFields() {
  const professionalFields = ['currentTeamSize', 'teamRetentionRate', 'projectSuccessRate', 'industry', 'companySize', 'rolePosition'];
  professionalFields.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.value = '';
  });
}

function generateUID() {
  return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
    (Date.now().toString(36) + Math.random().toString(36).slice(2));
}

function submitToGoogleSheet(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
      console.log('Final data submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting final data:', error);
    });
}

function showQuizContent() {
  document.getElementById('preQuizForm').style.display = 'none';
  document.getElementById('quizContent').style.display = 'block';
}

function calculateScores() {
  console.log('calculateScores function called');

  // Get submit button and disable it to prevent multiple submissions
  const submitButton = document.querySelector('#skillsForm button[type="button"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitButton.textContent = 'Submitted';
  }

  const form = document.getElementById("skillsForm");
  if (!form.checkValidity()) {
    // Re-enable button if form is invalid
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      submitButton.textContent = 'Submit';
    }
    alert("Please answer all questions before submitting.");
    return;
  }

  const formData = new FormData(form);
  let scores = { technical: 0, human: 0, conceptual: 0 };
  
  // Collect individual question responses
  let individualResponses = {};

  for (const [key, val] of formData.entries()) {
    const num = parseInt(key.substring(1));
    const score = parseInt(val);
    
    // Store individual question response
    individualResponses[key] = score;
    
    for (const cat in categories) {
      if (categories[cat].includes(num)) {
        scores[cat] += score;
      }
    }
  }

  console.log('Calculated scores:', scores);
  console.log('Individual responses:', individualResponses);

  // Generate UID and date ONLY at quiz completion
  const finalData = {
    date: new Date().toISOString(), // FIRST field - quiz completion date
    UID: generateUID(), // SECOND field
    ...preQuizData, // All pre-quiz data (filled or null)
    
    // Individual question responses
    ...individualResponses, // This adds q1, q2, q3... q18
    
    // Flattened quiz scores (no nesting) - AFTER individual questions
    quizscore_Technical: scores.technical,
    quizscore_Human: scores.human,
    quizscore_Conceptual: scores.conceptual
  };

  // Log the complete data structure for debugging
  console.log('Final complete data:', JSON.stringify(finalData, null, 2));

  // Submit combined data to Google Sheets - ONLY submission point
  submitToGoogleSheet(finalData);

  // Hide back to pre-quiz button after quiz completion
  const backButton = document.getElementById('backToPreQuizBtn');
  if (backButton) {
    backButton.style.display = 'none';
  }

  // Display numeric scores
  const resultDiv = document.getElementById("results");
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  for (const cat in scores) {
    const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
    scoreDiv.innerHTML += `
      <div class="score-line">
        <strong>${categoryName} skill:</strong> ${scores[cat]} out of 30
      </div>`;
  }
  resultDiv.style.display = "block";

  // Draw radar chart
  console.log('About to draw radar chart');
  drawRadarChart(scores);

  // Show interpretation
  showInterpretation(scores);

  // Scroll into view
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

function drawRadarChart(scores) {
  console.log('drawRadarChart called with scores:', scores);

  const canvas = document.getElementById('radarChart');

  // Check if canvas exists
  if (!canvas) {
    console.error('Canvas element with id "radarChart" not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // Destroy existing chart if it exists
  if (chartInstance) {
    console.log('Destroying existing chart instance');
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Technical', 'Human', 'Conceptual'],
        datasets: [{
          label: 'Leadership Skills',
          data: [scores.technical, scores.human, scores.conceptual],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: window.innerWidth < 768 ? 1.5 : 3, // Thinner border on mobile
          pointBackgroundColor: [
            '#e53e3e', // Red for Technical
            '#38a169', // Green for Human
            '#3182ce'  // Blue for Conceptual
          ],
          pointBorderColor: '#fff',
          pointBorderWidth: window.innerWidth < 768 ? 1.5 : 3, // Thinner border on mobile
          pointRadius: window.innerWidth < 768 ? 4 : 8, // 50% smaller on mobile
          pointHoverRadius: window.innerWidth < 768 ? 6 : 12, // 50% smaller on mobile
          pointHoverBackgroundColor: [
            '#e53e3e', '#38a169', '#3182ce'
          ],
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: window.innerWidth < 768 ? 2 : 4, // Thinner on mobile
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#2d3748',
              font: {
                size: window.innerWidth < 768 ? 12 : 14, // Responsive font size
                weight: '600'
              },
              padding: window.innerWidth < 768 ? 10 : 20 // Responsive padding
            }
          },
          title: {
            display: true,
            text: 'Leadership Skills Radar Chart',
            color: '#2d3748',
            font: {
              size: window.innerWidth < 768 ? 14 : 16, // Responsive font size
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: window.innerWidth < 768 ? 10 : 20 // Responsive padding
            }
          }
        },
        scales: {
          r: {
            beginAtZero: false,
            min: 6,
            max: 30,
            ticks: {
              stepSize: 6,
              display: true,
              backdropColor: 'rgba(255, 255, 255, 0.9)',
              color: '#4a5568',
              font: {
                size: window.innerWidth < 768 ? 10 : 12, // Responsive font size
                weight: '600'
              }
            },
            grid: {
              display: true,
              color: 'rgba(102, 126, 234, 0.2)',
              lineWidth: 2
            },
            angleLines: {
              display: true,
              color: 'rgba(102, 126, 234, 0.3)',
              lineWidth: 2
            },
            pointLabels: {
              display: true,
              font: {
                size: window.innerWidth < 768 ? 10 : 14, // Responsive font size
                weight: 'bold'
              },
              color: '#2d3748',
              padding: window.innerWidth < 768 ? 5 : 10 // Responsive padding
            }
          }
        },
        elements: {
          line: {
            borderWidth: window.innerWidth < 768 ? 1 : 2 // Thinner lines on mobile
          },
          point: {
            radius: window.innerWidth < 768 ? 3 : 6, // 50% smaller on mobile
            hoverRadius: window.innerWidth < 768 ? 4 : 8 // 50% smaller on mobile
          }
        }
      }
    });

    console.log('Radar chart created successfully', chartInstance);

    // Force a resize to ensure proper rendering
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    }, 100);

  } catch (error) {
    console.error('Error creating radar chart:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

function showInterpretation(scores) {
  const highestScore = Math.max(...Object.values(scores));
  const highestSkill = Object.keys(scores).find(
    (key) => scores[key] === highestScore
  );

  const interpretations = {
    technical:
      "You excel at technical skills - working with details, understanding how things work, and completing assigned tasks. You prefer concrete, hands-on approaches to leadership.",
    human:
      "You excel at human skills - understanding others, building supportive climates, and bringing people together. You focus on the interpersonal aspects of leadership.",
    conceptual:
      "You excel at conceptual skills - seeing the big picture, working with abstract ideas, and strategic thinking. You approach leadership from a visionary perspective."
  };

  const interpretationDiv = document.getElementById("interpretation");
  const nameCap = highestSkill.charAt(0).toUpperCase() + highestSkill.slice(1);
  interpretationDiv.innerHTML = `
    <h3>Your Leadership Skills Profile</h3>
    <div style="margin: 15px 0; padding: 15px; background-color: #e8f5e8; border-left: 4px solid #28a745; border-radius: 5px;">
      <strong>Your Strongest Skill Area: ${nameCap} Skills (${highestScore}/30)</strong><br><br>
      ${interpretations[highestSkill]}
    </div>
    <h4>Understanding Your Scores:</h4>
    <ul>
      <li><strong>Technical Skills:</strong> Working with things and procedures</li>
      <li><strong>Human Skills:</strong> Working with people and relationships</li>
      <li><strong>Conceptual Skills:</strong> Working with ideas and concepts</li>
    </ul>
    <p><em>All three skill areas are important for effective leadership. Your profile shows your natural strengths and areas for potential development.</em></p>
  `;
}
