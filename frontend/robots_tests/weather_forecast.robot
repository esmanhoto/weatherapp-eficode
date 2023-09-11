*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open My Web Application
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}        Chrome
${URL}            http://localhost:8000

*** Test Cases ***

Weather Forecast Component Should Render
    Wait Until Element Is Visible    css=[data-test-id='forecastContainer']    5s
    Element Should Be Visible    css=[data-test-id='forecastContainer']
    Element Should Be Visible    css=[data-test-id='dateTabs']
    Wait Until Element Is Visible    css=[data-test-id='dateButton']    5s
    ${dates}=    Get WebElements    css=[data-test-id='dateButton']
    Length Should Be    ${dates}    5    msg=Expected 5 dates, but found only ${dates}.
    Element Should Be Visible    css=[data-test-id='forecastTable']
    ${forecast_entries}=    Get WebElements    css=[data-test-id='forecastEntry']
    ${lenForecast} =    Get Length    ${forecast_entries}
    Should Be True    ${lenForecast > 1}    msg=Expected more than one forecast entry, but found only ${lenForecast}.


*** Keywords ***

Open My Web Application
    Open Browser    ${URL}    ${BROWSER}



