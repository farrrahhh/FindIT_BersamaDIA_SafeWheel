import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"

const screenWidth = Dimensions.get("window").width

const dummyData = {
  heartRate: [72, 76, 74, 80, 82, 85],
  oxygen: [96, 95, 97, 98, 96, 99],
  labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
}

export default function Homepage() {
  const [activeData, setActiveData] = useState<"heartRate" | "oxygen">("heartRate")

  const chartData = {
    labels: dummyData.labels,
    datasets: [
      {
        data: dummyData[activeData],
        color: () => "#CC4FAB",
        strokeWidth: 2,
      },
    ],
    legend: [],
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="person-circle-outline" size={32} color="#4B3EA8" />
          <Text style={styles.greeting}>Hi, Mattheuw</Text>
        </View>
        <Feather name="bell" size={24} color="#4B3EA8" />
      </View>

      {/* Top Cards */}
      <View style={styles.topCards}>
        <View style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Heart</Text>
          <Ionicons name="heart" size={48} color="#4B3EA8" style={{ marginVertical: 8 }} />
          <Text style={styles.cardValue}>105 mbp</Text>
        </View>
        <View style={styles.cardBordered}>
          <Text style={styles.cardTitle}>Oxygen</Text>
          <Ionicons name="water" size={48} color="#4B3EA8" style={{ marginVertical: 8 }} />
          <Text style={styles.cardValue}>99% OS</Text>
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

    <LineChart
        data={chartData}
        width={screenWidth - 60} // <-- dikurangi agar sesuai padding container
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
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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
})
