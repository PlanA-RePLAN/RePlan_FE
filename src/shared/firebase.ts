import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { useNotificationStore } from '@/store/notificationStore'
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

async function requestFcmToken(): Promise<string | null> {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted')
        return null
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
    return getToken(getMessaging(app), {
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

export function listenForegroundPush() {
    // 네이티브(iOS/안드로이드) 웹뷰에는 navigator.serviceWorker가 없어 웹 Firebase SDK가 시작 시 터진다.
    // 네이티브는 네이티브 플러그인 리스너로 수신을 감지해 안읽음 뱃지만 켜고, 웹 SDK는 건너뛴다.
    if (Capacitor.isNativePlatform()) {
        FirebaseMessaging.addListener('notificationReceived', () => {
            useNotificationStore.getState().setHasUnread(true)
        })
        return
    }
    onMessage(getMessaging(app), (payload) => {
        const title = payload.data?.title ?? 'RePlan'
        const body  = payload.data?.body  ?? ''
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/assets/pwa-192x192.png' })
        }
        useNotificationStore.getState().setHasUnread(true)
    })
}
