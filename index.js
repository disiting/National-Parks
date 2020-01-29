'use strict';

// put your own value below!
const apiKey = 'KSaqzXgWQGGwlwlxUXbYx2pYJAdBVELRmIbnqVfB'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function renderStates() {
    for(let i=0; i<STATES.length; i++) {
      $('#js-states').append(`
        <li>  
          <input type="checkbox" name="states" id="option${i+1}" value= "${STATES[i].abbreviation}" tabindex ="${i+1}"> 
          <label for="option${i+1}"> ${STATES[i].name}</label> <br/>
        </li>
      `);
    }
}


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].name} (${responseJson.data[i].states})</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(stateCodesList, maxResults=10) {
  const params = {
    api_key : apiKey,
    stateCode: stateCodesList,
    limit : maxResults
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();

    const stateCodes = [];
    $("input:checkbox[name=states]:checked").each(function() {
        stateCodes.push($(this).val().toLowerCase());
    });
    const stateCodesList = stateCodes.join(',');
    const maxResults = $('#js-max-results').val();
    getParks(stateCodesList, maxResults);
  });
}

renderStates();
$(watchForm);