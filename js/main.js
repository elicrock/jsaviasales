'use strict';

document.addEventListener('DOMContentLoaded', function() {

  const formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
        dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
        inputCitiesTo = formSearch.querySelector('.input__cities-to'),
        dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
        inputDateDepart = formSearch.querySelector('.input__date-depart');
  
  // Данные
  const API_KEY = '63abafc1612cb55dc0ae46559955d0b4',
        citiesApi = 'database/cities.json',
        proxy = 'https://cors-anywhere.herokuapp.com/',
        calendar = 'http://min-prices.aviasales.ru/calendar_preload',
        ekbKgd = 'http://min-prices.aviasales.ru/calendar_preload?origin=SVX&destination=KGD&depart_date=2020-05-25';

  let city = [];

  const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;

      if (request.status === 200) {
        callback(request.response);
      } else {
        console.error(request.status);
      }
    });

    request.send();
  };

  const showCity = (input, list) => { // Получаем и фильтруем список городов исходя и данных в input
    list.textContent = '';
  
    if (input.value !== '') {
      const filterCity = city.filter((item) => {
          const fixItem = item.name.toLowerCase();
          return fixItem.includes(input.value.toLowerCase());
      });
  
      filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
      });
    }
  };

  const pickCity = (event, input, list) => { // Выбор города из выпадающего списка
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
      input.value = target.textContent;
      list.textContent = '';
    }

  };
  
  inputCitiesFrom.addEventListener('input', () => { // Показ городов по введенным данным
    showCity(inputCitiesFrom, dropdownCitiesFrom);
  });

  inputCitiesTo.addEventListener('input', () => { // Показ городов по введенным данным
    showCity(inputCitiesTo, dropdownCitiesTo);
  });

  dropdownCitiesFrom.addEventListener('click', (event) => { // Клик по списку городов
    pickCity(event, inputCitiesFrom, dropdownCitiesFrom);
  });

  dropdownCitiesTo.addEventListener('click', (event) => { // Клик по списку городов
    pickCity(event, inputCitiesTo, dropdownCitiesTo);
  });


  // Вызовы функций
  getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
  });

  // Усложненное домашнее задание
  getData(ekbKgd, (data) => {
    const cityData = JSON.parse(data),
          currentDepartDatePrices = cityData.current_depart_date_prices;
          currentDepartDatePrices.forEach((item) => {
            const date = new Date(Date.parse(item.depart_date)).toLocaleDateString("ru", {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            const bilet = `Билет из Екатеринбурга в Калининград на ${date} по цене ${item.value}р. Купить в компании ${item.gate}`;
            console.log(bilet);
          });
  });

});