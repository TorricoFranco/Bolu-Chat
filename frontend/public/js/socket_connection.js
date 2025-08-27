import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
const API_URL = window.API_URL || 'http://localhost:3000'
const userOwn = window.userOwn || localStorage.getItem('username') || 'Usuario Desconocido'

const socket = io({
  auth: {
    username: userOwn,
    serverOffset: 0
  }
})

// Profile IMAGE URL
const URLOwn = localStorage.getItem('profileURL');
profileImage.src = `${API_URL}/uploads/${URLOwn}`

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')


// Formatear Date

const formatDate = (date) => {
    
    const localDate = new Date(date)
    // console.log(localDate)
    // console.log("Local Date:", localDate.toLocaleTimeString());
    
    
    const hours = localDate.getHours().toString().padStart(2, "0")
    const minutes = localDate.getMinutes().toString().padStart(2, "0")
    const timeStr = `${hours}:${minutes}`
    return timeStr
}


//SOCKET CONNECTION MESSAGE
socket.on('chat message', ({ msg, serverOffset, username, date, url }) => {
  
    let newURL = url ? url : 'profile-default.jpg'
    const chatImageURL = `${API_URL}/uploads/${newURL}`
    const dateFormat = formatDate(date)

    // Perfil de usuario propio
  let isOwnMessage = username === userOwn;

  if (isOwnMessage && !url) {
    let localProfile = localStorage.getItem('profileURL')
    chatImageURL = `${API_URL}/uploads/${localProfile}`
  } else if (isOwnMessage && url) {
    localStorage.setItem('profileURL', url);
    profileImage.src = `${API_URL}/uploads/${url}`;
  }

const item = `
  <li class="message ${isOwnMessage ? 'message-right' : ''}">
      <img src="${chatImageURL}" class="profileChat" />
        <div>
            <small>${username} - ${dateFormat}</small>
            <p>${msg}</p>
            </div>
        </li> 
    `;

    messages.insertAdjacentHTML('beforeend', item);
    socket.auth.serverOffset = serverOffset;
    messages.scrollTop = messages.scrollHeight;
});

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', input.value)
    input.value = ''
  }
})


socket.on('users-online', (usersOnline) => {
  const usersList = document.querySelector('.online-user-list')
  usersList.innerHTML = ""
  const newUsersOnline = usersOnline.filter(user => user.username !== userOwn)

  newUsersOnline.forEach(user => {
    const div = document.createElement('div')
    div.innerHTML = `
          <div class="online-user">
      <div class="avatar-container-user-connected">
        <img src= "${API_URL}/uploads/${user.url}" alt="${user.username}" class="avatar-user-connected">
        <span class="status-indicator"></span>
      </div>
      <span class="username-user-connected">${user.username}</span>
    </div>
   `
    usersList.appendChild(div)
  })
})

socket.on('count-message', ({ countMessages }) => {
  const orderCountUser = countMessages.sort((a, b) => b.count - a.count)
  const userList = document.querySelector('.user-list')

  userList.innerHTML = ""
  orderCountUser.forEach(user => {
    const div = document.createElement('div')
    div.classList.add('user')
    div.innerHTML = `
  <img class="avatar" src= "${API_URL}/uploads/${user.profile_image}"  alt="${user.user}">
  <div class="user-info">
    <div class="username">${user.user}</div>
    <div class="count">${user.count} mensajes</div>
  </div>
    `;
    userList.appendChild(div)
    })
})


// Recover messages
socket.on('batch messages', (mensajes) => {
      mensajes.forEach(({ msg, serverOffset, username, date, url }) => {
        const isOwnMessage = username === userOwn;
        let profileImageURL = `${API_URL}/uploads/${url}`

        if (isOwnMessage) {
          let localProfile = localStorage.getItem('profileURL')
          profileImageURL = `${API_URL}/uploads/${localProfile}`

        }

        const item = `
      <li class="message ${isOwnMessage ? 'message-right' : ''}">
        <img src="${profileImageURL}" class="profileChat" />
        <div>
          <small>${username} - ${date}</small>
          <p>${msg}</p>
        </div>
      </li>
    `;

        messages.insertAdjacentHTML('beforeend', item);
        socket.auth.serverOffset = serverOffset;
      });

      messages.scrollTop = messages.scrollHeight;
});

// MENSAJE PARA EL WACHIN QUE ME QUIERA SPAMEAR

socket.on('errorMessage', (msg) => {
  alert(msg)
  console.log("A tuuu casaaa pa, que te pensas que no lo voy a validar desde el back wachin")
})



// MENSAJE USUARIO SE CONECTO

socket.on('user-connected', (user, userConnected) => {

    const notification = Toastify({
        text: `${user} se ha conectado`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #3c3c3cff, #2b2b2bff)",
        avatar: `${API_URL}/uploads/${userConnected[user][0]}`,
        stopOnFocus: true,
    })

    let usersConnected = socket.auth.userConnected || {}

    let ultimaFecha = usersConnected[user]?.[1] || null
    let newUltimaFecha = userConnected[user][1]

    if (ultimaFecha == null) {
        socket.auth.userConnected = {
          ...socket.auth.userConnected,
          ...userConnected
        }
        // Mostrar notificación de usuario conectado
        notification.showToast()
        return
    }

    // Convertir las fechas a objetos Date para comparar

    const ultimaDate = new Date(ultimaFecha)
    const newUltimaDate = new Date(newUltimaFecha)

    const timeMS = newUltimaDate - ultimaDate;
    const diferenciaMinutos = Math.floor(timeMS / 60000); // Convertir a minutos

    if (diferenciaMinutos >= 1) {

      socket.auth.userConnected = {
        ...socket.auth.userConnected,
        ...userConnected
      }
      notification.showToast()
    }
})