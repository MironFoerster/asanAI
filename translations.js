"use strict";

// Get the language from the cookie or use the default language
var lang_cookie_name = "language_cookie";
var lang = get_lang_cookie();

var labels_lang = 'de';

const urlParams = new URLSearchParams(window.location.search);

// Check if the parameter "start_cosmo" exists
if (urlParams.has('start_cosmo')) {
	lang = 'de';
}

function swap_image_src_language () {
	// Get all image elements on the page
	const images = document.getElementsByTagName('img');

	// Loop through each image element
	for (var i = 0; i < images.length; i++) {
		const img = images[i];
		const currentSrc = img.getAttribute('src');

		if (lang === 'en' && currentSrc.startsWith('lang/__de__')) {
			// Replace 'de' with 'en'
			const newSrc = currentSrc.replace(/__de__/, '__en__');
			img.setAttribute('src', newSrc);
		} else if (lang === 'de' && currentSrc.startsWith('lang/__en__')) {
			// Replace 'en' with 'de'
			const newSrc = currentSrc.replace(/__en__/, '__de__');
			img.setAttribute('src', newSrc);
		} else if (lang === 'en' && currentSrc.startsWith('presentation/de/')) {
			// Replace 'de' with 'en'
			const newSrc = currentSrc.replace(/\/de\//, '/en/');
			img.setAttribute('src', newSrc);
		} else if (lang === 'de' && currentSrc.startsWith('presentation/en/')) {
			// Replace 'en' with 'de'
			const newSrc = currentSrc.replace(/\/en\//, '/de/');
			img.setAttribute('src', newSrc);
		}
	}
}

// Function to set the language and update translations
function set_lang(la) {
	lang = la;
	set_cookie('lang', l, 30); // Save the language in a cookie for 30 days
	update_translations();

	swap_image_src_language();
}

// Function to retrieve a cookie value
function get_lang_cookie() {
	const cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(lang_cookie_name + '=')) {
			return cookie.substring(lang_cookie_name.length + 1);
		}
	}
	return 'en';
}

// Function to set a cookie value
function set_lang_cookie(value, days) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + days);
	const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
	document.cookie = lang_cookie_name + '=' + cookieValue;
}

// Function to update the translation of elements
async function update_translations() {
	var elements = document.querySelectorAll('[class^="TRANSLATEME_"]');
	elements.forEach((element) => {
		const translationKey = element.classList[0].substring(12);
		const translation = language[lang][translationKey];
		if (translation) {
			if($(element).attr("data-lang") != lang) {
				element.innerHTML = translation;

				$(element).attr("data-lang", lang)
			}
		} else {
			alert("Could not translate " + translationKey + " to " + lang);
		}

	});

	if(is_cosmo_mode) {
		if(lang != labels_lang) {
			await cosmo_set_labels();
			labels_lang = lang;
		}
	}
}

// Update translations when language selector links are clicked
var languageSelectors = $(".language-selector").find("span");
Array.from(languageSelectors).forEach((selector) => {
	selector.addEventListener('click', function (event) {
		event.preventDefault();
		const newLang = this.dataset.lang;
		if (newLang !== lang) {
			set_lang(newLang);
		}
	});
});

// Update translations when language is changed via URL parameter
window.addEventListener('popstate', function () {
	const newLang = urlParams.get('lang') || 'en';
	if (newLang !== lang) {
		set_lang(newLang);
	}
});

async function update_lang(la) {
	lang = la;
	await update_translations();
	set_lang_cookie(lang, 99999);
}

function trm (name) {
	if(Object.keys(language[lang]).includes(name)) {
		return `<span class='TRANSLATEME_${name}'></span>`
	}

	alert(`${name} NOT FOUND`);

	return `${name} NOT FOUND`;
}

// Update translations on initial page load
update_translations();
