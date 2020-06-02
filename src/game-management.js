import holochain from './holochain'

const loadMyGames = async () => {
    const gamesSection = document.getElementById('game-loader')
    const res = (await holochain.loadMyGames()).Ok
    console.log('my games: ',res)
    gamesSection.innerText = ''
    res.forEach(async game=>{
        //load game into html
        let div = document.createElement('div')
        // load stuff into div
        //assign events to div
        gamesSection.appendChild(div)
    })
}

export default async () => {
    document.getElementById('see-games-button').addEventListener('click', async e => {
        e.preventDefault()
        loadMyGames()
    })
}

