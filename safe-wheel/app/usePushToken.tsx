import { useEffect, useState } from "react"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

export default function usePushToken() {
  const [expoToken, setExpoToken] = useState<string | null>(null)

  useEffect(() => {
    const getPushToken = async () => {
      if (!Device.isDevice) return

      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        console.warn("Permission not granted for push notifications.")
        return
      }

      const tokenData = await Notifications.getExpoPushTokenAsync()
      setExpoToken(tokenData.data)
    }

    getPushToken()
  }, [])

  return expoToken
}