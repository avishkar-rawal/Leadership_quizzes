// quiz1.js

const questions = [
  "When I think of leadership, I think of a person with special personality traits.",
  "Much like playing the piano or tennis, leadership is a learned ability.",
  "Leadership requires knowledge and know-how.",
  "Leadership is about what people do rather than who they are.",
  "Followers can influence the leadership process as much as leaders.",
  "Leadership is about the process of influencing others.",
  "Some people are born to be leaders.",
  "Some people have the natural ability to be leaders.",
  "The key to successful leadership is having the right skills.",
  "Leadership is best described by what leaders do.",
  "Leaders and followers share in the leadership process.",
  "Leadership is a series of actions directed toward positive ends.",
  "A person needs to have certain traits to be an effective leader.",
  "Everyone has the capacity to be a leader.",
  "Effective leaders are competent in their roles.",
  "The essence of leadership is performing tasks and dealing with people.",
  "Leadership is about the common purposes of leaders and followers.",
  "Leadership does not rely on the leader alone but is a process involving the leader, followers, and the situation.",
  "People become great leaders because of their traits.",
  "People can develop the ability to lead.",
  "Effective leaders have competence and knowledge.",
  "Leadership is about how leaders work with people to accomplish goals.",
  "Effective leadership is best explained by the leader–follower relationship.",
  "Leaders influence and are influenced by followers.",
];

const categories = {
  trait: [1, 7, 13, 19],
  ability: [2, 8, 14, 20],
  skill: [3, 9, 15, 21],
  behavior: [4, 10, 16, 22],
  relationship: [5, 11, 17, 23],
  process: [6, 12, 18, 24],
};

