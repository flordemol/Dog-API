const URL1 = 'https://dog.ceo/api/breeds/list/all'; // URL razas
const URL2 = 'https://dog.ceo/api/breed/xxxxx/images/random'; // URL imagenes
let breeds = []; // Va a contener todas las razas de perro
let dogs = []; // Va a contener todas las imagenes de perros

// Trae las razas de una URL
const fetchBreeds = async (url = URL1) => {
    try {
        const response = await fetch(url, {method: 'GET'})
        const { message: breeds } = await response.json();
        return breeds;
     } catch (err){
        console.error(err);
    }
}

// Trae las urls de las imagenes de perros
const allDogs = () => {
    const regex = 'xxxxx';
    const breedsKeys = Object.keys(breeds);
    breedsKeys.map((breed) => {
        dogs.push(URL2.replace(regex, breed));
    });
    return dogs;
};

// Iterar razas
const iterateBreeds = (breeds) =>{
    const breedsKeys = Object.keys(breeds);
    breedsKeys.map((breed) => loadBreeds(breed))
}

// Cargar Select con razas
const loadBreeds = (breed) => {
    const select = document.getElementById('dog-selector');
    
    const option = `
    <option value="${breed}">${breed}</option>
    `;
    
    select.insertAdjacentHTML("beforeend", option);
}

// Iterar imagenes de perros
const iterateDogs = (dogs) =>{

    dogs.map(async (dog) => {
        try {
            const response = await fetch(dog, {method: 'GET'})
            const  {message : dogImg} = await response.json();
            loadDogs(dogImg);
        } catch (err){
            console.error(err);
        }
    })
}


// Crea cards de todas las imagenes de perros
const loadDogs = (dog) => {

    // Obtiene raza
    let str1 = dog;
    let str2 = str1.slice(30);
    let str3 = str2.split('/');
    let name = str3[0];
    name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
           return letter.toUpperCase();
    });

    const nodo = document.getElementById('apiR');
    const image = `
    <div class="col-md-4 col-12">
        <div class="card mt-5">
            <img src="${dog}" alt="Foto de perro ${name}"/>
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
            </div>
        </div>
    </div>
    `;
    nodo.insertAdjacentHTML("beforeend", image);
}

// Buscador
const searchDog = () => {
    const { value : name} = document.getElementById('dog-selector');

    document.getElementById('apiR').innerHTML = "";
    
    if(name === ""){
        document.getElementById("find").style.visibility = 'visible';
        dogs = allDogs();
        iterateDogs(dogs);

    } else {
        document.getElementById("find").style.visibility = 'hidden';
        const regex = 'xxxxx';
        
        const url = "https://dog.ceo/api/breed/xxxxx/images".replace(regex, name);
        
        const fetchFilter = async (url) =>{
            const response = await fetch(url, {method: 'GET'})
            const { message: dogFilter } = await response.json();
            for (const dog of dogFilter) {
                loadDogs(dog);
            }
        }
           
        fetchFilter(url);
    }
}

// Carga el DOM
const start = async () => {
    document.getElementById("find").addEventListener("click", searchDog);
    document.getElementById("dog-selector").addEventListener("change", searchDog);
    
    breeds = await fetchBreeds();
    iterateBreeds(breeds);

    dogs = allDogs();
    iterateDogs(dogs);
}

window.onload = start();