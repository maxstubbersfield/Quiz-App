const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const explanationDiv = document.getElementById("explanation");
const explanationText = document.getElementById("explanation-text");

const importButton = document.getElementById("import-btn");
const importDiv = document.getElementById("import-section");
const quizDiv = document.getElementById("quiz-section");

function getNextButton() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let numberQuestions = true;

const startQuiz = () => {
  showQuizSection();
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
};

const showQuestion = () => {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;

  questionElement.innerHTML = numberQuestions ? questionNo + ". " + currentQuestion.question : currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }

    if ("explanation" in currentQuestion) {
      const text = currentQuestion.explanation;
      button.dataset.explanation = text;
    }

    button.addEventListener("click", selectAnswer);
  });
};

function resetState() {
  nextButton.style.display = "none";
  explanationDiv.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  if ("explanation" in selectedBtn.dataset) {
    const text = selectedBtn.dataset.explanation;
    explanationText.innerHTML = text;
    explanationDiv.style.display = "block";
  }

  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You Score ${score} Out Of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

const handleNextButton = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
};

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

importButton.addEventListener("click", () => {
  importQuizFromJson();
});

function importQuizFromJson() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = ".json";

  input.onchange = e => {
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = readerEvent => {
      try {
        let content = readerEvent.target.result;

        const jsonData = JSON.parse(content);
        questions = jsonData.questions;
        numberQuestions = jsonData.settings?.number_questions ?? true;
        startQuiz();

      } catch (error) {
        alert('Error parsing JSON file.');
      }
    }
  }

  input.click();
}

function showImportSection() {
  quizDiv.style.display = "none";
  importDiv.style.display = "block";
}

function showQuizSection() {
  quizDiv.style.display = "block";
  importDiv.style.display = "none";
}


showImportSection();