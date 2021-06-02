describe('SearchWithMultipleFilters', () => {

    
    it("search for 'openfaas' with 'gateway'", () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.form-control').type("openfaas{enter}");

        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("gateway")')
          .its('length')
          .should('be.gte', 10)

    });




    it('filter list, KindContainer', 'search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Container").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("gateway")')
          .its('length')
          .should('be.gte', 1)


    });


    it.only('filter list, KindApplication, WithErrors, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Errors")
          .parents("details")
          .find("button")
          .contains("With errors").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("faas-idler")')
            .its('length')
            .should('be.gte', 1)



    });


    it.only('filter list, KindApplication, WithWarnings, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("With warnings").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("faas-idler")')
            .its('length')
            .should('be.gte', 1)



    });



    it.only('filter list, KindApplication, WithoutWarnings, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("Without warnings").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("gateway")')
            .its('length')
            .should('be.gte', 1)



    });



});