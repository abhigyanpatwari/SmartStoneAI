

# Asistente de Planificación de Hitos Impulsado por IA

¡Bienvenido al futuro de la gestión de proyectos! Este sofisticado asistente de IA aprovecha el poder de GPT-4 y el procesamiento avanzado del lenguaje natural para transformar descripciones de proyectos complejas en hitos claros y accionables.

## Descripción general

Nuestro Asistente de Planificación de Hitos con IA está diseñado para agilizar el proceso de planificación de proyectos al descomponer inteligentemente proyectos complejos en hitos manejables y con plazos definidos. Aprovechando las capacidades del modelo GPT-4 de OpenAI y el robusto marco de trabajo LangChain, hemos creado una herramienta que comprende los matices de tu proyecto y proporciona recomendaciones de planificación personalizadas e innovadoras.

## Características principales

- **Modelo de lenguaje avanzado**: Utiliza GPT-4 de OpenAI para una comprensión y generación de lenguaje natural sin precedentes.
- **Extracción inteligente de hitos**: Identifica y crea automáticamente hitos lógicos del proyecto a partir de descripciones detalladas.
- **Asignación dinámica del tiempo**: Distribuye inteligentemente la duración del proyecto entre los hitos según la complejidad y el alcance.
- **Refinamiento interactivo**: Permite a los usuarios modificar y ajustar los hitos generados a través de una interfaz intuitiva.
- **Almacenamiento persistente**: Utiliza SQLite para una gestión de datos eficiente y ligera de los históricos de proyectos y datos de hitos.
- **Métricas de evaluación**: Incluye un verificador de similitud coseno para garantizar la coherencia entre las descripciones del proyecto y los hitos generados.

## Pila de tecnología

- **Backend**: 
  - Python con FastAPI para el desarrollo de API asíncronas de alto rendimiento
  - LangChain para una integración sin problemas con modelos de lenguaje e ingeniería de prompts
  - SQLite para una gestión robusta de bases de datos sin servidor
  - Azure OpenAI Services para el despliegue seguro y escalable de modelos de IA

- **Frontend**:
  - React para construir una interfaz de usuario dinámica y receptiva
  - Tailwind CSS para un estilo elegante y moderno
  - Shadcn UI para componentes de React bellamente diseñados y accesibles
  - Axios para una comunicación eficiente con la API

## Cómo funciona

1. **Entrada del proyecto**: Los usuarios proporcionan una descripción detallada del proyecto y parámetros como la duración total.
2. **Procesamiento con IA**: Nuestro sistema utiliza GPT-4 a través de LangChain para analizar los detalles del proyecto.
3. **Generación de hitos**: La IA descompone el proyecto en hitos lógicos y con plazos definidos.
4. **Refinamiento interactivo**: Los usuarios pueden ver, editar y refinar los hitos generados a través de nuestra interfaz intuitiva.
5. **Almacenamiento persistente**: Todos los datos del proyecto y los hitos se almacenan de forma segura en nuestra base de datos SQLite para facilitar su recuperación y actualización.

## Primeros pasos

Sigue estos pasos para configurar el Asistente de Planificación de Hitos con IA en tu máquina local:

### Requisitos previos

- Python 3.8+
- Node.js 14+
- npm o yarn
- Una cuenta de Azure con acceso a Azure OpenAI Services

### Configuración del Backend

1. Clona el repositorio:
   ```
   git clone https://github.com/yourusername/ai-milestone-planner.git
   cd ai-milestone-planner/backend
   ```

2. Crea un entorno virtual y actívalo:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Instala los paquetes de Python necesarios:
   ```
   pip install -r requirements.txt
   ```

4. Configura tus variables de entorno:
   - Crea un archivo `.env` en el directorio `backend`
   - Agrega las siguientes variables, reemplazando los valores con tus credenciales de Azure OpenAI:
     ```
     AZURE_OPENAI_API_KEY=your_api_key
     AZURE_OPENAI_API_BASE=your_api_base
     AZURE_OPENAI_API_VERSION=your_api_version
     AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
     ```

5. Ejecuta el servidor FastAPI:
   ```
   uvicorn api:app --reload
   ```

   El backend ahora debería estar ejecutándose en `http://localhost:8000`.

### Configuración del Frontend

1. Navega al directorio del frontend:
   ```
   cd ../frontend
   ```

2. Instala los paquetes de npm necesarios:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

   El frontend ahora debería estar ejecutándose en `http://localhost:5173`.

### Uso de la aplicación

1. Abre tu navegador web y ve a `http://localhost:5173`.
2. Deberías ver la interfaz del Asistente de Planificación de Hitos con IA.
3. Ingresa los detalles de tu proyecto, incluyendo la descripción y la duración.
4. Haz clic en "Enviar" para generar los hitos.
5. Revisa, edita y refina los hitos generados según sea necesario.

### Solución de problemas

- Si encuentras algún problema con el backend, asegúrate de que tus credenciales de Azure OpenAI sean correctas y de que tengas los permisos necesarios.
- Para problemas del frontend, revisa la consola en las herramientas de desarrollo de tu navegador web en busca de mensajes de error.

Si necesitas más ayuda, por favor abre un issue en el repositorio de GitHub.

## Contribuciones

Agradecemos las contribuciones para mejorar las capacidades de nuestro Asistente de Planificación de Hitos con IA. Consulta nuestras directrices de contribución para más información.

## Agradecimientos

- OpenAI por su innovador modelo GPT-4
- LangChain por su excelente marco de trabajo que conecta los modelos de IA con las aplicaciones
- Shadcn UI por proporcionar una biblioteca de componentes hermosa y personalizable
- La comunidad de código abierto por sus valiosas contribuciones a las herramientas y bibliotecas utilizadas en este proyecto

¡Embarca en un viaje de planificación de proyectos eficiente con nuestro Asistente de Planificación de Hitos con IA, donde los proyectos complejos encuentran una simplificación inteligente!
