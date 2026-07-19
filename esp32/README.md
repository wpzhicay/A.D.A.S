# ESP32 Firmware - A.D.A. Solar

Código del ESP32 para monitoreo de generador solar con GPS y envío de datos al backend.

## 📋 Requisitos

### Hardware:
- ESP32
- Módulo GPS NEO-6M (Serial en pines 16, 17)
- Divisor de voltaje (R1=100kΩ, R2=33kΩ) en pin 34
- Cable USB para programación

### Software:
- Arduino IDE 2.0+
- Librerías ESP32 instaladas
- **Librerías necesarias:**
  ```
  - TinyGPS++ (by Mikal Hart)
  - HTTPClient (incluida en ESP32 core)
  - WiFi (incluida en ESP32 core)
  ```

## 🔧 Instalación de Librerías

En Arduino IDE:
1. `Sketch` → `Include Library` → `Manage Libraries`
2. Buscar: **TinyGPS++**
3. Instalar versión 1.0.2+

## ⚙️ Configuración

Editar en `main.cpp`:

```cpp
// WiFi - Cambiar credenciales
const char* ssid = "A.D.A. Solar";
const char* password = "12345678";

// Backend - Cambiar IP y puerto
const char* backendURL = "http://192.168.1.100:3000/api/mediciones";

// Dispositivo - Cambiar según ID registrado en BD
const int idDispositivo = 1;

// Intervalo de envío (ms) - Actualmente 5 minutos
const int intervaloEnvio = 300000;
```

## 📡 Conexiones Físicas

```
ESP32          Componente
====================================
GPIO16 -------- GPS TX
GPIO17 -------- GPS RX
GND ----------- GPS GND
5V ------------ GPS VCC

GPIO34 -------- Divisor de Voltaje (entrada)
GND ----------- Divisor GND
```

## 📊 Datos que Envía

```json
{
  "idDispositivo": 1,
  "voltaje": 12.75,
  "corriente": 0.0,
  "potencia": 0.0,
  "temperatura": 0.0,
  "porcentajeBateria": 88,
  "latitud": -2.903456,
  "longitud": -79.005789,
  "fecha": "2026-07-19T14:30:00"
}
```

## 🚀 Uso

1. Conectar ESP32 por USB
2. Abrir Arduino IDE
3. Seleccionar board: `ESP32 Dev Module`
4. Seleccionar puerto COM correspondiente
5. Cargar el código: `Sketch` → `Upload`

## 📈 Monitoreo

Ver logs en Arduino IDE:
- `Tools` → `Serial Monitor`
- Velocidad: **115200 baud**

Debería mostrar:
```
Conectando WiFi...
.....
WiFi conectado
IP: 192.168.x.x
Sincronizando hora...
...
Hora sincronizada
Voltaje: 12.50V, Batería: 50%
GPS: Lat=-2.903456, Lon=-79.005789
Enviando: {...}
Código respuesta: 201
```

## 🔴 Troubleshooting

| Problema | Solución |
|----------|----------|
| No conecta WiFi | Verificar SSID y contraseña |
| GPS sin señal | Esperar más tiempo (1-2 min) en exterior |
| Error de conexión al backend | Verificar IP, puerto y que backend esté corriendo |
| Datos incorrectos | Verificar calibración de divisor de voltaje |

## 📝 Notas

- El GPS tarda 30-60 segundos en obtener primera señal
- Los datos se envían cada 5 minutos (configurable)
- La hora se sincroniza automáticamente con NTP
- Si no hay WiFi, el ESP32 sigue leyendo sensores

## 🔐 Seguridad

⚠️ **Cambiar en producción:**
- WiFi password
- Backend URL (usar HTTPS)
- Token de autenticación (futuro)

---

**Versión:** 1.0  
**Última actualización:** 2026-07-19
