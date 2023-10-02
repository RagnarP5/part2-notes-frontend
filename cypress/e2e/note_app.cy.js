describe('template spec', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Ragnar Palsson',
      username: 'rpalsson',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:5173/')
  })

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('rpalsson')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').contains('wrong credentials')
  })

  it('front page can be opened', () => {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })

  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type('rpalsson')
    cy.get('#password').type('sekret')
    cy.get('#login-button').click()

    cy.contains('Ragnar Palsson logged in')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'rpalsson', password: 'sekret'
      }).then(response => {
        localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:5173')
      })
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('#new-note-input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function() {
      beforeEach(function() {
        cy.contains('new note').click()
        cy.get('#new-note-input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made not important', function() {
        cy.contains('another note cypress')
            .contains('make not important')
            .click()
        cy.contains('another note cypress')
            .contains('make important')
      })
    })
  })
})