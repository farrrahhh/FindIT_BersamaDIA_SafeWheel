import { Expo } from 'expo-server-sdk'

const expo = new Expo()

export async function sendPushNotification(expoToken, title, body) {
  if (!Expo.isExpoPushToken(expoToken)) {
    console.error(`Invalid Expo Push Token: ${expoToken}`)
    return
  }

  const messages = [{
    to: expoToken,
    sound: 'default',
    title,
    body,
    data: { withSome: 'data' },
  }]

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages)
    console.log('Notification sent:', ticketChunk)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}