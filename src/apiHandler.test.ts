import { ApiHandler } from './apiHandler'

describe('ApiHandler', () => {
  const handler = new ApiHandler()

  it('gets the problem from the API', async () => {
    const problem = await handler.getProblem()
    expect(problem.description).toBe(
      'Kvik er en sød <b>hund</b>. Han elsker at lære nye ting.',
    )
    expect(problem.id).toBe(1)
    expect(problem.introText).toBe('Skriv det rigtige ord i oversættelsen.')
    expect(problem.problemText).toBe(
      'Kvik is a nice {{input0}}. He loves to learn new things.',
    )
  })

  it('accepts answer when correct', async () => {
    let answer = 'dog'
    const result = await handler.checkGuess(answer)
    expect(result.isCorrect).toBeTruthy()
    expect(result.correctAnswer.input0).toBe('dog')
  })

  it('rejects answer when incorrect', async () => {
    let answer = 'dogg'
    const result = await handler.checkGuess(answer)
    expect(result.isCorrect).toBeFalsy()
    expect(result.correctAnswer.input0).toBe('dog')
  })
})
