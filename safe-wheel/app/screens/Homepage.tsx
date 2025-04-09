import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Ionicons, Feather } from "@expo/vector-icons"
import Navbar from "../components/Navbar.tsx"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../navigation/AppNavigator.ts"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"

const screenWidth = Dimensions.get("window").width

export default function Homepage() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [storedName, setStoredName] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })
  const [activeData, setActiveData] = useState<"heartRate" | "oxygen">("heartRate")
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const name = await AsyncStorage.getItem("user_name")
        setStoredName(name || "")

        const safewheel_id = await AsyncStorage.getItem("safewheel_id")
        if (!safewheel_id) return

        try {
          const response = await axios.get(
            `https://find-it-bersama-dia-safe-wheel.vercel.app/api/user_alert_notification?safewheel_id=${safewheel_id}`
          )
          const all = response.data.alerts
          const read = await AsyncStorage.getItem("read_alert_ids")
          const readIds = read ? JSON.parse(read) : []

          const unread = all.filter((alert: any) => {
            const key = `${alert.safewheel_id}-${alert.alert_timestamp}`
            return !readIds.includes(key)
          })

          setUnreadCount(unread.length)
        } catch (e) {
          console.log("Failed to fetch alerts", e)
        }
      }

      fetchData()
    }, [])
  )

  useEffect(() => {
    const fetchChart = async () => {
      const safewheel_id = await AsyncStorage.getItem("safewheel_id")
      if (!safewheel_id) return
      setLoading(true)

      try {
        const response = await axios.get(`https://find-it-bersama-dia-safe-wheel.vercel.app/api/health_item/all?safewheel_id=${safewheel_id}`)
        const items = response.data.healthItems

        const today = new Date()
        const todayItems = items.filter((item: any) => {
          const date = new Date(item.user_timestamp)
          return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          )
        })

        const labels: string[] = []
        const heartData: number[] = []
        const oxygenData: number[] = []

        todayItems.reverse().forEach((item: any) => {
          const time = new Date(item.user_timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          labels.push(time)
          heartData.push(item.heart_rate)
          oxygenData.push(item.oxygen)
        })

        setChartData({
          labels,
          datasets: [
            {
              data: activeData === "heartRate" ? heartData : oxygenData,
              color: () => "#CC4FAB",
              strokeWidth: 2,
            },
          ],
        })
      } catch (err) {
        console.error("Error fetching chart data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChart()
  }, [activeData])

  const handleNavigate = () => {
    navigation.navigate("Profile")
  }

  const handleNotificationPress = () => {
    navigation.navigate("HistoryNotification")
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleNavigate}
            >
              <Ionicons name="person-circle-outline" size={32} color="#4B3EA8" />
              <Text style={styles.greeting}>Hi, {storedName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotificationPress} style={{ position: "relative" }}>
              <Feather name="bell" size={24} color="#4B3EA8" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Top Cards */}
          <View style={styles.topCards}>
            <View style={styles.cardGradient}>
              <Text style={styles.cardTitle}>Heart</Text>
              <Ionicons name="heart" size={48} color="#4B3EA8" style={{ marginVertical: 8 }} />
              <Text style={styles.cardValue}>{activeData === "heartRate" ? "" : ""}mbp</Text>
            </View>
            <View style={styles.cardBordered}>
              <Text style={styles.cardTitle}>Oxygen</Text>
              <Ionicons name="water" size={48} color="#4B3EA8" style={{ marginVertical: 8 }} />
              <Text style={styles.cardValue}>{activeData === "oxygen" ? "" : ""}% OS</Text>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartContainer}>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, activeData === "heartRate" && styles.toggleActive]}
                onPress={() => setActiveData("heartRate")}
              >
                <Text style={[styles.toggleText, activeData === "heartRate" && styles.toggleTextActive]}>Heart Rate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, activeData === "oxygen" && styles.toggleActive]}
                onPress={() => setActiveData("oxygen")}
              >
                <Text style={[styles.toggleText, activeData === "oxygen" && styles.toggleTextActive]}>Oxygen</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#6a4fff" />
            ) : (
              <LineChart
                data={chartData}
                width={screenWidth - 60}
                height={220}
                withShadow={false}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: () => "#CC4FAB",
                  labelColor: () => "#888",
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#fff",
                  },
                }}
                bezier
                style={{ marginTop: 12, borderRadius: 12 }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Navbar at Bottom */}
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  scroll: {
    paddingBottom: 100,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4B3EA8",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#FF4D4D",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  topCards: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardGradient: {
    flex: 1,
    marginRight: 10,
    padding: 20,
    backgroundColor: "#F3F0FF",
    borderRadius: 16,
    alignItems: "center",
  },
  cardBordered: {
    flex: 1,
    marginLeft: 10,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D7CFFF",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B3EA8",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4B3EA8",
  },
  chartContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D7CFFF",
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  toggleButton: {
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EFE9FE",
  },
  toggleActive: {
    backgroundColor: "#D6CBF7",
  },
  toggleText: {
    fontSize: 14,
    color: "#4B3EA8",
    fontWeight: "500",
  },
  toggleTextActive: {
    fontWeight: "bold",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})
