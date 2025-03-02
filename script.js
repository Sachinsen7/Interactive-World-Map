document.addEventListener("DOMContentLoaded", function () {
  const map = document.querySelector("svg");
  const countries = document.querySelectorAll("path");
  const sidePanel = document.querySelector(".side-panel");
  const container = document.querySelector(".side-container");
  const loading = document.querySelector(".loading");
  const closeBtn = document.querySelector(".close-button");
  const zoomIn = document.querySelector(".zoom-in");
  const zoomOut = document.querySelector(".zoom-out");
  const zoomValueOutput = document.querySelector(".zoom-value");
  const countryNameOutput = document.querySelector(".country-name");
  const countryFlagOutput = document.querySelector(".country-flag");
  const cityOutput = document.querySelector(".capital");
  const populationOutput = document.querySelector(".populations");
  const areaOutput = document.querySelector(".area");
  const currencyOutput = document.querySelector(".currency");
  const languagesOutput = document.querySelector(".Languages");

  //Start from here

  countries.forEach((country) => {
    // country.addEventListener("mouseenter", function () {
    //   const classList = [...this.classList].join(".");
    //   const selector = "." + classList;

    //   // select all the pieces of elements
    //   const matchingElements = document.querySelectorAll(selector);
    //   matchingElements.forEach((el) => (el.style.fill = "black"));
    // });

    // country.addEventListener("mouseout", function () {
    //   const classList = [...this.classList].join(".");
    //   const selector = "." + classList;
    //   const matchingElements = document.querySelectorAll(selector);

    //   matchingElements.forEach((el) => (el.style.fill = "white"));
    // });

    country.addEventListener("click", function (e) {
      //assigning the text
      loading.innerHTML = "Loading...";

      container.classList.add("hidden");
      loading.classList.remove("hidden");

      let clickedCountryName;

      if (e.target.hasAttribute("name")) {
        clickedCountryName = e.target.getAttribute("name");
        console.log(clickedCountryName);
      } else {
        clickedCountryName = e.target.classList.value;
        console.log(clickedCountryName);
      }

      // open the side panel

      sidePanel.classList.add("side-panel-open");
      fetch(
        `https://restcountries.com/v3.1/name/${clickedCountryName}?fu11Text=true`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was no ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setTimeout(() => {
            countryNameOutput.innerHTML = data[0].name.common;
            console.log(countryNameOutput);
            countryFlagOutput.src = data[0].flags.png;
            cityOutput.innerHTML = data[0].capital;
            populationOutput.innerHTML = data[0].population;

            const formattedNumber = data[0].area;
            areaOutput.innerHTML = `${formattedNumber.toLocaleString()} km<sup>2</sup>`;

            // currency

            const currency = data[0].currencies;
            currencyOutput.innerHTML = "";

            Object.keys(currency).forEach((key) => {
              currencyOutput.innerHTML += `<li>${currency[key].name}</li>`;

              console.log(currency[key].name);
            });

            //languages

            const languages = data[0].languages;
            languagesOutput.innerHTML = "";

            Object.keys(languages).forEach((key) => {
              languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
            });

            countryFlagOutput.onload = () => {
              container.classList.remove("hidden");
              loading.classList.add("hidden");
            };

            countryFlagOutput.onerror = () => {
              loading.innerHTML = "Failed to load flag image";
              console.log("Error loading flag image");
            };
          }, 500);
        })
        .catch((error) => {
          loading.innerHTML = "No data to show for selected country";
          console.log("There was a problem with the operation", error);
        });
    });
  });

  closeBtn.addEventListener("click", function () {
    sidePanel.classList.remove("side-panel-open");
  });

  let zoomValue = 100;

  zoomValueOutput.disabled = true;
  zoomIn.addEventListener("click", function () {
    zoomValueOutput.disabled = false;
    zoomValue += 100;
    if (zoomValue >= 500) {
      zoomIn.disabled = true;
    } else {
      zoomIn.disabled = false;
    }
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";

    zoomValueOutput.innerHTML = zoomValue + "%";
  });

  zoomOut.addEventListener("click", function () {
    zoomValueOutput.disabled = false;
    zoomValue -= 100;
    if (zoomValue <= 100) {
      zoomOut.disabled = true;
    } else {
      zoomOut.disabled = false;
    }
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";

    zoomValueOutput.innerHTML = zoomValue + "%";
  });
});
