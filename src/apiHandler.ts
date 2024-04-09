const baseURL = process.env.REACT_APP_API

export interface Problem {
  id: number
  introText: string
  description: string
  problemText: string
}

export interface Answer {
  isCorrect: boolean
  correctAnswer: { input0: string }
}

export class ApiHandler {
  async getProblem(): Promise<Problem> {
    let res = await fetch(baseURL + '/problem')
    if (!res.ok) return Promise.reject(res)
    let data = await res.json()
    return data as Problem
  }

  async checkGuess(input: string): Promise<Answer> {
    let res = await fetch(baseURL + '/check', {
      method: 'POST',
      body: JSON.stringify({
        input0: input,
      }),
    })
    if (!res.ok) Promise.reject(res)
    let data = await res.json()
    return data as Answer
  }
}
