#include <Wire.h>
#include <MPU6050.h>
#include <MAX30100_PulseOximeter.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Ganti dengan nama dan password WiFi kamu
const char* ssid = "NAMA_WIFI_KAMU";
const char* password = "PASSWORD_WIFI_KAMU";

// Endpoint API
const char* apiURL = "https://find-it-bersama-dia-safe-wheel.vercel.app/api/user_alert_notification";

// Ganti dengan SafeWheel ID milik user ini
const char* safewheel_id = "SW12345678";

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

float lastBPM = 0;
float lastSpO2 = 0;
void setup() {
  Serial.begin(115200);
  Wire.begin();
  // WiFi
  Serial.println("🔌 Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi terhubung!");

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
  
    float bpm = pox.getHeartRate();
    float spo2 = pox.getSpO2();
  
    Serial.println("\n========== UPDATE ==========");
    Serial.print("BPM: ");
    Serial.print(bpm);
    Serial.print(" | SpO2: ");
    Serial.println(spo2);
  
    bool bpmChanged = abs(bpm - lastBPM) >= 1.0;
    bool spo2Changed = abs(spo2 - lastSpO2) >= 1.0;
  
    if ((bpmChanged || spo2Changed) && WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin("https://find-it-bersama-dia-safe-wheel.vercel.app/api/health_item");
      http.addHeader("Content-Type", "application/json");
  
      // Gunakan waktu device jika ada RTC/GPS, sementara pakai millis
      String now = String(millis());
  
      String body = "{\"safewheel_id\":\"" + String(safewheel_id) +
                    "\",\"user_timestamp\":\"" + now +
                    "\",\"oxylevel\":" + String((int)spo2) +
                    ",\"heartrate\":" + String((int)bpm) + "}";
  
      int responseCode = http.POST(body);
      if (responseCode > 0) {
        String res = http.getString();
        Serial.print("✅ Health data sent: ");
        Serial.println(res);
      } else {
        Serial.print("❌ Failed to send health data. Code: ");
        Serial.println(responseCode);
      }
      http.end();
  
      lastBPM = bpm;
      lastSpO2 = spo2;
    }

    if (abs(pitch) > pitchThreshold || abs(roll) > rollThreshold) {
      // Hanya kirim kalau WiFi aktif
      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(apiURL);
        http.addHeader("Content-Type", "application/json");

        String jsonBody = "{\"safewheel_id\":\"" + String(safewheel_id) + "\",\"alert_timestamp\":\"" + String(millis()) + "\"}";

        int httpResponseCode = http.POST(jsonBody);
        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.print("✅ Notifikasi dikirim: ");
          Serial.println(response);
        } else {
          Serial.print("❌ Gagal kirim notifikasi. Code: ");
          Serial.println(httpResponseCode);
        }
        http.end();
      } else {
        Serial.println("❌ Tidak ada koneksi WiFi");
      }
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