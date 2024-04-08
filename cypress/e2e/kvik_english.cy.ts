describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')

    // Initially the "loading" div should be visible while loading the problem from the API
    cy.get("[data-test='loading']").should('be.visible')

    // After a short while the problem is loaded and the intro-text should be visible instead
    cy.get("[data-test='intro-text']").should('be.visible')
    cy.get("[data-test='loading']").should('not.exist')

    // Before giving the input focus, the pencil icon should be visible and dog should be default
    cy.get("[data-test='pencil-icon']").should('be.visible')
    checkDogIcons('dog-first')

    cy.get("[data-test='answer-input']").focus()
    cy.get("[data-test='pencil-icon']").should('not.exist')

    // First wrong guess should change dog to first wrong
    cy.get("[data-test='answer-input']").type('dogg')
    cy.get("[data-test='check-button']").click()
    checkDogIcons('dog-second')

    // Second wrong guess should show wrong-icon in input, retry icon in button and change dog to second wrong
    cy.get("[data-test='answer-input']").type('2')
    cy.get("[data-test='check-button']").click()
    cy.get("[data-test='input-wrong']").should('be.visible')
    cy.get("[data-test='button-retry']").should('be.visible')
    checkDogIcons('dog-wrong')

    // Hitting 'Prøv igen' should reset the indicators above
    cy.get("[data-test='check-button']").click()
    cy.get("[data-test='pencil-icon']").should('be.visible')
    cy.get("[data-test='input-wrong']").should('not.exist')
    cy.get("[data-test='button-retry']").should('not.exist')
    checkDogIcons('dog-first')

    // Correct guess shouldshow right-icon in input, next icon in button and change dog to correct
    cy.get("[data-test='answer-input']").type('dog')
    cy.get("[data-test='check-button']").click()
    cy.get("[data-test='input-right']").should('be.visible')
    cy.get("[data-test='button-next']").should('be.visible')
    checkDogIcons('dog-right')
  })
})

const checkDogIcons = (visibleDog: string) => {
  cy.get("[data-test='dog-first']").should(
    visibleDog === 'dog-first' ? 'be.visible' : 'not.exist',
  )
  cy.get("[data-test='dog-second']").should(
    visibleDog === 'dog-second' ? 'be.visible' : 'not.exist',
  )
  cy.get("[data-test='dog-wrong']").should(
    visibleDog === 'dog-wrong' ? 'be.visible' : 'not.exist',
  )
  cy.get("[data-test='dog-right']").should(
    visibleDog === 'dog-right' ? 'be.visible' : 'not.exist',
  )
}
