import holochain from './holochain'

export default async () => {
    const res = await holochain.isUserCreated()
    
    if (!res) {
        document.getElementById('get-username').parentNode.style.display = 'block'
    }
}
