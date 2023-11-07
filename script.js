const API = 'https://sorteototemapi.onrender.com';

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

let prizes = []
let participants = []


let winners = [];

let tableCounter = 0;

let values = [value1, value2, value3, value4, value5];

let GiveAwayHistory = [];
let BtnSaveHistory = document.getElementById('SaveHistoryButton');

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

    for (let i = 0; i < 5; i++) {
        values[i].style.animationName = 'slotspin';
        personReels[i].style.animationName = 'slotspin'
    }
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const randomIndexPrices = Math.floor(Math.random() * prizes.length)
        const randomprize = prizes[randomIndexPrices];
        const randomWinner = participants[randomIndex];

        participants.push(randomWinner);
        prizes.splice(randomIndexPrices, 1);
        participants.splice(randomIndex, 1);
        console.log(prizes.length);
        console.log(participants.length);
        SaveWinners(randomWinner.nombre, randomprize.premio, randomWinner.Empresa)

        setTimeout(() => {
            images[i].setAttribute('src', `./assets/img/premio${randomprize.tipo}.png`)
            values[i].style.animationName = 'none'

            personReels[i].style.animationName = 'none'
            values[i].style.position = 'relative'
            personReels[i].style.position = 'relative'
            values[i].style.top = `1px`
            nameTags[i].innerHTML = randomWinner.nombre

            insertTR(randomWinner.nombre, randomprize.premio, randomWinner.Empresa)
            if (prizes.length == 0) {
                setTimeout(() => {
                    favDialog.showModal();
                }, 5000)
                return;
            }
        }, 1000 * (i + 1))

    }
}

function insertTR(fullname, prize, location) {
    let rowToInsert = document.createElement('tr');
    tableCounter = tableCounter + 1;
    rowToInsert.innerHTML = `  <tr>
    <td>${tableCounter}</td>
    <td>${fullname}</td>    
    <td>${location}</td>
    <td>${prize}</td>
  </tr>`
    winnerBoard.appendChild(rowToInsert)
}
function SaveWinners(fullname, prize, location) {
    GiveAwayHistory.push({ 'nombre': fullname, 'premio': prize, 'empresa': location });
}

const storeHistory = async function SaveHistory(body = { 'name': 'marcos', 'premio': 'heladera' }) {
    try {
        const PostRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        let saveHistory = await fetch(`${API}/SaveHistory`, PostRequestOptions)
            .then(response => {
                console.log(response);
            })
            .catch(response => {
                console.log('an error ocurred ' + response);
            })
        let res = await saveHistory;
        console.log(res);

    } catch (error) {
        console.log('an error ocurred: ' + error);
    }

}
async function GetPrizesAndParticipants() {
    let GetParticipants = await fetch(`${API}/getParticipants`);
    let ParticipantsResponse = await GetParticipants.json();
    let GetPrices = await fetch(`${API}/getPrizes`);
    let prizesResponse = await GetPrices.json();
    participants = ParticipantsResponse.data;
    prizes = prizesResponse.data;
}
GetPrizesAndParticipants();

btnStopSpin.addEventListener('click', Spin)
BtnSaveHistory.addEventListener('click', () => storeHistory(GiveAwayHistory))


//Save give away before refreshing

window.addEventListener("beforeunload", () => {
    if (GiveAwayHistory.length > 0) {
        localStorage.setItem('savedGiveAway', JSON.stringify(GiveAwayHistory))
        localStorage.setItem('participantsLeft', JSON.stringify(participants))
        localStorage.setItem('prizesLeft', JSON.stringify(prizes))
    } else {
        localStorage.clear()

    }
})
let btndiv = document.getElementById('btnDiv');
if (localStorage.getItem('savedGiveAway') && GiveAwayHistory.length == 0 && localStorage.getItem('participantsLeft') && localStorage.getItem('prizesLeft')) {
    btndiv.innerHTML = `<div>
        <button class="button" onclick="RestoreGiveAway()" style="background-color:rgb(90, 16, 92);border: none;">
        <a>Cargar sorteo</a>
        </button>
      </div>`
    let restoredGiveAway = JSON.parse(localStorage.getItem('savedGiveAway'));
    let participantsLeft = JSON.parse(localStorage.getItem('participantsLeft'));
    let prizesLeft = JSON.parse(localStorage.getItem('prizesLeft'));
    function RestoreGiveAway() {
        for (let i = 0; i < restoredGiveAway.length; i++) {
            insertTR(restoredGiveAway[i].nombre, restoredGiveAway[i].premio, restoredGiveAway[i].empresa)
        }
        console.log("fasdfas" + participantsLeft.length);
        console.log("n,mnm,n" + prizesLeft.length);

        GiveAwayHistory = restoredGiveAway;
        participants = participantsLeft;
        prizes = prizesLeft
        console.log(participants);
        console.log(prizes);
    }
} else { } //pass

//modal window
const favDialog = document.getElementById('favDialog');

