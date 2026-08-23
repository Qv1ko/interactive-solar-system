<div align="center">

  <h1 align="center">Interactive Solar System</h1>

[![JavaScript ES6](https://img.shields.io/badge/JavaScript_ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=FFFFFF&labelColor=333333)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=FFFFFF&labelColor=333333)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=E3E3E3&labelColor=333333)](https://vite.dev)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=E3E3E3&labelColor=333333)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-F9AD00?style=for-the-badge&logo=pnpm&logoColor=FFFFFF&labelColor=333333)](https://pnpm.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=E3E3E3&labelColor=333333)](https://www.docker.com)

</div>

## ℹ️ Acerca de

Interactive Solar System es una web 3D del sistema solar construida con Three.js que permite explorar el Sol, los 8 planetas y sus lunas principales de forma interactiva, con movimiento orbital en tiempo real y control total sobre la velocidad de la simulación.

### ✨ Características

- **Sol** con halo luminoso e iluminación real de la escena mediante luz puntual.
- **8 planetas** a escala visual logarítmica, con anillos en Saturno y Urano.
- **21 lunas principales** orbitando sus planetas (Luna, galileanas de Júpiter, Titán, Encélado, Tritón...).
- **Órbitas elípticas** con excentricidad e inclinación orbital reales.
- **Rotación axial propia** para cada planeta, con inclinaciones reales (Urano tumbado a 97,77°, Venus con rotación retrógrada).
- **Eclipses reales**: las lunas se oscurecen al pasar por la sombra de su planeta gracias al shadow mapping de la escena.
- **Control de velocidad**: pausa/reanudar y slider multiplicador del tiempo desde x0.1 hasta x100.
- **Panel de información**: haz clic en cualquier cuerpo (sol, planeta o luna) para ver sus datos reales (masa, temperatura, número de lunas confirmadas...) y activa el modo seguimiento para que la cámara lo siga manteniéndolo centrado en pantalla.
- **Toggles visuales**: muestra u oculta las trayectorias orbitales y las etiquetas de nombres.
- **Contador de FPS** discreto integrado en la interfaz.

## 📁 Estructura del proyecto

```bash
📁 root/
|-- src/                         # Código fuente de la aplicación
|   |-- data/
|   |   \-- solarSystem.js       # Datos astronómicos (planetas, lunas, escalas visuales)
|   |-- ui/
|   |   |-- controls.js          # Slider de velocidad, pausa y toggles de órbitas/etiquetas
|   |   \-- infoPanel.js         # Panel de información y modo seguimiento
|   |-- createPlanet.js          # Construcción de cuerpos celestes (sol, planetas, lunas, anillos)
|   |-- main.js                  # Punto de entrada, render loop, picking y cámara
|   |-- orbits.js                # Mecánica orbital, rotaciones y campo de estrellas
|   |-- scene.js                 # Setup de escena, cámara y renderer
|   \-- styles.css               # Estilos de la interfaz
|
|-- index.html                   # Contenedor del canvas y overlays de UI
|-- vite.config.js               # Configuración de Vite
|-- package.json                 # Dependencias y scripts (pnpm)
|
|-- Dockerfile                   # Build multi-stage (node + corepack/pnpm → nginx)
|-- docker-compose.yml           # Orquestación del contenedor web
\-- nginx.conf                   # Servidor estático con SPA fallback y cache
```

## 🚀 Despliegue local

### Prerrequisitos

- [Node.js ^20](https://nodejs.org/es/download)
- [pnpm ^9](https://pnpm.io/es/installation)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Qv1ko/interactive-solar-system.git
```

2. Accede al directorio del proyecto:

```bash
cd interactive-solar-system
```

3. Instala las dependencias:

```bash
pnpm install
```

4. Ejecuta el servidor de desarrollo:

```bash
pnpm run dev
```

5. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🐳 Despliegue con Docker

### Prerrequisitos

- [Docker Engine](https://docs.docker.com/engine/install/) con Docker Compose v2

### Uso

1. Construye e inicia el contenedor (build multi-stage: Node.js compila la app con pnpm y nginx la sirve):

```bash
docker compose up --build
```

2. Abre [http://localhost:8080](http://localhost:8080) en tu navegador.

> Comandos útiles: `docker compose down` (parar), `docker compose logs -f` (logs), `pnpm run build` + `pnpm run preview` (preview local de producción sin Docker).

## 🎮 Uso

| Acción                              | Control                                       |
| ----------------------------------- | --------------------------------------------- |
| Rotar la cámara                     | Arrastrar con el ratón                        |
| Zoom                                | Rueda del ratón                               |
| Mover la cámara                     | Clic derecho + arrastrar                      |
| Ver información de un cuerpo        | Clic izquierdo sobre él                       |
| Seguir a un cuerpo                  | Botón _Seguir_ en el panel de información     |
| Dejar de seguir                     | Mismo botón (_Dejar de seguir_) o tecla `Esc` |
| Pausar la simulación                | Botón _Pausar_                                |
| Cambiar velocidad                   | Slider x0.1 – x100                            |
| Mostrar/ocultar órbitas y etiquetas | Checkboxes del panel lateral                  |

> La escala de tamaños y distancias es artística (logarítmica): a escala real los planetas serían puntos invisibles entre sí. Los períodos orbitales, rotaciones, inclinaciones y datos físicos mostrados son proporcionales o reales.

## 🛠️ Construido con

- [Three.js](https://threejs.org) - Renderizado 3D (WebGL), sombras y etiquetas CSS2D
- [Vite](https://vite.dev) - Empaquetado y servidor de desarrollo
- [pnpm](https://pnpm.io) - Gestión de dependencias
- [Docker](https://www.docker.com) + [nginx](https://nginx.org) - Despliegue en producción

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta [LICENSE](https://github.com/Qv1ko/interactive-solar-system/blob/main/LICENSE) para más información.
