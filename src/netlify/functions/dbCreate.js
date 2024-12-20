"use strict";

const redis = require("./redisDB");
const headers = require("./headersCORS");

// Datos para inicializar
const supercars = [
    {
      "id": 1,
      "name": "Lamborghini Aventador",
      "release_year": 2011,
      "description": "A flagship V12 supercar with a futuristic design and breathtaking performance.",
      "top_speed": "350 km/h",
      "horsepower": 730,
      "acceleration": "2.9 seconds (0-100 km/h)",
      "price": "$500,000",
      "image": "supercars/lamborghini-aventador.jpg",
      "manufacturer": {
        "id": 1,
        "name": "Lamborghini"
      },
      "designer": {
        "id": 1,
        "name": "Filippo Perini"
      }
    },
    {
      "id": 2,
      "name": "Ferrari LaFerrari",
      "release_year": 2013,
      "description": "Ferrari’s hybrid hypercar with a combination of V12 power and electric motors for extraordinary performance.",
      "top_speed": "350 km/h",
      "horsepower": 950,
      "acceleration": "2.6 seconds (0-100 km/h)",
      "price": "$1.4 million",
      "image": "supercars/ferrari-laferrari.jpg",
      "manufacturer": {
        "id": 2,
        "name": "Ferrari"
      },
      "designer": {
        "id": 2,
        "name": "Flavio Manzoni"
      }
    },
    {
      "id": 3,
      "name": "Porsche 911 GT3 RS",
      "release_year": 2018,
      "description": "A track-focused version of Porsche’s iconic 911, blending speed, agility, and precision.",
      "top_speed": "312 km/h",
      "horsepower": 520,
      "acceleration": "3.2 seconds (0-100 km/h)",
      "price": "$200,000",
      "image": "supercars/porsche-911-gt3-rs.jpg",
      "manufacturer": {
        "id": 3,
        "name": "Porsche"
      },
      "designer": {
        "id": 3,
        "name": "Michael Mauer"
      }
    },
    {
      "id": 4,
      "name": "McLaren P1",
      "release_year": 2013,
      "description": "McLaren’s hybrid hypercar, combining electric motors with a twin-turbo V8 for astounding performance.",
      "top_speed": "350 km/h",
      "horsepower": 903,
      "acceleration": "2.8 seconds (0-100 km/h)",
      "price": "$1.15 million",
      "image": "supercars/mclaren-p1.jpg",
      "manufacturer": {
        "id": 4,
        "name": "McLaren"
      },
      "designer": {
        "id": 4,
        "name": "Frank Stephenson"
      }
    },
    {
      "id": 5,
      "name": "Bugatti Chiron",
      "release_year": 2016,
      "description": "The ultimate hypercar, combining a quad-turbo W16 engine and luxurious craftsmanship.",
      "top_speed": "420 km/h",
      "horsepower": 1500,
      "acceleration": "2.4 seconds (0-100 km/h)",
      "price": "$3 million",
      "image": "supercars/bugatti-chiron.jpg",
      "manufacturer": {
        "id": 5,
        "name": "Bugatti"
      },
      "designer": {
        "id": 5,
        "name": "Achim Anscheidt"
      }
    }
  ];

const designers = [
    {
      "id": 1,
      "name": "Filippo Perini",
      "nationality": "Italian",
      "born_year": 1973,
      "description": "Former chief designer for Lamborghini, known for creating iconic models like the Aventador and Huracán.",
      "image": "designers/filippo-perini.jpg"
    },
    {
      "id": 2,
      "name": "Flavio Manzoni",
      "nationality": "Italian",
      "born_year": 1965,
      "description": "Ferrari’s chief designer responsible for creating masterpieces like the LaFerrari and F12 Berlinetta.",
      "image": "designers/flavio-manzoni.jpg"
    },
    {
      "id": 3,
      "name": "Michael Mauer",
      "nationality": "German",
      "born_year": 1962,
      "description": "Head of design at Porsche, known for shaping the modern evolution of the iconic 911.",
      "image": "designers/michael-mauer.jpg"
    },
    {
      "id": 4,
      "name": "Frank Stephenson",
      "nationality": "American",
      "born_year": 1959,
      "description": "Former McLaren designer responsible for the P1 and other groundbreaking supercars.",
      "image": "designers/frank-stephenson.jpg"
    },
    {
      "id": 5,
      "name": "Achim Anscheidt",
      "nationality": "German",
      "born_year": 1967,
      "description": "Head of design at Bugatti, overseeing the creation of models like the Veyron and Chiron.",
      "image": "designers/achim-anscheidt.jpg"
    }
  ];

const manufacturers = [
    {
      "id": 1,
      "name": "Filippo Perini",
      "nationality": "Italian",
      "born_year": 1973,
      "description": "Former chief designer for Lamborghini, known for creating iconic models like the Aventador and Huracán.",
      "image": "designers/filippo-perini.jpg"
    },
    {
      "id": 2,
      "name": "Flavio Manzoni",
      "nationality": "Italian",
      "born_year": 1965,
      "description": "Ferrari’s chief designer responsible for creating masterpieces like the LaFerrari and F12 Berlinetta.",
      "image": "designers/flavio-manzoni.jpg"
    },
    {
      "id": 3,
      "name": "Michael Mauer",
      "nationality": "German",
      "born_year": 1962,
      "description": "Head of design at Porsche, known for shaping the modern evolution of the iconic 911.",
      "image": "designers/michael-mauer.jpg"
    },
    {
      "id": 4,
      "name": "Frank Stephenson",
      "nationality": "American",
      "born_year": 1959,
      "description": "Former McLaren designer responsible for the P1 and other groundbreaking supercars.",
      "image": "designers/frank-stephenson.jpg"
    },
    {
      "id": 5,
      "name": "Achim Anscheidt",
      "nationality": "German",
      "born_year": 1967,
      "description": "Head of design at Bugatti, overseeing the creation of models like the Veyron and Chiron.",
      "image": "designers/achim-anscheidt.jpg"
    }
  ];

// Utilidad para almacenar datos en Redis
async function saveCollection(keyPrefix, data) {
  const n = data.length;
  for (let i = 0; i < n; i++) {
    await redis.set(`${keyPrefix}_${i + 1}`, JSON.stringify(data[i]));
  }
  await redis.set(`${keyPrefix}_N`, n);
}

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    redis.on("connect", function () {
      console.log("Connected to Redis");
    });

    // Guardar datos en Redis
    await saveCollection("supercar", supercars);
    await saveCollection("designer", designers);
    await saveCollection("manufacturer", manufacturers);

    return { statusCode: 200, headers, body: "Database initialized successfully." };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
