// File: usePushToken.ts
import { useEffect, useState } from "react"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

export default function usePushToken() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      let token

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync()
          finalStatus = status
        }

        if (finalStatus !== "granted") {
          console.log("❌ Failed to get push token permission!")
          return
        }

        token = (await Notifications.getExpoPushTokenAsync()).data
        console.log("✅ Expo Push Token:", token)
      } else {
        console.log("❌ Must use physical device for Push Notifications")
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        })
      }

      setExpoPushToken(token ?? null)
    }

    registerForPushNotificationsAsync()
  }, [])

  return expoPushToken
}