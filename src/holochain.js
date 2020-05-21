import { connect } from '@holochain/hc-web-client'


const call = (functionName, params = {}) => {
    return new Promise((succ,err)=>{
        connect(
            process.env.NODE_ENV==="development"?{ url: "ws://localhost:3400"}:undefined
        ).then(async ({callZome, close}) => {
            let zCall = await callZome('__H_Wiki', 'game', functionName)(params)
            console.log('zCall')
            console.log(zCall)
            succ(
                JSON.parse(zCall)
            )
        }).catch(error=>{
            err(error)
        })
    })
}

const holochain = {
    isUserCreated : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_my_profile', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    createProfile : (username) => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('create_profile', {username})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    inviteUser : (username) => {
        return new Promise(async (succ,err) => {
            const timestamp = (new Date()).getTime()
            try{
                const res = await call('invite_user', {username, timestamp})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    getSentInvitations : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_sent_invitations', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    getReceivedInvitations : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_received_invitations', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    acceptInvitation : (inviter, invited, invitation_timestamp) => {
        return new Promise(async (succ,err) => {
            const timestamp = (new Date()).getTime()
            try{
                const res = await call('accept_invitation', {inviter, invited, timestamp, invitation_timestamp})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    rejectInvitation : (inviter, invited, invitation_timestamp) => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('reject_invitation', {inviter, invited, invitation_timestamp})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    getUsername : (addr) => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_username', {addr})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    getMyPublicAddress : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_my_public_address', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
}

export default holochain