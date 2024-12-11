//https://opentdb.com/api.php?amount=5&category=9&difficulty=easy
//DOM Selection
const categorySelector = document.querySelector("#categoryMenu");
const difficultySelector = document.querySelector("#difficultyOptions");
const numbersSelector = document.querySelector("#questionsNumber");
const btnSelector = document.querySelector("#startQuiz");
const formSelector = document.querySelector("#quizOptions");
const rowDataSelector = document.querySelector("#rowData");
let questions = [];
let myQuiz = {};
//Event Listeners 
btnSelector.addEventListener("click", async () => {
    let values = {
        category: categorySelector.value,
        difficulty: difficultySelector.value,
        numbers: numbersSelector.value
    }
    //Create Quiz
    myQuiz = new Quiz(values); //Instantiate a new object from Quiz Class.
    questions = await myQuiz.getQuestions();
    console.log(questions);
    myQuiz.hideForm();
    //Create Question
    let myQuestion = new Questions(0); // Insatnaite a new object from Questions Class
    myQuestion.displayQuestions();
});

//Classes
class Quiz {
    constructor({ category, difficulty, numbers }) {
        this.score = 0;
        this.category = category;
        this.difficulty = difficulty;
        this.numbers = numbers;
    }
    getQuestions = async () => {
        // await try .. catch
        // not used await .then .catch
        try {
            let payload = await fetch(`https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`);
            let response = await payload.json();
            return response.results;
        }
        catch (error) {
            console.log(error);
        }
    }
    hideForm = () => {
        formSelector.classList.replace("d-flex", "d-none");
    }
    showFinalResult = () => {
        rowDataSelector.innerHTML = `
        <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0 text-center">
            ${this.score == this.numbers ? `Congratulations! 🎉` : `Better luck next time, You answered ${this.score} out of ${this.numbers} questions!`}
        </h2>
            <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        </div>
        `;
        const againBtnSelector = document.querySelector(".again");
        againBtnSelector.addEventListener("click", () => {
            window.location.reload(); //refresh the document
        })
    }
};
class Questions {
    constructor(i) {
        this.index = i;
        this.difficulty = questions[i].difficulty;
        this.category = questions[i].category;
        this.question = questions[i].question;
        this.correctAnswer = questions[i].correct_answer;
        this.incorrectAnswers = questions[i].incorrect_answers;
        this.allAnswers = this.getAllAnswers();
        this.isAnswered = false;
    }
    displayQuestions = () => {
        rowDataSelector.innerHTML = `
        <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${questions.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.allAnswers.map((answer) => `<li>${answer}</li>`).toString().replaceAll(",", "")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}</h2>
        </div>
        `;
        const choices = document.querySelectorAll(".choices li");
        choices.forEach((choice) => choice.addEventListener("click", () => {
            this.checkAnswer(choice);
        }));
    }
    getAllAnswers = () => {
        let allAnswers = [];
        allAnswers = [...this.incorrectAnswers, this.correctAnswer].sort();
        return allAnswers;
    }
    checkAnswer(choice) {
        if (this.isAnswered === false) {
            this.isAnswered = true;
            if (choice.innerHTML == this.correctAnswer) {
                myQuiz.score++;
                choice.classList.add("correct", "animate__animated", "animate__pulse");
            }
            else {
                choice.classList.add("wrong", "animate__animated", "animate__shakeX");
            }
            this.getNextQuestion();
        }
    }
    getNextQuestion = () => {
        this.index++;
        if (this.index < questions.length) {
            setTimeout(() => {
                let nextQuestion = new Questions(this.index);
                nextQuestion.displayQuestions();
            }, 1000);
        }
        else {
            setTimeout(() => {
                myQuiz.showFinalResult();
            }, 1000)
        }
    }
};