// Pre-quiz global variables and Google Sheets integration
const scriptURL = 'https://script.google.com/macros/s/AKfycbwuTCW7sO4LA4SDnX6UhE-1AC6mY4WP1QTbSnVeB_rRIhAD9-wtncY5C05HQi1Z9a2f/exec';
let preQuizData = {}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing pre-quiz and quiz');

  // Initialize pre-quiz functionality
  initializePreQuiz();
  
  // Initialize modal functionality
  initializeModal();
  
  // Initialize quiz questions (existing code)
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
      input.required = true; // each question is mandatory
      span.textContent = val;

      // Add event listener to handle checked state
      input.addEventListener('change', function() {
        // Remove checked class from all labels in this group
        const allLabels = radioGroup.querySelectorAll('label');
        allLabels.forEach(l => l.classList.remove('checked'));

        // Add checked class to the selected label
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

  // Style the checkbox labels
  const checkboxLabels = document.querySelectorAll('.user-type label');
  checkboxLabels.forEach(label => {
    label.style.cssText = `
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: 10px;
      font-size: 16px;
      color: #2d3748;
    `;
  });

  // Style the checkboxes
  const checkboxes = document.querySelectorAll('.user-type input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.style.cssText = `
      margin-right: 10px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #667eea;
    `;
  });

  // Submit pre-quiz
  document.getElementById('submitPreQuiz').addEventListener('click', function() {
    if (validatePreQuizForm()) {
      preQuizData = collectPreQuizData();
      // NO Google Sheets submission here
      showQuizContent();
    }
  });

  // Skip pre-quiz - now requires user type selection and preserves partial data
  document.getElementById('skipPreQuiz').addEventListener('click', function() {
    if (validateUserTypeSelection()) {
      preQuizData = collectPreQuizDataForSkip();
      // NO Google Sheets submission here
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
    alert('Please choose between Student or Working Professional on top before proceeding. \n\nYou may skip to the quiz without answering the pre-quiz questions after you choose one of the opitons.');
    return false;
  }
  return true;
}

function validatePreQuizForm() {
  // First check user type selection
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
    // NO UID or timestamp here - generated only at quiz completion
    
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

// Create data structure preserving partial data for skipped pre-quiz
function collectPreQuizDataForSkip() {
  const isStudent = document.getElementById('studentCheckbox').checked;
  
  return {
    // NO UID or timestamp here - generated only at quiz completion
    
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

let chartInstance = null;
let modalChartInstance = null; // Add modal chart instance

function calculateScores() {
  console.log('calculateScores function called');

  // Get submit button and disable it to prevent multiple submissions
  const submitButton = document.querySelector('#leadershipForm button[type="button"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitButton.textContent = 'Submitted';
  }

  const form = document.getElementById("leadershipForm");
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
  let scores = {
    trait: 0,
    ability: 0,
    skill: 0,
    behavior: 0,
    relationship: 0,
    process: 0,
  };

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

  // Generate UID and timestamp ONLY at quiz completion
  const finalData = {
    date: new Date().toISOString(), // FIRST field - quiz completion date
    UID: generateUID(), // SECOND field
    ...preQuizData, // All pre-quiz data (filled or null)
    
    // Individual question responses
    ...individualResponses, // This adds q1, q2, q3... q24
    
    // Flattened quiz scores (no nesting) - AFTER individual questions
    quizscore_Trait: scores.trait,
    quizscore_Ability: scores.ability,
    quizscore_Skill: scores.skill,
    quizscore_Behavior: scores.behavior,
    quizscore_Relationship: scores.relationship,
    quizscore_Process: scores.process
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
        <strong>${categoryName} emphasis:</strong> ${scores[cat]} out of 20
      </div>`;
  }
  resultDiv.style.display = "block";

  // Draw radar chart
  console.log('About to draw radar chart');
  drawRadarChart(scores);

  // Remove this line since we're removing the modal button
  // const modalBtn = document.getElementById('openModalBtn');
  // if (modalBtn) {
  //   modalBtn.style.display = 'inline-block';
  // }

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
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    // Remove explicit canvas sizing - let CSS handle it

    chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Trait', 'Ability', 'Skill', 'Behavior', 'Relationship', 'Process'],
        datasets: [{
          label: 'Leadership Dimensions',
          data: [
            scores.trait,
            scores.ability,
            scores.skill,
            scores.behavior,
            scores.relationship,
            scores.process
          ],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: window.innerWidth < 768 ? 1.5 : 3, // Thinner border on mobile
          pointBackgroundColor: [
            '#e53e3e', // Red for Trait
            '#38a169', // Green for Ability
            '#3182ce', // Blue for Skill
            '#d69e2e', // Yellow for Behavior
            '#805ad5', // Purple for Relationship
            '#dd6b20'  // Orange for Process
          ],
          pointBorderColor: '#fff',
          pointBorderWidth: window.innerWidth < 768 ? 1.5 : 3, // Thinner border on mobile
          pointRadius: window.innerWidth < 768 ? 4 : 8, // 50% smaller on mobile
          pointHoverRadius: window.innerWidth < 768 ? 6 : 12, // 50% smaller on mobile
          pointHoverBackgroundColor: [
            '#e53e3e', '#38a169', '#3182ce', '#d69e2e', '#805ad5', '#dd6b20'
          ],
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: window.innerWidth < 768 ? 2 : 4, // Thinner on mobile
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // Changed to true for better mobile behavior
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
            text: 'Leadership Dimensions Radar Chart',
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
            min: 4,
            max: 20,
            ticks: {
              stepSize: 4,
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
  }
}

// Add window resize listener to handle responsive updates
window.addEventListener('resize', function() {
  if (chartInstance) {
    // Redraw chart with responsive settings on window resize
    setTimeout(() => {
      chartInstance.resize();
    }, 100);
  }
});

function showInterpretation(scores) {
  const highestScore = Math.max(...Object.values(scores));
  const highestDim = Object.keys(scores).find(
    (key) => scores[key] === highestScore
  );

  const interpretations = {
    trait:
      "You believe leadership comes from special personality traits and natural gifts. You see leaders as having unique qualities that set them apart.",
    ability:
      "You view leadership as a learned skill that can be developed. You believe anyone can become a leader through practice and learning.",
    skill:
      "You think leadership requires specific knowledge and competence. You emphasize the importance of having the right skills and know-how.",
    behavior:
      "You focus on what leaders do rather than who they are. You believe leadership is about actions and behaviors.",
    relationship:
      "You see leadership as centered on communication between leaders and followers. You believe it's about building connections and relationships.",
    process:
      "You view leadership as involving leaders, followers, and situations working together. You see it as a collaborative process.",
  };

  const highestScoreDiv = document.getElementById("highest-score");
  const nameCap = highestDim.charAt(0).toUpperCase() + highestDim.slice(1);
  highestScoreDiv.innerHTML = `
    <strong>Your Highest Score: ${nameCap} (${highestScore}/20)</strong><br>
    ${interpretations[highestDim]}
  `;
}

// Modal functionality - Fixed initialization
function initializeModal() {
  console.log('Initializing modal functionality');
  
  // Wait for all elements to be available
  const checkModalElements = () => {
    const modal = document.getElementById('chartModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const overlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');

    if (!modal || !openBtn || !closeBtn || !overlay || !modalContent) {
      console.log('Modal elements not found, retrying...');
      setTimeout(checkModalElements, 100);
      return;
    }

    console.log('Modal elements found, setting up event listeners');

    // Open modal
    openBtn.addEventListener('click', function() {
      console.log('Modal open button clicked');
      openModal();
    });

    // Close modal - close button
    closeBtn.addEventListener('click', function() {
      console.log('Modal close button clicked');
      closeModal();
    });

    // Close modal - overlay click
    overlay.addEventListener('click', function() {
      console.log('Modal overlay clicked');
      closeModal();
    });

    // Close modal - ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        console.log('ESC key pressed, closing modal');
        closeModal();
      }
    });

    // Prevent modal content click from closing modal
    modalContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  };

  checkModalElements();
}

