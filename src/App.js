import userEvent from '@testing-library/user-event';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  //All question set in this state named question which are fetched by APIs
  const [questions, setQuestions] = useState([])
  //In this State we store current question index which are starting from zero
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // create array to set Options of current question 
  // const question = [questions[currentQuestion]]
  const [text, setText] = useState()

  //State for Count Result
  const [result, setResult] = useState(0)
  // State radioButtonNull to null radio button when next question is call

  // Flag to indicate if an option has been selected
  const [selected, setSelected] = useState(false);



  //==============================================================================================

  //Call API function using useEffect bcz we need to it only one time 
  useEffect(function(){
    getQuestionFromApi()
  }, [])

  //Create function to call API for getting the mcqs
  function getQuestionFromApi(){
    fetch('https://the-trivia-api.com/v2/questions')
    .then(res => res.json())
    .then(res => {
      res.map(function(item){
        item.options = [...item.incorrectAnswers , item.correctAnswer]
        item.options = shuffle(item.options)
      })
      setQuestions(res)
    })
  }

  //use Condition when its render first time we have no question thats why we use this condition 
  if(!questions.length){
    return <div>
      <img src="https://i.pinimg.com/originals/26/af/26/26af26707d7d0da6d5bc930788cfc868.gif"/>
    </div>
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  //===============================================================================================

  // Create NextQuestion function to get next question
 
  function nextQuestion() {
    if (!selected) {
      // Show a user-friendly message if no option is selected
      alert('Please select an option before proceeding.');
    } else {
      if (text === questions[currentQuestion].correctAnswer) {
        setResult(result + 10);
        console.log('Correct Answer');
      }
      setCurrentQuestion(currentQuestion + 1);
      setSelected(false); // Unselect radio button on question change
    }
  }

  function selectedOption(e) {
    const value = e.target.value;
    setText(value);
    setSelected(true); // Mark an option as selected
  }

  // Create RestatQuiz Function to start again quiz
  function restartQuestion() {
    setCurrentQuestion(0);
    setResult(0);
    setSelected(false); // Unselect radio button on restart
  }


  let quizEnded = currentQuestion === questions.length
  let currentIndex = questions[currentQuestion]

  return (
    <div className='App'>
      <div className='main-content'>
        <div className='main-div'>
          <h2 className='quiz_app_heading'>QUIZ APP</h2>
          { !quizEnded ? <div className='ques-div'>
            <h2 className='question'>Q{currentQuestion + 1}/{questions.length}: {questions[currentQuestion].question.text}</h2>
            {currentIndex.options.map((item) => (
                <div className='option-div' key={item}>
                  <input
                    className='option'
                    checked={selected && text === item} // Use 'selected' flag for correct checking
                    onChange={selectedOption}
                    type='radio'
                    name='q'
                    value={item}
                  />
                  {item}
                </div>
              ))}
            <button className='next-btn' onClick={nextQuestion}>Next</button>
          </div>

          :<div className='result_div'>
            <h1 className='result_heading'>Result</h1>
            { result < 50 ?(
              <>
              <img className='fail' src='https://gifdb.com/images/high/sad-man-crying-out-loud-meme-74loufg1hlyn7h48.gif'/>
            <p className='failMsg'>Sorry! You are Fail</p>
              </>
            ) 
            :(
              <>
              <img className='fail' src='https://i.redd.it/0da59icbon4c1.gif'/>
            <p className='failMsg'>Congrats! You are Pass</p>
              </>
            ) }
            <h2 className='total_marks'>Obt. Marks: {result}</h2>
            <button className='result-btn' onClick={restartQuestion}>Restart</button>
          </div>}
          
        </div>
        {console.log(questions)}
      </div>
    </div>
  )
}
export default App;
