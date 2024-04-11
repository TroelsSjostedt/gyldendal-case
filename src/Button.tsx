import { useEffect, useState } from 'react'
import { ArrowNext, ArrowRetry } from './assets'

type Props = {
  state: 'first guess' | 'second guess' | 'right' | 'wrong'
  disabled: boolean
  onClick: () => void
}

export const Button = ({ state, disabled, onClick }: Props) => {
  const [text, setText] = useState('Tjek mit svar')

  useEffect(() => {
    switch (state) {
      case 'first guess':
        setText('Tjek mit svar')
        break
      case 'second guess':
        setText('Tjek mit svar')
        break
      case 'right':
        setText('Næste opgave')
        break
      case 'wrong':
        setText('Prøv igen')
        break
    }
  }, [state])

  return (
    <div>
      {' '}
      <button
        data-test="check-button"
        className={`mb-8 flex cursor-pointer flex-col rounded-[4px] border-2 py-2 shadow-md disabled:cursor-default ${state === 'wrong' ? 'border-red-600' : state === 'right' ? 'border-green-600' : 'border-yellow-600'} mt-2 w-48 ${!disabled && 'hover:border-2'} ${disabled && 'border-gray-300 text-gray-300'}`}
        disabled={disabled}
        onClick={onClick}
      >
        <div className="flex self-center font-bold">
          {text}
          {state === 'wrong' && (
            <ArrowRetry
              data-test="button-retry"
              className="pointer-events-none ml-3 self-center"
            />
          )}
          {state === 'right' && (
            <ArrowNext
              data-test="button-next"
              className="pointer-events-none ml-3 self-center"
            />
          )}
        </div>
      </button>
    </div>
  )
}
