'use strict';

document.addEventListener('DOMContentLoaded', function () {

	const formSearch = document.querySelector('.form-search'),
		inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
		dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
		inputCitiesTo = formSearch.querySelector('.input__cities-to'),
		dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
		inputDateDepart = formSearch.querySelector('.input__date-depart');

	// Данные
	const API_KEY = '63abafc1612cb55dc0ae46559955d0b4',
		// citiesApi = 'database/cities.json',
		citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
		proxy = 'https://cors-anywhere.herokuapp.com/',
		calendar = 'http://min-prices.aviasales.ru/calendar_preload';

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
	
	const renderCheapDay = (cheapTicket) => {
		console.log(cheapTicket);
	};

	const renderCheapYear = (cheapTickets) => {
		console.log(cheapTickets);
	};

	const renderCheap = (data, date) => {
		const cheapTicketYear = JSON.parse(data).best_prices;
		const cheapTicketDay = cheapTicketYear.filter((item) => {
			return item.depart_date === date;
		});

		renderCheapDay(cheapTicketDay);
		renderCheapYear(cheapTicketYear);

	};

	// Обработчики событий

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

	formSearch.addEventListener('submit', (event) => {
		event.preventDefault();

		const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
		const cityTo = city.find((item) => inputCitiesTo.value === item.name);

		const formData = {
			from: cityFrom.code,
			to: cityTo.code,
			when: inputDateDepart.value,
		};

		const requestData = `?depart_date=${formData.when}&origin=${formData.from}` +
		`&destination=${formData.to}&one_way=true`;

		getData(calendar + requestData, (response) => {
			renderCheap(response, formData.when);
		});

	});

	// Вызовы функций
	getData(proxy + citiesApi, (data) => {
		city = JSON.parse(data).filter(item => item.name);
	});

});