function openModal() {
  console.log('Opening modal');
  const modal = document.getElementById('chartModal');
  if (!modal) {
    console.error('Modal element not found');
    return;
  }
  
  modal.style.display = 'flex';
  
  // Force reflow
  modal.offsetHeight;
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Create modal chart after modal is visible
  setTimeout(() => {
    if (chartInstance && chartInstance.data) {
      console.log('Creating modal chart');
      createModalChart(chartInstance.data.datasets[0].data);
    } else {
      console.error('Chart instance not available');
    }
  }, 100);
}

function closeModal() {
  console.log('Closing modal');
  const modal = document.getElementById('chartModal');
  if (!modal) {
    console.error('Modal element not found');
    return;
  }
  
  modal.classList.remove('show');
  document.body.style.overflow = ''; // Restore scrolling
  
  // Destroy modal chart
  if (modalChartInstance) {
    modalChartInstance.destroy();
    modalChartInstance = null;
  }
  
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

function createModalChart(scores) {
  console.log('Creating modal chart with scores:', scores);
  const canvas = document.getElementById('modalRadarChart');
  
  if (!canvas) {
    console.error('Modal canvas not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Destroy existing modal chart if it exists
  if (modalChartInstance) {
    modalChartInstance.destroy();
    modalChartInstance = null;
  }

  try {
    modalChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Trait', 'Ability', 'Skill', 'Behavior', 'Relationship', 'Process'],
        datasets: [{
          label: 'Leadership Dimensions',
          data: scores,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: window.innerWidth < 768 ? 1.5 : 3,
          pointBackgroundColor: [
            '#e53e3e', '#38a169', '#3182ce', '#d69e2e', '#805ad5', '#dd6b20'
          ],
          pointBorderColor: '#fff',
          pointBorderWidth: window.innerWidth < 768 ? 1.5 : 3,
          pointRadius: window.innerWidth < 768 ? 6 : 12, // 50% smaller on mobile but still larger than main chart
          pointHoverRadius: window.innerWidth < 768 ? 8 : 16, // 50% smaller on mobile
          pointHoverBackgroundColor: [
            '#e53e3e', '#38a169', '#3182ce', '#d69e2e', '#805ad5', '#dd6b20'
          ],
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: window.innerWidth < 768 ? 2 : 4,
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
                size: window.innerWidth < 768 ? 14 : 18, // Larger font for modal
                weight: '600'
              },
              padding: window.innerWidth < 768 ? 15 : 25
            }
          },
          title: {
            display: false // Hide title in modal as it's in header
          }
        },
        scales: {
          r: {
            beginAtZero: false,
            min: 4,
            max: 20,
            ticks: {
              stepSize: 4,
              display: true,
              backdropColor: 'rgba(255, 255, 255, 0.9)',
              color: '#4a5568',
              font: {
                size: window.innerWidth < 768 ? 12 : 16, // Larger font for modal
                weight: '600'
              }
            },
            grid: {
              display: true,
              color: 'rgba(102, 126, 234, 0.3)',
              lineWidth: 2
            },
            angleLines: {
              display: true,
              color: 'rgba(102, 126, 234, 0.4)',
              lineWidth: 2
            },
            pointLabels: {
              display: true,
              font: {
                size: window.innerWidth < 768 ? 12 : 18, // Larger font for modal
                weight: 'bold'
              },
              color: '#2d3748',
              padding: window.innerWidth < 768 ? 8 : 15
            }
          }
        },
        elements: {
          line: {
            borderWidth: window.innerWidth < 768 ? 1.5 : 3
          },
          point: {
            radius: window.innerWidth < 768 ? 4 : 8,
            hoverRadius: window.innerWidth < 768 ? 6 : 12
          }
        },
        interaction: {
          intersect: false
        }
      }
    });
    
    console.log('Modal radar chart created successfully');

    // Force resize after creation
    setTimeout(() => {
      if (modalChartInstance) {
        modalChartInstance.resize();
      }
    }, 100);

  } catch (error) {
    console.error('Error creating modal radar chart:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Update the existing calculateScores function to show modal button
function calculateScores() {
  console.log('calculateScores function called');

  // Get submit button and disable it to prevent multiple submissions
  const submitButton = document.querySelector('#leadershipForm button[type="button"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitButton.textContent = 'Submitted';
  }

  const form = document.getElementById("leadershipForm");
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
  let scores = {
    trait: 0,
    ability: 0,
    skill: 0,
    behavior: 0,
    relationship: 0,
    process: 0,
  };

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

  // Generate UID and timestamp ONLY at quiz completion
  const finalData = {
    date: new Date().toISOString(), // FIRST field - quiz completion date
    UID: generateUID(), // SECOND field
    ...preQuizData, // All pre-quiz data (filled or null)
    
    // Individual question responses
    ...individualResponses, // This adds q1, q2, q3... q24
    
    // Flattened quiz scores (no nesting) - AFTER individual questions
    quizscore_Trait: scores.trait,
    quizscore_Ability: scores.ability,
    quizscore_Skill: scores.skill,
    quizscore_Behavior: scores.behavior,
    quizscore_Relationship: scores.relationship,
    quizscore_Process: scores.process
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
        <strong>${categoryName} emphasis:</strong> ${scores[cat]} out of 20
      </div>`;
  }
  resultDiv.style.display = "block";

  // Draw radar chart
  console.log('About to draw radar chart');
  drawRadarChart(scores);

  // Remove this line since we're removing the modal button
  // const modalBtn = document.getElementById('openModalBtn');
  // if (modalBtn) {
  //   modalBtn.style.display = 'inline-block';
  // }

  // Show interpretation
  showInterpretation(scores);

  // Scroll into view
  resultDiv.scrollIntoView({ behavior: "smooth" });
}
