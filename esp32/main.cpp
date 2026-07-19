#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <time.h>

// WiFi
const char* ssid = "A.D.A. Solar";
const char* password = "12345678";

// GPS
TinyGPSPlus gps;
HardwareSerial SerialGPS(2);

// Pin voltaje
const int pinVoltaje = 34;
const float R1 = 100000.0;
const float R2 = 33000.0;

// Backend
const char* backendURL = "http://192.168.1.100:3000/api/mediciones";
const int idDispositivo = 1; // Cambiar según corresponda
const int intervaloEnvio = 300000; // 5 minutos en ms
unsigned long ultimoEnvio = 0;

// NTP
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

float leerVoltaje() {
  int lectura = analogRead(pinVoltaje);
  float voltajeADC = lectura * (3.3 / 4095.0);
  return voltajeADC * ((R1 + R2) / R2);
}

int calcularBateria(float voltaje) {
  if(voltaje >= 12.7) return 100;
  if(voltaje >= 12.5) return 90;
  if(voltaje >= 12.3) return 70;
  if(voltaje >= 12.1) return 50;
  if(voltaje >= 11.9) return 30;
  return 10;
}

String obtenerTimestamp() {
  time_t now = time(nullptr);
  struct tm* timeinfo = gmtime(&now);
  char buffer[25];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S", timeinfo);
  return String(buffer);
}

void enviarDatos(float voltaje, int bateria, double lat, double lon) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado");
    return;
  }

  HTTPClient http;
  http.begin(backendURL);
  http.addHeader("Content-Type", "application/json");

  // Crear JSON
  String payload = "{";
  payload += "\"idDispositivo\":" + String(idDispositivo) + ",";
  payload += "\"voltaje\":" + String(voltaje, 2) + ",";
  payload += "\"corriente\":0.0,";
  payload += "\"potencia\":0.0,";
  payload += "\"temperatura\":0.0,";
  payload += "\"porcentajeBateria\":" + String(bateria) + ",";
  payload += "\"latitud\":" + String(lat, 6) + ",";
  payload += "\"longitud\":" + String(lon, 6) + ",";
  payload += "\"fecha\":\"" + obtenerTimestamp() + "\"";
  payload += "}";

  Serial.println("Enviando: " + payload);

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Código respuesta: " + String(httpResponseCode));
    Serial.println("Respuesta: " + response);
  } else {
    Serial.println("Error en solicitud: " + String(httpResponseCode));
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  analogReadResolution(12);
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);

  // Conectar WiFi
  Serial.println("Conectando WiFi...");
  WiFi.begin(ssid, password);
  
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    // Sincronizar hora con NTP
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.println("Sincronizando hora...");
    time_t now = time(nullptr);
    while (now < 24 * 3600) {
      delay(500);
      Serial.print(".");
      now = time(nullptr);
    }
    Serial.println("\nHora sincronizada");
  } else {
    Serial.println("Error conectando WiFi");
  }
}

void loop() {
  // Procesar datos del GPS
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }

  // Enviar datos cada intervalo
  if (millis() - ultimoEnvio >= intervaloEnvio) {
    ultimoEnvio = millis();

    float voltaje = leerVoltaje();
    int bateria = calcularBateria(voltaje);

    double lat = 0;
    double lon = 0;

    if (gps.location.isValid()) {
      lat = gps.location.lat();
      lon = gps.location.lng();
      Serial.println("GPS: Lat=" + String(lat, 6) + ", Lon=" + String(lon, 6));
    } else {
      Serial.println("GPS: Sin señal");
    }

    Serial.println("Voltaje: " + String(voltaje, 2) + "V, Batería: " + String(bateria) + "%");

    enviarDatos(voltaje, bateria, lat, lon);
  }

  delay(100);
}
