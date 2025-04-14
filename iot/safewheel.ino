#include <Wire.h>
#include <MPU6050.h>
#include <MAX30100_PulseOximeter.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
// WiFi credentials
const char* ssid = "esp32";
const char* password = "bersamadia";

// API endpoints
const char* apiHealth = "https://find-it-bersama-dia-safe-wheel.vercel.app/api/health_item";
const char* apiAlert  = "https://find-it-bersama-dia-safe-wheel.vercel.app/api/user_alert_notification";

// SafeWheel ID
const char* safewheel_id = "SW8X9Z2L1Q";

// GPS
#define RXD2 16
#define TXD2 17
#define GPS_BAUD 9600
HardwareSerial gpsSerial(2);
TinyGPSPlus gps;

// MPU6050
MPU6050 mpu;
float pitch, roll;
const float pitchThreshold = 30.0;
const float rollThreshold = 30.0;

// MAX30100
PulseOximeter pox;
uint32_t lastReport = 0;
#define REPORTING_PERIOD_MS 3000

float lastBPM = 0;
float lastSpO2 = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Connect WiFi
  Serial.println("🔌 Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi terhubung!");
  // Konfigurasi NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("⏳ Sinkronisasi waktu NTP...");
  while (time(nullptr) < 100000) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("\n✅ Waktu NTP siap!");

  // GPS
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("✅ GPS siap");

  // MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("❌ MPU6050 tidak terdeteksi!");
    while (1);
  }
  Serial.println("✅ MPU6050 terdeteksi");

  // MAX30100
  if (!pox.begin()) {
    Serial.println("❌ MAX30100 tidak terdeteksi!");
    while (1);
  }
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
  Serial.println("✅ MAX30100 terdeteksi");
}

String getISOTimestamp() {
  time_t now = time(nullptr);
  struct tm* timeinfo = gmtime(&now); // UTC time

  char iso[30];
  sprintf(iso, "%04d-%02d-%02dT%02d:%02d:%02d.000Z",
          timeinfo->tm_year + 1900, timeinfo->tm_mon + 1,
          timeinfo->tm_mday, timeinfo->tm_hour,
          timeinfo->tm_min, timeinfo->tm_sec);
  return String(iso);
}

void loop() {
  pox.update();

  // Baca GPS
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  // Baca MPU6050
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  pitch = atan2(ax, sqrt(ay * ay + az * az)) * 180 / PI;
  roll  = atan2(ay, sqrt(ax * ax + az * az)) * 180 / PI;

  if (millis() - lastReport > REPORTING_PERIOD_MS) {
    lastReport = millis();
    String isoTime = getISOTimestamp();
    if (gps.date.isValid() && gps.time.isValid()) {
      Serial.println("🛰️ GPS waktu fix digunakan");
    } else {
      Serial.println("⚠️ GPS belum fix, pakai waktu lokal fallback");
    }

    float bpm = pox.getHeartRate();
    float spo2 = pox.getSpO2();

    Serial.println("\n========= DATA =========");
    Serial.printf("BPM: %.2f | SpO2: %.2f\n", bpm, spo2);
    Serial.printf("Pitch: %.2f | Roll: %.2f\n", pitch, roll);
    Serial.println("ISO Time: " + isoTime);

    // ===== SEND HEALTH DATA =====
    bool bpmChanged = abs(bpm - lastBPM) >= 1.0;
    bool spo2Changed = abs(spo2 - lastSpO2) >= 1.0;

    if ((bpmChanged || spo2Changed) && WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(apiHealth);
      http.addHeader("Content-Type", "application/json");

      String json = "{\"safewheel_id\":\"" + String(safewheel_id) + "\",";
      json += "\"user_timestamp\":\"" + isoTime + "\",";
      json += "\"oxylevel\":" + String((int)spo2) + ",";
      json += "\"heartrate\":" + String((int)bpm) + "}";

      int code = http.POST(json);
      if (code > 0) {
        Serial.println("✅ Health sent: " + http.getString());
      } else {
        Serial.println("❌ Failed to send health. Code: " + String(code));
      }
      http.end();
      lastBPM = bpm;
      lastSpO2 = spo2;
    }

    // ===== DETECTION FALL (ALERT) =====
    if (abs(pitch) > pitchThreshold || abs(roll) > rollThreshold) {
      Serial.println("🚨 POTENSI JATUH TERDETEKSI");

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(apiAlert);
        http.addHeader("Content-Type", "application/json");

        String json = "{\"safewheel_id\":\"" + String(safewheel_id) + "\",";
        json += "\"alert_timestamp\":\"" + isoTime + "\"}";

        int code = http.POST(json);
        if (code > 0) {
          Serial.println("✅ Alert sent: " + http.getString());
        } else {
          Serial.println("❌ Failed to send alert. Code: " + String(code));
        }
        http.end();
      }
    }

    Serial.println("📡 Satelit: " + String(gps.satellites.value()));
    Serial.printf("📍 Lokasi: %.6f, %.6f\n", gps.location.lat(), gps.location.lng());
    Serial.println("=============================");
  }

  delay(10);
}