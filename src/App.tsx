import { useState, useEffect } from 'react'
import { ApiHandler, Problem } from './apiHandler'
import parse from 'html-react-parser'
import {
  RightAnswer,
  WrongAnswer,
  DogCorrect,
  DogDefault,
  DogFirstWrong,
  DogSecondWrong,
  pencil,
} from './assets'
import { Button } from './Button'

const apiHandler = new ApiHandler()

function App() {
  const [problem, setProblem] = useState<Problem>()
  const [guess, setGuess] = useState('')
  const [inputFocussed, setInputFocussed] = useState(false)
  const [showPencil, setShowPencil] = useState(true)
  const [state, setState] = useState<
    'first guess' | 'second guess' | 'right' | 'wrong'
  >('first guess')

  useEffect(() => {
    // Get problem when loading app
    apiHandler.getProblem().then((p) => setProblem(p))
  }, [])

  // Show pencil icon when input is empty and doesn't have focus
  useEffect(() => {
    setShowPencil(!inputFocussed && guess === '')
  }, [guess, inputFocussed])

  function checkAnswerAndUpdateState() {
    switch (state) {
      case 'first guess':
        if (guess) {
          apiHandler.checkGuess(guess).then((answer) => {
            if (answer.isCorrect) setState('right')
            else setState('second guess')
          })
        }
        break
      case 'second guess':
        if (guess) {
          apiHandler.checkGuess(guess).then((answer) => {
            if (answer.isCorrect) setState('right')
            else setState('wrong')
          })
        }
        break
      case 'right':
      case 'wrong':
        setGuess('')
        setState('first guess')
        break
    }
  }

  const ctaClicked = () => {
    console.log('CTA Clicked:', state)
    checkAnswerAndUpdateState()
  }

  const onInputKeyUp = (e: any) => {
    if (e.key === 'Enter') checkAnswerAndUpdateState()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      {problem ? (
        <div className="grid h-full max-h-[768px] w-full max-w-screen-lg grid-rows-3 bg-white p-12">
          {/* Intro text */}
          <div>
            <h1 data-test="intro-text" className="ml-4 mt-6 text-xl font-bold">
              {problem.introText}
            </h1>
          </div>

          {/* Question */}
          <div className="flex items-center">
            {/* Left space */}
            <div className="grow-[2]" />

            {/* Dog */}
            <div>
              {state === 'first guess' && <DogDefault data-test="dog-first" />}
              {state === 'second guess' && (
                <DogFirstWrong data-test="dog-second" />
              )}
              {state === 'wrong' && <DogSecondWrong data-test="dog-wrong" />}
              {state === 'right' && <DogCorrect data-test="dog-right" />}
            </div>

            {/* Task */}
            <div className="ml-6 text-xl">
              <div className="relative">
                <svg viewBox="0 0 210 30">
                  {/* Todo: Improve speech bubble adding rounded corners and dynamic width */}
                  <path
                    d="M6 2 H200 V28 H6 V19 L0 15 L6 11 Z"
                    className="fill-transparent stroke-blue-600 stroke-1"
                  ></path>
                </svg>

                <div className="absolute left-8 top-5 mb-8 italic">
                  {parse(problem.description)}
                </div>
              </div>

              <div className="ml-6 mt-4 flex items-center">
                <div>{problem.problemText.split('{{input0}}')[0]}</div>
                <div className="relative">
                  <input
                    data-test="answer-input"
                    value={guess}
                    type="text"
                    className={`shadow-inner-dark ml-2 mr-1 h-9 w-24 rounded border-2 px-2 focus:border-2 ${state === 'first guess' ? 'border-gray-600' : state === 'right' ? 'border-green-600 bg-green-100' : state === 'wrong' ? 'border-red-600 bg-red-100' : 'border-red-600'}`}
                    onChange={(e) => setGuess(e.target.value)}
                    onFocus={() => setInputFocussed(true)}
                    onBlur={() => setInputFocussed(false)}
                    onKeyUp={onInputKeyUp}
                  />
                  {showPencil && (
                    <img
                      data-test="pencil-icon"
                      className="pointer-events-none absolute right-[42px] top-2"
                      src={pencil}
                      alt="Pencil"
                    />
                  )}
                  {state === 'right' && (
                    <RightAnswer
                      data-test="input-right"
                      className="pointer-events-none absolute right-3 top-[7px]"
                    />
                  )}
                  {state === 'wrong' && (
                    <WrongAnswer
                      data-test="input-wrong"
                      className="pointer-events-none absolute right-3 top-[7px]"
                    />
                  )}
                </div>
                <div>{problem.problemText.split('{{input0}}')[1]}</div>
              </div>
            </div>

            {/* Right space */}
            <div className="grow" />
          </div>

          {/* Check answer */}
          <div className="flex flex-col items-center justify-end">
            <Button
              state={state}
              disabled={guess === ''}
              onClick={ctaClicked}
            />
          </div>
        </div>
      ) : (
        <div data-test="loading" className="text-white">
          Indlæser...
        </div>
      )}
    </div>
  )
}

export default App
