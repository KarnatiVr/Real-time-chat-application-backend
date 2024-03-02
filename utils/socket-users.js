let socketUsers={}


function mapSocketToUser(user,socket){
    socketUsers[user]=socket
    console.log("socket to user =>", socketUsers[user])
}

function getSocketMappedToUser(user){
    console.log(socketUsers)
    return socketUsers[user]
}

module.exports={ mapSocketToUser, getSocketMappedToUser}