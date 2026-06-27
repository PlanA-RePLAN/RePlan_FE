import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { registerToken } from '@/shared/api/notification'

const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

const messaging = getMessaging(app)
    export async function requestFcmToken(): Promise<string | null> {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') 
        return null
    const registration = await navigator.serviceWorker.ready
        return getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
    })
}

export async function setupPush() {
  const accessToken = localStorage.getItem('accessToken') ?? ''
  if (!accessToken) 
    return
  const fcmToken = await requestFcmToken()
  if (!fcmToken) 
    return
  localStorage.setItem('fcmToken', fcmToken)
  await registerToken(accessToken, fcmToken, 'WEB')
}