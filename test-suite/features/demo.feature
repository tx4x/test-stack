@foo @simpleLogger
Feature: Demo-Dev

Background: Demo-Dev Site
  Given I am logged into demo.dev
  #Given I am connected to a demo session at 'https://onearmy'

@debug
Scenario: Network requests
  Given I have no request to 'blank.html'


#"cucumber": 
#"./node_modules/.bin/cucumber-js 
#features/**/*.feature 
#--logLevel=verbose 
#--require step-definitions/**/*.ts 
#--require hooks/**/*.ts  
#--require-module 
#ts-node/register 
#--format-options '{\"snippetInterface\": \"async-await\"}' 
#--format json:reports/cucumber-report.json 
#--format summary 
#--url='http://localhost:3030' 
#--onearmyUrl='http://localhost:8020' 
#--close=false --headless=true",