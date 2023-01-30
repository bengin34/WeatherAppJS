//DOM elements

const form = document.querySelector(".search-form");
const input = document.querySelector("#search-term");
const msg = document.querySelector(".form-msg");
const list = document.querySelector(".cities");

//API KEY
const apiKey =  "43f3d3471358a0770f15f24ec227b978";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  msg.textContent = "";
  msg.classList.remove("visible");

  let inputCity = input.value;

  //check the same city

  const listItemsArray = Array.from(list.querySelectorAll(".cities li"));
  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((e) => {
      let content = "";
      let cityName = e.querySelector(".city__name").textContent.toLowerCase();
      let cityCountry = e
        .querySelector(".city__country")
        .textContent.toLowerCase();

      //check for the city ,country input

      if (inputCity.includes(",")) {
        if (inputCity.split(",")[1].length > 2) {
          inputCity = input.split(",")[0];

          content = cityName;
        } else {
          content = `${cityName},${cityCountry}`;
        }
      } else {
        content = cityName;
      }

      return content == inputCity.toLowerCase();
    });
    console.log(filteredArray);

    if (filteredArray.length > 0) {
      msg.textContent = `Before you checked for ${
        filteredArray[0].querySelector(".city__name").textContent
      }`;
      msg.classList.add("visible");

      form.reset();
      input.focus();
    }
  }

  //AJAX magic
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;


	fetch(url)
		.then(response => response.json())
		.then(data => {
			// If we get a 404 code, throw an error
			if (data.cod == '404') {
				throw new Error(`${data.cod}, ${data.message}`)
			}

			// Let's destructure the data object
			const {main, name, sys, weather} = data

			// Define the icon location
			const icon = `./icons/${weather[0].icon}.png`

			// Create the list item for the new city
			const li = document.createElement('li')

			// Define markup
			const markup = `
				<figure>
					<img src="${icon}" alt="${weather[0]['description']}">
				</figure>
				<div>
					<h2>${Math.round(main.temp)}<sup>°C</sup></h2>
					<p class="city__conditions">${weather[0]['description'].toUpperCase()}</p>
					<h3><span class="city__name">${name}</span><span class="city__country">${sys.country}</span></h3>
				</div>
			`

			// Add the new markup to the list item
			li.innerHTML = markup

			// Add the new list item to the page
			list.appendChild(li)
		})
		.catch(() => {
			msg.textContent = 'Please search for a valid city!'
			msg.classList.add('visible')
		})

	msg.textContent = ''

	form.reset()
	input.focus()
})
