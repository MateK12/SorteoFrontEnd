const API = 'http://localhost:3000';

//#region value declaration

let value1 = document.getElementById('value1')
let value2 = document.getElementById('value2')
let value3 = document.getElementById('value3')
let value4 = document.getElementById('value4')
let value5 = document.getElementById('value5')
//#endregion
//#region person reels declaration
let personReel1 = document.getElementById('value6');
let personReel2 = document.getElementById('value7');
let personReel3 = document.getElementById('value8');
let personReel4 = document.getElementById('value9');
let personReel5 = document.getElementById('value10');
let personReels = [personReel1, personReel2, personReel3, personReel4, personReel5]
//#endregion
//#region <p> tag region
let nameTag1 = document.getElementById('nameTag1')
let nameTag2 = document.getElementById('nameTag2')
let nameTag3 = document.getElementById('nameTag3')
let nameTag4 = document.getElementById('nameTag4')
let nameTag5 = document.getElementById('nameTag5')
let nameTags = [nameTag1, nameTag2, nameTag3, nameTag4, nameTag5]
//#endregion
let btnStopSpin = document.getElementById('pushButton')
//#region img 
let img1 = document.getElementById('img1');
let img2 = document.getElementById('img2');
let img3 = document.getElementById('img3');
let img4 = document.getElementById('img4');
let img5 = document.getElementById('img5');
let images = [img1, img2, img3, img4, img5]
//#endregion

let winnerBoard = document.getElementById('winnerboard');

let prizes = ['heladera', 'hotel', 'spa', 'telefono', 'televisor', 'hotel', 'spa', 'hotel', 'spa', 'televisor', 'heladera']
let participants = ['juan', 'leopoldo', 'mateo', 'marcelo', 'nicolas', 'flint', 'tomas', 'jimena', 'roxana', 'pablo']


let winners = [];

let values = [value1, value2, value3, value4, value5]


function getRandomValue() {
    return values[Math.floor(Math.random() * 7)]
}

let animationId;

function updateAnimation(newSpeed) {
    if (animationId) clearInterval(animationId)

    animationId = setInterval(() => {

        value1.innerText = getRandomValue()
        value2.innerText = getRandomValue()
        value3.innerText = getRandomValue()

    }, 1000 / newSpeed)
}
function Spin() {
    console.log(prizes);

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * prizes.length);

        const randomprize = prizes[randomIndex];
        const randomWinner = participants[randomIndex];

        participants.push(randomWinner);

        prizes.splice(randomIndex, 1);
        participants.splice(randomIndex, 1);

        setTimeout(() => {
            console.log(randomprize);
            images[i].setAttribute('src', `../assets/${randomprize.nombre}.png`)
            values[i].style.animation = 'none'
            nameTags[i].innerHTML = randomWinner.Nombre + ' ' + randomWinner.Apellidos
            personReels[i].style.animation = 'none'
            console.log('reel stops');
            insertTR(randomWinner.Nombre, randomWinner.Apellidos, randomprize.nombre)
        }, 1000 * (i + 1))

    }
    console.log(prizes);
}

function insertTR(name, lastName, prize) {
    let rowToInsert = document.createElement('tr');
    rowToInsert.innerHTML = `  <tr>
    <td>${name}</td>
    <td>${lastName}</td>
    <td>${prize}</td>
  </tr>`
    winnerBoard.appendChild(rowToInsert)
}
async function GetPrizesAndParticipants() {
    let GetParticipants = await fetch(`${API}/getParticipants`);
    let ParticipantsResponse = await GetParticipants.json();
    let GetPrices = await fetch(`${API}/getPrizes`);
    let prizesResponse = await GetPrices.json();
    participants = ParticipantsResponse.data;
    prizes = prizesResponse.data;
    console.log(prizes);
    console.log(participants);
}
GetPrizesAndParticipants();
btnStopSpin.addEventListener('click', Spin)

