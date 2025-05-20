// console.log('Hola desde JS');

// URL base de la pokeAPI
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/"

// DOM; Contenedor de los personajes y botones de paginación
const container = document.getElementById('pokemons');
const prevButtons = [
    document.getElementById('prev'),
    document.getElementById('prev_bottom')
]
const nextButtons = [
    document.getElementById('next'),
    document.getElementById('next_bottom')
]
// Variables para controlar la paginación
let offset = 0;
let limit = 20;

// Capitalizar los nombres de los pokemones( pikachu --> Pikachu)
function capitalize(name){
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Función para hacer petición a la API
async function getPokemons(){
    try {
        const response = await fetch(`${URL_BASE}?offset=${offset}&limit=${limit}`);
        // Lanzar un error si la respuesta no fue satisfactoria
        if(!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        // Convertir la respuesta JSON a un Objeto JavaScript
        const data = await response.json();

        // Retornar la data en formato JSON
        return data.results

        } catch (error) {
        container.innerHTML = `<p> ❌ Error al obtener el Pokemon: ${error.message} </p>`
        return[];
    }
}

// Función para obtener la información de cada Pokémon
async function getPokemonDetails(pokemonUrl) {
    try{
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        return {
            name: data.name,
            image: data.sprites.front_default,
            types: data.types.map(t => t.type.name),
            abilities: data.abilities.map(h => h.ability.name),
            stats: data.stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
            })),
            base_experience: data.base_experience,
            weight: data.weight,
            height: data.height

        }
    }catch(error){
        console.error('Error al obtener los detalles del Pokémon', pokemonUrl, error);
        return null;
    }
}



// Crear tarjetas de los Pokemons

function renderPokemons(pokemons) {
    // Limpiar el contenedor antes de insertar los nuevos personajes
    container.innerHTML = "";
    // Iterar osbre cada pokemon
    pokemons.forEach(pokemon => {
        if(!pokemon)return;
        // Crear las "cards" para cada pokemon
        const cards = document.createElement("div");
        cards.className = "cards";

        // Primer tipo del pokemon
        const firsType = pokemon.types[0];

        // Segundo tipo del pokemon
        const secondType = pokemon.types[1];


        // Asignar el color segun el tipo de pokemon
        if(firsType === "normal"){
            cards.style.backgroundColor = typeColors[secondType] || "#171555";
        }
        else{
            cards.style.backgroundColor = typeColors[firsType];
        }
        

        cards.innerHTML = `  
            <img class="character-image" src="${pokemon.image}" alt="${pokemon.name}" />
            <div id="text-cards">
            <h2>${capitalize(pokemon.name)}</h2>
            <p style="font-size: 1.2rem;"> Types: ${pokemon.types.join(", ")}</p>
            <p style="font-size: 1.2rem;"> Abilities: ${pokemon.abilities.join(", ")}</p>
            <p style="font-size: 1.2rem;"> Stats:</p>
            <ul>
                <li style="font-size: 1.2rem;"> HP: ${pokemon.stats.find(s => s.name === 'hp').value}  </li>
                <li style="font-size: 1.2rem;"> Attack: ${pokemon.stats.find(s => s.name === 'attack').value}  </li>
                <li style="font-size: 1.2rem;"> Defense: ${pokemon.stats.find(s => s.name === 'defense').value} </li>
                <li style="font-size: 1.2rem;"> Special-attack: ${pokemon.stats.find(s => s.name === 'special-attack').value} </li>
                <li style="font-size: 1.2rem;"> Special-defense: ${pokemon.stats.find(s => s.name === 'special-defense').value}</li>
                <li style="font-size: 1.2rem;"> Speed: ${pokemon.stats.find(s => s.name === 'speed').value}  </li>

            </ul>
            <p style="font-size: 1.2rem;"> Base experience: ${pokemon.base_experience}</p>
            <p style="font-size: 1.2rem;"> Weight: ${pokemon.weight}</p>
            <p style="font-size: 1.2rem;"> Weight: ${pokemon.height}</p>
            </div>

            `;

            container.appendChild(cards);
    });
}

// Deshabilitación de botones
function updateButtons(){
    prevButtons.forEach(btn => btn.disabled = (offset === 0));
    nextButtons.forEach(btn => btn.disabled = (offset >= 1300));
}

// Cargar y renderizar los pokemones
async function loadAndRenderPokemons() {
    const list = await getPokemons();
    const details = await Promise.all(list.map(pokemon => getPokemonDetails(pokemon.url)));
    renderPokemons(details);
    updateButtons();
    
}

// Evento click para el botón "anterior"
prevButtons.forEach(btn => { // Aplicar la siguiente función a cada boton del array
    btn.addEventListener('click', () => {
        if(offset >= 20){
            offset = offset -20; // disminuir la página actual
            loadAndRenderPokemons(); // obtener los personajes de la nueva página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Evento click para el botón "siguiente"
nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(offset < 1282){
            offset= offset + 20; // incrementar la página actual
            loadAndRenderPokemons(); // obtener los personajes de la nueva página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});


// Llamada inicial para mostrar la primera página de pokemones al cargar la app
loadAndRenderPokemons()

// Cambiar el color de las cartas dependiendo del tipo
const typeColors = {
    fighting: "#8B0000",      // rojo sangre
    flying: "#87CEEB",        // azul cielo
    poison: "#A020F0",        // morado mágico
    ground: "#8B4513",        // café
    rock: "#D3D3D3",          // gris claro
    bug: "#9ACD32",           // verde claro
    ghost: "#FFFFFF",         // blanco
    steel: "#708090",         // gris fuerte tipo metal
    fire: "#FF4500",          // naranja fuego
    water: "#4682B4",         // azul agua (intermedio)
    grass: "#228B22",         // verde más fuerte
    electric: "#FFD700",      // amarillo tipo Pikachu
    psychic: "#FFB6C1",       // fiusha claro
    ice: "#B0C4DE",           // azul grisáceo tipo iceberg
    dragon: "#FF6347",        // rojo claro anaranjado (como tomate)
    dark: "#0B0C10",          // azul muy oscuro casi negro
    fairy: "#FADADD",         // rosado claro
    stellar: "#0F1C3F",       // azul infinito con negro
    unknown: "#DCDCDC"        // gris con blanco
};

