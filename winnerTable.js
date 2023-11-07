const API = 'https://sorteototemapi.onrender.com';

let winnerBoard = document.getElementById('winnerboard');

let tableCounter = 0;

async function GetLastRaffle() {
    let GetRaffle = await fetch(`${API}/getLastRaffle`);
    let LastRaffle = await GetRaffle.json();
    let raffle = LastRaffle.data
    console.log(raffle);
    for (let i = 0; i < raffle[0].length; i++) {
        insertTR(raffle[0][i].nombre, raffle[0][i].premio, raffle[0][i].empresa)
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
GetLastRaffle()