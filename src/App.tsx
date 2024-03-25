import { useState, useEffect } from 'react'
import { ApiHandler, Problem } from './apiHandler'
import parse from 'html-react-parser'

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
    }
  }

  const onInputFocus = (e: any) => {
    setShowPencil(false)
  }

  const onInputBlur = (e: any) => {
    setShowPencil(guess === '')
  }

  return (
    <div>
      {problem ? (
        <div className="flex flex-col">
          <h1 className="text-l font-bold">{problem?.introText}</h1>
          {problem && (
            <div className="italic">{parse(problem.description)}</div>
          )}
          <div className="flex items-center">
            <div>{problem?.problemText.split('{{input0}}')[0]}</div>
            <div className="relative">
              <input
                value={guess}
                type="text"
                className={`ml-2 mr-1 h-9 w-20 rounded border px-1 shadow-inner focus:border-2 ${state === 'first guess' ? 'border-gray-600' : state === 'right' ? 'border-green-600' : 'border-red-600'}`}
                onChange={(e) => setGuess(e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
              {showPencil && (
                <img
                  className="pointer-events-none absolute right-8 top-2"
                  src="/blyant.png"
                  alt="Pencil"
                />
              )}
            </div>
            <div>{problem?.problemText.split('{{input0}}')[1]}</div>
          </div>
          <button
            className={`border ${state === 'wrong' ? 'border-red-600' : state === 'right' ? 'border-green-600' : 'border-yellow-600'} mt-2 w-48 ${guess !== '' && 'hover:border-2'} ${guess === '' && 'border-gray-300 text-gray-300'}`}
            disabled={guess === ''}
            onClick={ctaClicked}
          >
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
