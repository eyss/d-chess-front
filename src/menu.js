const openSection = sectionName => {
    [...document.querySelectorAll('main > div')].forEach(div=>{
        div.style.display = 'none'
    })
    document.getElementById(sectionName).style.display = 'block'
}

export default async () => {
    document.getElementById('see-invitations-button').addEventListener('click', async e => {
        openSection('invitations')
    })
}

