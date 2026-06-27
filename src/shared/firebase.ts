import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { registerToken } from '@/shared/api/notification'
import { FirebaseMessaging } from '@capacitor-firebase/messaging'
import { Capacitor } from '@capacitor/core'

const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

const messaging = getMessaging(app)

async function requestFcmToken(): Promise<string | null> {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted')
        return null
    const registration = await navigator.serviceWorker.ready
    return getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
    })
}

async function setupWebPush() {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    if (!accessToken)
        return
    const fcmToken = await requestFcmToken()
    if (!fcmToken)
        return
    localStorage.setItem('fcmToken', fcmToken)
    await registerToken(accessToken, fcmToken, 'WEB')
}

async function setupNativePush() {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    if (!accessToken)
        return

    const perm = await FirebaseMessaging.requestPermissions()
    if (perm.receive !== 'granted')
        return

    const { token } = await FirebaseMessaging.getToken()

    const platform = Capacitor.getPlatform() === 'ios' ? 'IOS' : 'ANDROID'
    await registerToken(accessToken, token, platform)
}

export async function setupPush() {
    if (Capacitor.isNativePlatform()) return setupNativePush()
    return setupWebPush()
}
