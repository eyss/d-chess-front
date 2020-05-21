import holochain from './holochain'

const sentButton = document.getElementById('sent'),
    receivedButton = document.getElementById('received'),
    sentSection = document.getElementById('sent-invitations'),
    receivedSection = document.getElementById('received-invitations')

const acceptInvitation = async (inviter, invited, ts, div) => {
    const res = await holochain.acceptInvitation(inviter, invited, ts)
    if (res.Err) {
        alert('an error has ocurred')
    } else {
        div.remove()
    }
}
const rejectInvitation = async (inviter, invited, ts, div) => {
    const res = await holochain.rejectInvitation(inviter, invited, ts)
    if (res.Err) {
        alert('an error has ocurred')
    } else {
        div.remove()
    }
}

const loadSent = data => {
    sentSection.innerText = ''
    data.forEach(async invitation => {
        let div = document.createElement('div')
        const opponentAddress = invitation.invited
        sentSection.appendChild(div)
        let opponentUsername = await holochain.getUsername(opponentAddress)
        div.innerText = `${opponentUsername.Ok} (${invitation.status})` 
    })
}
const loadReceived = data => {
    receivedSection.innerText = ''
    data = data.filter(d=>d.status === 'Pending')
    data.forEach(async invitation => {
        let div = document.createElement('div')
        let buttonsDiv = document.createElement('div')
        let usernameDiv = document.createElement('div')
        const opponentAddress = invitation.inviter
        receivedSection.appendChild(div)
        let opponentUsername = await holochain.getUsername(opponentAddress)
        usernameDiv.innerText = opponentUsername.Ok
        div.appendChild(usernameDiv)
        let accept = document.createElement('button')
        accept.innerText = 'accept'
        let reject = document.createElement('button')
        reject.innerText = 'reject'
        buttonsDiv.appendChild(accept)
        buttonsDiv.appendChild(reject)
        div.appendChild(buttonsDiv)
        accept.addEventListener('click',()=>{acceptInvitation(invitation.inviter, invitation.invited, invitation.timestamp, div)})
        reject.addEventListener('click',()=>{rejectInvitation(invitation.inviter, invitation.invited, invitation.timestamp, div)})
    })
}

const loadInvitations = async (functionName) => {
    const res = (await holochain[functionName]()).Ok
    if (functionName === 'getSentInvitations') {
        loadSent(res)
    } else {
        loadReceived(res)
    }
    console.log(`invitations loaded via ${functionName}:`, res)
}

const selectInvitationKind = kind => {
    if (kind === 'sent') {
        sentButton.classList.add('selected')
        receivedButton.classList.remove('selected')
        sentSection.classList.add('selected')
        receivedSection.classList.remove('selected')
        loadInvitations('getSentInvitations', sentSection)
    } else {//received
        receivedButton.classList.add('selected')
        sentButton.classList.remove('selected')
        receivedSection.classList.add('selected')
        sentSection.classList.remove('selected')
        loadInvitations('getReceivedInvitations', receivedSection)
    }
}

export default async () => {
    document.getElementById('see-invitations-button').addEventListener('click', async e => {
        e.preventDefault()
        selectInvitationKind('received')
    })
    document.getElementById('received').addEventListener('click', async e => {
        e.preventDefault()
        selectInvitationKind('received')
    })
    document.getElementById('sent').addEventListener('click', async e => {
        e.preventDefault()
        selectInvitationKind('sent')
    })
}

