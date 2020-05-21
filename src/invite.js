import holochain from './holochain'

export default async () => {
    document.getElementById('invite-button').addEventListener('click', async e => {
        e.preventDefault()
        const name = document.getElementById('invite-input').value
        if (!name || name.length < 4) {
            alert('A username must be at least 4 characters long')
            return
        }
        let res = await holochain.inviteUser(name)
        if (res.Ok) {
            alert('Invitation sent!')
        } else {
            alert('Rival not found!')
        }
        document.getElementById('invite').parentNode.style.display = 'none'
    })
}

