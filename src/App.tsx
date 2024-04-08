import { useState, useEffect } from 'react'
import { ApiHandler, Problem } from './apiHandler'
import parse from 'html-react-parser'
import {
  ArrowNext,
  ArrowRetry,
  RightAnswer,
  WrongAnswer,
  DogCorrect,
  DogCorrecting,
  DogDefault,
  DogFirstWrong,
  DogSecondWrong,
  pencil,
} from './assets'

const apiHandler = new ApiHandler()

function App() {
  const [problem, setProblem] = useState<Problem>()
  const [ctaText, setCtaText] = useState('Tjek mit svar')
  const [guess, setGuess] = useState('')
  const [showPencil, setShowPencil] = useState(true)
  const [state, setState] = useState<
    'first guess' | 'second guess' | 'right' | 'wrong'
  >('first guess')

  useEffect(() => {
    // Get problem when loading app
    apiHandler.getProblem().then((p) => setProblem(p))
  }, [])

  useEffect(() => {
    console.log('New state:', state)
    switch (state) {
      case 'first guess':
        setCtaText('Tjek mit svar')
        break
      case 'second guess':
        setCtaText('Tjek mit svar')
        break
      case 'right':
        setCtaText('Næste opgave')
        break
      case 'wrong':
        setCtaText('Prøv igen')
        break
    }
  }, [state])

  const ctaClicked = () => {
    console.log('CTA Clicked:', state)
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
        setShowPencil(true)
        setState('first guess')
        break
    }
  }

  const onInputFocus = (e: any) => {
    setShowPencil(false)
  }

  const onInputBlur = (e: any) => {
    setShowPencil(guess === '')
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      {problem ? (
        <div className="grid h-full max-h-[768px] w-full max-w-screen-lg grid-rows-3 bg-white p-12">
          {/* Intro text */}
          <div>
            <h1 className="ml-4 mt-6 text-xl font-bold">
              {problem?.introText}
            </h1>
          </div>

          {/* Question */}
          <div className="flex items-center">
            {/* Left space */}
            <div className="grow-[2]" />

            {/* Dog */}
            <div>
              {state === 'first guess' && <DogDefault />}
              {state === 'second guess' && <DogFirstWrong />}
              {state === 'wrong' && <DogSecondWrong />}
              {state === 'right' && <DogCorrect />}
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
                <div>{problem?.problemText.split('{{input0}}')[0]}</div>
                <div className="relative">
                  {/* shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] */}
                  <input
                    value={guess}
                    type="text"
                    className={`shadow-inner-dark ml-2 mr-1 h-9 w-24 rounded border-2 px-2 focus:border-2 ${state === 'first guess' ? 'border-gray-600' : state === 'right' ? 'border-green-600' : 'border-red-600'}`}
                    onChange={(e) => setGuess(e.target.value)}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                  />
                  {showPencil && (
                    <img
                      className="pointer-events-none absolute right-[42px] top-2"
                      src={pencil}
                      alt="Pencil"
                    />
                  )}
                  {state === 'right' && (
                    <RightAnswer className="pointer-events-none absolute right-3 top-2" />
                  )}
                  {state === 'wrong' && (
                    <WrongAnswer className="pointer-events-none absolute right-3 top-2" />
                  )}
                </div>
                <div>{problem?.problemText.split('{{input0}}')[1]}</div>
              </div>
            </div>

            {/* Right space */}
            <div className="grow" />
          </div>

          {/* Check answer */}
          <div className="flex flex-col items-center justify-end">
            <button
              className={`mb-8 flex cursor-pointer flex-col rounded-[4px] border-2 py-2 shadow-md disabled:cursor-default ${state === 'wrong' ? 'border-red-600' : state === 'right' ? 'border-green-600' : 'border-yellow-600'} mt-2 w-48 ${guess !== '' && 'hover:border-2'} ${guess === '' && 'border-gray-300 text-gray-300'}`}
              disabled={guess === ''}
              onClick={ctaClicked}
            >
              <div className="flex self-center font-bold">
                {ctaText}
                {state === 'wrong' && (
                  <ArrowRetry className="pointer-events-none ml-3 self-center" />
                )}
                {state === 'right' && (
                  <ArrowNext className="pointer-events-none ml-3 self-center" />
                )}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>Indlæser...</div>
      )}
    </div>
  )
}

export default App
