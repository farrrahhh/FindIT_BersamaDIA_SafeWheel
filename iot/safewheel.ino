#include <Wire.h>
#include <MPU6050.h>
#include <MAX30100_PulseOximeter.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>

// ================= PIN GPS ===================
#define RXD2 16
#define TXD2 17
#define GPS_BAUD 9600

HardwareSerial gpsSerial(2);  // UART2 di ESP32
TinyGPSPlus gps;

// ================= MPU6050 ===================
MPU6050 mpu;
float pitch, roll;
const float pitchThreshold = 30.0;
const float rollThreshold = 30.0;

// ================= MAX30100 ==================
PulseOximeter pox;
uint32_t lastReport = 0;
#define REPORTING_PERIOD_MS 1000

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Start GPS
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("GPS Serial2 started at 9600 baud");

  // Start MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("❌ MPU6050 tidak terdeteksi!");
    while (1);
  }
  Serial.println("✅ MPU6050 terdeteksi");

  // Start MAX30100
  if (!pox.begin()) {
    Serial.println("❌ MAX30100 tidak terdeteksi!");
    while (1);
  }
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
  Serial.println("✅ MAX30100 terdeteksi");
}

void loop() {
  pox.update();

  // Baca & tampilkan data mentah dari GPS (debug)
  while (gpsSerial.available()) {
    char c = gpsSerial.read();
    Serial.write(c); // tampilkan data mentah NMEA
    gps.encode(c);   // parsing ke TinyGPSPlus
  }

  // MPU6050
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  pitch = atan2(ax, sqrt(ay * ay + az * az)) * 180 / PI;
  roll  = atan2(ay, sqrt(ax * ax + az * az)) * 180 / PI;

  // Tampilkan tiap detik
  if (millis() - lastReport > REPORTING_PERIOD_MS) {
    lastReport = millis();

    Serial.println("\n========== UPDATE ==========");
    Serial.print("BPM: ");
    Serial.print(pox.getHeartRate());
    Serial.print(" | SpO2: ");
    Serial.println(pox.getSpO2());

    Serial.print("Pitch: ");
    Serial.print(pitch, 2);
    Serial.print(" | Roll: ");
    Serial.print(roll, 2);

    if (abs(pitch) > pitchThreshold || abs(roll) > rollThreshold) {
      Serial.println(" --> 🚨 JATUH!");

      if (gps.location.isValid()) {
        Serial.print("✅ Lokasi: ");
        Serial.print(gps.location.lat(), 6);
        Serial.print(", ");
        Serial.println(gps.location.lng(), 6);
      } else {
        Serial.println("❌ Lokasi belum fix");
      }
    } else {
      Serial.println(" --> Aman ✅");
    }

    Serial.print("📡 Satelit: ");
    Serial.println(gps.satellites.value());

    Serial.print("⏰ Waktu (UTC): ");
    Serial.print(gps.time.hour());
    Serial.print(":");
    Serial.print(gps.time.minute());
    Serial.print(":");
    Serial.println(gps.time.second());

    Serial.println("-------------------------------");
  }

  delay(10);
}