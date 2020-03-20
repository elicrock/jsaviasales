const $ = sel => document.querySelector(sel);


// Получаем элементы со страницы ------------------------------------------------------------------------------


const formSearch = $('.form-search'),
	inputCitiesFrom = $('.input__cities-from'),
	dropdownCitiesFrom = $('.dropdown__cities-from'),
	inputCitiesTo = $('.input__cities-to'),
	dropdownCitiesTo = $('.dropdown__cities-to'),
	inputDateDepart = $('.input__date-depart');


// Данные


const CITIES_API_LOCAL = 'data/cities.json';
const CITIES_API = 'http://api.travelpayouts.com/data/ru/cities.json',
	PROXY = 'https://cors-anywhere.herokuapp.com/',
	API_TOKEN = '2f09d553a211f7810b27943a504e129e',
	CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

let cities = [];


// Функции ----------------------------------------------------------------------------------------------------


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

const showCity = (input, list) => {
	list.textContent = '';

	if (input.value !== '') {
		let filterCity = cities.filter(item => {
			const fixItem = item.name.toLowerCase();
			return fixItem.includes(input.value.toLowerCase());
		});

		filterCity.sort((a,b) => {
			if (a.name < b.name)
				return -1;
			if (a.name > b.name)
				return 1;
			return 0;
		});

		filterCity = filterCity.filter(item => {
			return item.name.includes(input.value);
		});

		filterCity.forEach(item => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item.name;
			list.append(li);
		});
	}

};

const selectCity = (e, input, list) => {
	const target = e.target;
	if (target.tagName.toLowerCase() ==='li') {
		input.value = target.textContent;
		list.textContent = '';
	}
};

const renderCheapDay = cheapTicket => console.log('cheapTicket: ', cheapTicket);

const renderCheapYear = cheapTickets => {
	cheapTickets.sort((a, b) => {
		if (a.value < b.value) {
			return -1
		} else if (a.value > b.value) {
			return 1
		}
	});
	console.log('cheapTicket: ', cheapTickets);
};


const renderCheap = (data, date) => {
	const cheapTicketYear = JSON.parse(data).best_prices,
		cheapTicketDay = cheapTicketYear.filter(item => item.depart_date === date);

	renderCheapDay(cheapTicketDay);
	renderCheapYear(cheapTicketYear);
};


// Обработчики ------------------------------------------------------------------------------------------------


inputCitiesFrom.addEventListener('input', () => showCity(inputCitiesFrom, dropdownCitiesFrom));

inputCitiesTo.addEventListener('input', () => showCity(inputCitiesTo, dropdownCitiesTo));

dropdownCitiesFrom.addEventListener('click', e => selectCity(e, inputCitiesFrom, dropdownCitiesFrom));

dropdownCitiesTo.addEventListener('click', e => selectCity(e, inputCitiesTo, dropdownCitiesTo));

formSearch.addEventListener('submit', e => {
	e.preventDefault();

	const cityFrom = cities.find(item => inputCitiesFrom.value === item.name);
	const cityTo = cities.find(item => inputCitiesTo.value === item.name);

	const formData = {
		origin: cityFrom.code,
		destination: cityTo.code,
		depart_date: inputDateDepart.value
	};

	const requestData = `
		?depart_date=${formData.depart_date}
		&origin=${formData.origin}
		&destination=${formData.destination}
		&one_way=${true}
	`;

	getData(CALENDAR + requestData, response => renderCheap(response, formData.depart_date));

});


// Вызовы функций ---------------------------------------------------------------------------------------------


getData(PROXY + CITIES_API, data => cities = JSON.parse(data).filter(item => item.name));