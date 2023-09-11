*** Settings ***
Library    Browser

Suite Setup       Open My Web Application
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://localhost:8000

*** Test Cases ***

Weather Forecast Component Should Render
    Wait For Elements State    css=[data-test-id='forecastContainer']    visible    timeout=5s
    ${container_is_visible}=    Browser.Get Elements    css=[data-test-id='forecastContainer']    
    Should Be True    ${container_is_visible}    The forecastContainer element should be visible.

    ${date_container_is_visible}=    Browser.Get Elements    css=[data-test-id='forecastContainer']    
    Should Be True    ${date_container_is_visible}    The forecastContainer element should be visible.

    ${date_button_is_visible}=    Browser.Get Elements    css=[data-test-id='forecastContainer']    
    Should Be True    ${date_button_is_visible}    The forecastContainer element should be visible.


*** Keywords ***

Open My Web Application
    New Browser    chromium    headless=True
    New Page    ${URL}


