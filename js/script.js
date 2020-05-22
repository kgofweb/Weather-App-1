const weatherIcons = {
        "Rain" : "wi wi-day-rain",
        "Clouds" : "wi wi-day-cloudy",
        "Clear" : "wi wi-day-sunny",
        "Snow" : "wi wi-day-snow",
        "mist" : "wi wi-day-fog",
        "Drizzle" : "wi wi-day-sleet"
};

// Pour mettre la premiere lettre en majiscule
function capitalize (str) {
        return str[0].toUpperCase() + str.slice(1);
}

async function main(withIp = true) {

        let ville;
        /* Changer de ville */
        // Si on n'a withIp
        if (withIp) {

                /* 1. Choper l'adresse IP du PC qui ouvre la page : https://api.ipify.org?format=json */
                const ip = await fetch("https://api.ipify.org?format=json")
                // une fois que u aura recut le contenu de l'url => u vas faire ceci...
                .then(resultat => resultat.json())
                .then(json => json.ip);
                console.log(ip);
                
                /* 2. Choper la ville grace a l'adresse IP : http://freegeoip.app/json/adresseIPDuMec  */
                ville = await fetch('https://freegeoip.app/json/' + ip)
                        .then(response => response.json())
                        .then(json => json.city);
                        console.log(ville);
        }
        else {
                ville = document.querySelector('#ville').textContent;
        }
                                
        /* 3. Choper les informations grace a la ville :  http://api.openweathermap.org/ */
        const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=8e602b9ea28ed4f9f8fc97a5f6d1105c&lang=fr&units=metric`)
                .then(resultat => resultat.json())
                .then(json => json)

                console.log(meteo)

        /* 4. Afficher les information sur la page */
        displayWeatherInfos(meteo);
}

function displayWeatherInfos (data) {

        // Selectionner les bons elements sur la page pour leur donner les bonnes data
        const name = data.name;
        const temperature = data.main.temp;
        const conditions = data.weather[0].main;
        const description = data.weather[0].description;

        // Aller chercher notre span
        document.querySelector('#ville').textContent = name;
        document.querySelector('#temperature').textContent =  Math.round(temperature);
        document.querySelector('#conditions').textContent = capitalize(description);

        // Pour l'icone
        document.querySelector('i.wi').className = weatherIcons[conditions];

        // Pour le background
        document.body.className = conditions.toLowerCase();
}

// Element html editable
const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
        ville.contentEditable = true;
});

// Quand on vas taper (Entrer) on puisse aller chercher la meteo pour la ville en question
ville.addEventListener('keydown', (e) => {
        // Si on appuie sur Entrer
        if (e.keyCode === 13) {
                // rester sur la meme ligne
                e.preventDefault();
                main(false);
        }
});

main();