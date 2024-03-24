import React, { useState, useEffect } from 'react'
import './App.css'
import { ApiHandler, Problem } from './apiHandler'
import parse from 'html-react-parser'

const apiHandler = new ApiHandler()

function App() {
  const [problem, setProblem] = useState<Problem>()
  const [ctaText, setCtaText] = useState('Tjek mit svar')
  const [guess, setGuess] = useState<string>()

  useEffect(() => {
    console.log('Initial useEffect')
    apiHandler.getProblem().then((p) => setProblem(p))
  }, [])

  const checkAnswer = () => {
    console.log('Checking guess: ' + (guess ?? '[undefined]'))
    if (guess) {
      apiHandler.checkGuess(guess).then((answer) => {
        if (!answer.isCorrect) {
          if (ctaText === 'Tjek mit svar') setCtaText('Prøv igen')
          else setCtaText('Næste spørgsmål')
        }
      })
    }
  }

  return (
    <div>
      {problem ? (
        <div className="flex flex-col">
          <h1 className="text-l font-bold">{problem?.introText}</h1>
          {problem && (
            <div className="italic">{parse(problem.description)}</div>
          )}
          <div className="flex">
            <div>{problem?.problemText.split('{{input0}}')[0]}</div>
            <input
              type="text"
              className="mx-2 rounded border shadow-inner"
              onChange={(e) => setGuess(e.target.value)}
            ></input>
            <div>{problem?.problemText.split('{{input0}}')[1]}</div>
          </div>
          <button className="border" onClick={() => checkAnswer()}>
            {ctaText}
          </button>
        </div>
      ) : (
        <div>Indlæser...</div>
      )}
    </div>
  )
}

export default App
