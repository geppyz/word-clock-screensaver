/* global document */

'use strict';

/** DOM
----------------------------------------------------------------------------- */
const wordClock = document.createElement('word-clock');
document.body.appendChild(wordClock);

// Set wordClock
function updateWordClock(string) {
	if (wordClock.innerText.toLowerCase() === string) {
		return;
	}
	const currentChars = Array.from(wordClock.innerText.toLowerCase());
	const newChars = Array.from(string);

	let overlapCharCount = 0;

	currentChars.forEach((char, i) => {
		if (char === newChars[i]) {
			overlapCharCount += 1;
		}
	});

	// Take of one by one anything above overlap
	const charsToRemove = (currentChars.length - overlapCharCount) + 1;
	const removeString = currentChars.join('');

	const keystrokeDelay = 60;
	let removeDelayTotal;

	for (let i = 0; i < charsToRemove; i++) {
		setTimeout(() => {
			setWordClock(removeString.slice(0, currentChars.length - i))
		}, keystrokeDelay * i)
		removeDelayTotal = keystrokeDelay * i;
	}

	// Put on one by one new chars above overlap
	const charsToAdd = (newChars.length - overlapCharCount) + 1;
	const addString = newChars.join('');
	for (let i = 0; i < charsToAdd; i++) {
		setTimeout(() => {
			setWordClock(addString.slice(0, overlapCharCount + i))
		}, (keystrokeDelay * i) + removeDelayTotal)
	}

}

function setWordClock(string) {
	// Franklin Gothic Black needs a bit of TLC
	string = string.replace('pa', '<span class="kern">p</span>a');
	string = string.replace('lv', '<span class="kern">l</span>v');
	wordClock.innerHTML = string;
}

/** Init / Update Clock
----------------------------------------------------------------------------- */
function update() {
	const words = getTimeWordsEN(getTime());
	updateWordClock(words);
}

setInterval(update, 2500);
update();

// Get Time
function getTime() {
	const now = new Date();
	return {
		h: now.getHours(),
		m: now.getMinutes()
	};
}

/** Time to word conversion - English
----------------------------------------------------------------------------- */

/** Time to words in English
 *
 * @param {object} time - Current time
 * @param {number} time.h - Current hour [0-23]
 * @param {number} time.m - Current minute [0-59]
 * @returns {string} The provided time in words, in an english-sounding way.
 */
function getTimeWordsEN(time) {
	// Midday
	if (parseInt(time.h, 10) === 12 && parseInt(time.m, 10) === 0) {
		return `middag`;
	}
	// Midnight
	if (parseInt(time.h, 10) === 0 && parseInt(time.m, 10) === 0) {
		return `nacht`;
	}

	// One minute past [hour]
	if (parseInt(time.m, 10) === 1) {
		return `een minuut na ${hourIntToWord(time.h)}`;
	}

	// [minutes >= 12] past [hour]
	if (time.m >= 2 && time.m <= 12) {
		return `${minutesIntToWord(time.m)} past ${hourIntToWord(time.h)}`;
	}

	// [something] past/to [hour]
	switch (time.m) { // eslint-disable-line default-case
		case 0:
			return `${hourIntToWord(time.h)} o'clock`;
		case 15:
			return `kwart over  ${hourIntToWord(time.h)}`;
		case 20:
			return `twintig over ${hourIntToWord(time.h)}`;
		case 30:
			return `half ${hourIntToWord(time.h)}`;
		case 40:
			return `twintig voor ${hourIntToWord(time.h + 1)}`;
		case 45:
			return `kwart voor ${hourIntToWord(time.h + 1)}`;
		case 50:
			return `tien voor ${hourIntToWord(time.h + 1)}`;
		case 55:
			return `vijf voor ${hourIntToWord(time.h + 1)}`;
	}

	// No special case, just [hour] [minutes]
	return `${hourIntToWord(time.h)} ${minutesIntToWord(time.m)}`;
}

function hourIntToWord(int) { // eslint-disable-line complexity
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 0:
		case 24: // Next hour + 1, twenty, quarter, ten, five to.
		case 12:
			return 'twaalf';
		case 1:
		case 13:
			return 'een';
		case 2:
		case 14:
			return 'twee';
		case 3:
		case 15:
			return 'drie';
		case 4:
		case 16:
			return 'vier';
		case 5:
		case 17:
			return 'vijf';
		case 6:
		case 18:
			return 'zes';
		case 7:
		case 19:
			return 'zeven';
		case 8:
		case 20:
			return 'acht';
		case 9:
		case 21:
			return 'negen';
		case 10:
		case 22:
			return 'tien';
		case 11:
		case 23:
			return 'elf';
	}
}

function minutesIntToWord(int) {
	if (int <= 19) {
		return baseIntToWord(int);
	}
	if (int >= 20) {
		const tens = tensIntToWord(int.toString()[0] * 10);
		const units = baseIntToWord(int.toString()[1]);
		return `${tens} ${units}`;
	}
}

function baseIntToWord(int) {
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 1:
			return 'een';
		case 2:
			return 'twee';
		case 3:
			return 'drie';
		case 4:
			return 'vier';
		case 5:
			return 'vijf';
		case 6:
			return 'zes';
		case 7:
			return 'zeven';
		case 8:
			return 'acht';
		case 9:
			return 'negen';
		case 10:
			return 'tien';
		case 11:
			return 'elf';
		case 12:
			return 'twaalf';
		case 13:
			return 'dertien';
		case 14:
			return 'veertien';
		case 15:
			return 'vijftien';
		case 16:
			return 'zestien';
		case 17:
			return 'zeventien';
		case 18:
			return 'achttien';
		case 19:
			return 'negentien';
	}
}

function tensIntToWord(int) {
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 10:
			return 'tien';
		case 20:
			return 'twintig';
		case 30:
			return 'dertig';
		case 40:
			return 'veertig';
		case 50:
			return 'vijftig';
	}
}
