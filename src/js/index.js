// variables that control the quiz
let rightQuestions = 0;
let wrongQuestions = 0;
let questionIndex = 0;
let currentQuestion = null;
let isAnswered = false;
let timerID = null;

// Get all necessary elements
const startScene = document.querySelector('#start-quiz');
const restartScene = document.querySelector('#restart-quiz');
const modal = document.querySelector('.modal');

const startButton = document.querySelector('#start');
const restartButton = document.querySelector('#restart');
const resultDisplay = document.querySelector('#result-display');

const questionTitle = document.querySelector('#question-title');
const questionAlternatives = document.querySelector('#question-alternatives');
const nextButton = document.querySelector('#next');
const timerSeconds = document.querySelector('#timer-seconds');

startButton.addEventListener('click', () => {
  startScene.style.display = 'none';
  startQuiz();
});

restartButton.addEventListener('click', () => {
  restartScene.style.display = 'none';
  startQuiz();
});

questionAlternatives.addEventListener('click', event => {

  if (isAnswered) return;

  const answerUser = event.target;
  if (answerUser.tagName !== 'LI') return; 

  if (answerUser === currentQuestion.correctEl) {
    answerUser.classList.add('alternative--check');
    rightQuestions++;
  } else {
    answerUser.classList.add('alternative--wrong');
    currentQuestion.correctEl.classList.add('alternative--check');
    wrongQuestions++;
  }

  clearInterval(timerID);
  isAnswered = true;
  nextButton.disabled = false;

});

nextButton.addEventListener('click', () => {
  questionIndex++;
  timerSeconds.innerText = '15';
  prepareQuestion();
});

// Functions
function startQuiz() {

  rightQuestions = 0;
  wrongQuestions = 0;
  questionIndex = 0;

  modal.style.display = 'flex';
  prepareQuestion();

}

function prepareQuestion() {

  if (questionIndex >= questions.length) {
    modal.style.display = 'none';
    restartScene.style.display = 'block';
    displayResults();
    return;
  }

  let timeLeft = 15;
  isAnswered = false;
  currentQuestion = questions[questionIndex];
  showQuestion(currentQuestion);

  timerID = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {

      currentQuestion.correctEl.classList.add('alternative--check');
      wrongQuestions++;
      nextButton.disabled = false;
      clearInterval(timerID)

    }

    timerSeconds.innerText = timeLeft;
  }, 1000);

}

function showQuestion(question) {

  questionTitle.innerText = `${questionIndex + 1}. ${currentQuestion.title}`;
  questionAlternatives.innerHTML = '';

  for (let alternative of question.alternatives) {
    const item = document.createElement('li');
    item.innerHTML = `
      ${alternative}
      <div class="alternative__icons">
        <i class="icon icon--check far fa-check-circle"></i>
        <i class="icon icon--wrong far fa-times-circle"></i>
      </div>
    `;

    item.className = 'alternative';
    questionAlternatives.appendChild(item);

    if (alternative === question.correctAlternative) currentQuestion.correctEl = item;
  }

}

function displayResults() {
  resultDisplay.innerHTML = `Right questions: ${rightQuestions} <br> Wrong Questions: ${wrongQuestions}`;
}