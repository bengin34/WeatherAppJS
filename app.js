//DOM elements

const form = document.querySelector(".search-form");
const input = document.querySelector("#search-term");
const msg = document.querySelector(".form-msg");
const list = document.querySelector(".cities");

//API KEY
const apiKey = "43f3d3471358a0770f15f24ec227b978";

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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
