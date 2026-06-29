importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')


firebase.initializeApp({
    apiKey: 'AIzaSyCigfT6EIDrOrTZJb-UeIseSta67GP72Jg',
    authDomain: 'plana-bfca0.firebaseapp.com',
    projectId: 'plana-bfca0',
    storageBucket: 'plana-bfca0.firebasestorage.app',
    messagingSenderId: '769447123864',
    appId: '1:769447123864:web:7fbe374ebad788815229ed',
})
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[sw] background message', payload)
  const title = payload.notification?.title ?? 'RePlan'
  const body = payload.notification?.body ?? ''
  self.registration.showNotification(title, {
    body,
    icon: '/assets/pwa-192x192.png',
  })
})