import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { Ionicons } from "@expo/vector-icons"

interface AlertItem {
  safewheel_id: string
  alert_timestamp: string
  is_read?: boolean
}

interface Section {
  title: string
  data: AlertItem[]
}

export default function HistoryNotification() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const safewheel_id = await AsyncStorage.getItem("safewheel_id")
        if (!safewheel_id) return

        const response = await axios.get(
          `https://find-it-bersama-dia-safe-wheel.vercel.app/api/user_alert_notification`,
          { params: { safewheel_id } }
        )

        const storedReadIds = await AsyncStorage.getItem("read_alert_ids")
        const readIds = storedReadIds ? JSON.parse(storedReadIds) : []

        const enriched: AlertItem[] = response.data.alerts.map((alert: AlertItem) => {
          const key = `${alert.safewheel_id}-${alert.alert_timestamp}`
          return {
            ...alert,
            is_read: readIds.includes(key),
          }
        })

        const grouped: { [date: string]: AlertItem[] } = {}
        enriched.forEach((item) => {
          const dateKey = new Date(item.alert_timestamp).toLocaleDateString()
          if (!grouped[dateKey]) grouped[dateKey] = []
          grouped[dateKey].push(item)
        })

        const groupedSections: Section[] = Object.entries(grouped).map(([title, data]) => ({
          title,
          data,
        }))

        setSections(groupedSections)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch notifications", err)
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handlePress = async (alert: AlertItem) => {
    const key = `${alert.safewheel_id}-${alert.alert_timestamp}`

    const updatedSections = sections.map((section) => ({
      ...section,
      data: section.data.map((item) => {
        const itemKey = `${item.safewheel_id}-${item.alert_timestamp}`
        return itemKey === key ? { ...item, is_read: true } : item
      }),
    }))

    setSections(updatedSections)

    const readIds = updatedSections
      .flatMap((section) => section.data)
      .filter((a) => a.is_read)
      .map((a) => `${a.safewheel_id}-${a.alert_timestamp}`)

    await AsyncStorage.setItem("read_alert_ids", JSON.stringify(readIds))

    navigation.navigate("Alert")
  }

  const renderItem = ({ item }: { item: AlertItem }) => {
    const date = new Date(item.alert_timestamp)
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        style={[styles.card, item.is_read && styles.read]}
      >
        <Text style={styles.icon}>⚠️</Text>
        <View style={styles.textWrapper}>
          <Text style={styles.message}>
            Deteksi Jatuh: Sistem mendeteksi potensi jatuh pada pengguna kursi roda. Segera hubungi atau datangi lokasi mereka.
          </Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  )

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6a4fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6a4fff" />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => `${item.safewheel_id}-${item.alert_timestamp}`}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a4fff",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6a4fff",
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f5ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    borderColor: "#6a4fff",
    borderWidth: 1,
  },
  read: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: "#2d2d2d",
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
})
