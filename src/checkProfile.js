import holochain from './holochain'

document.getElementById('send-username-button').addEventListener('click', async e => {
    e.preventDefault()
    const name = document.getElementById('send-username-input').value
    if (!name || name.length < 4) {
        alert('your username must have at least 4 characters')
        return
    }
    let res = await holochain.createProfile(name)
    console.log('create profile: ', res)
    window.location.reload()
})

export default async () => {
    const res = await holochain.isUserCreated()
    console.log(res)
    if (res.Err) {
        document.getElementById('get-username').parentNode.style.display = 'block'
    } else {
        const address = await holochain.getMyPublicAddress()
        window.myAddress = address.Ok
    }
}
