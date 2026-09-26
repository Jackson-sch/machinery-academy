---
title: "Cargador Frontal de Ruedas"
model: "CAT 950 GC / Komatsu WA380"
category: "Cargadores Frontales"
brand: "Caterpillar / Komatsu Spec"
description: "Máquina articulada sobre neumáticos diseñada para carga rápida de volquetes, acopio de áridos y trasvase de materiales. Su articulación central y centro de gravedad variable al elevar el cucharón exigen dominio de estabilidad."
image: "/images/machines/cargador.svg"
accentColor: "#f59e0b"
difficulty: "Intermedio"
durationHours: 10
specs:
  potenciaHp: 241
  pesoOperativoTn: 18.7
  capacidadBaldeM3: 3.3
  alturaDescargaM: 2.95
  velocidadMaxKmH: 40.0
  presionHidraulicaPsi: 4100
eppRequerido:
  - "Casco de seguridad clase E"
  - "Lentes oscuros con filtro UV para trabajo en canteras y patios"
  - "Chaleco reflectivo naranja / amarillo flúor"
  - "Botas de seguridad dieléctricas con plantilla de acero"
  - "Protector auditivo tipo tapón o diadema"
  - "Guantes de nitrilo para manipulación de engrase y combustible"
hotspots:
  - id: "traba-articulacion"
    title: "Barra de Traba de Articulación de Dirección"
    part: "Chasís Central Articulado"
    description: "Elemento de vida o muerte: antes de cualquier mantenimiento o inspección en la zona media, debe colocarse el pasador de traba de la articulación para impedir aplastamiento por giro imprevisto."
    critico: true
    frecuencia: "Cada intervención técnica / Mantenimiento"
    coords: { x: 0.0, y: 1.0, z: 0.0 }
  - id: "neumaticos-presion"
    title: "Neumáticos OTR y Presión de Inflado"
    part: "Tren de Rodado sobre Ruedas"
    description: "Inspeccionar cortes en flancos, incrustaciones de roca afilada y calibración de PSI en frío. Una llanta desinflada altera la estabilidad dinámica al frenar con balde elevado."
    critico: true
    frecuencia: "Diario / Pre-arranque"
    coords: { x: 1.2, y: 0.6, z: 1.2 }
  - id: "aceite-transmision"
    title: "Nivel de Transmisión Powershift"
    part: "Tren de Fuerza"
    description: "Revisar en ralentí, motor a temperatura operativa, en neutro y con freno de parqueo aplicado. Mantener el fluido limpio protege los paquetes de embragues multidisco."
    critico: true
    frecuencia: "Diario"
    coords: { x: 0.3, y: 0.9, z: -0.8 }
  - id: "brazos-levantamiento"
    title: "Cilindros de Inclinación y Brazos Z-Bar"
    part: "Equipo de Carga"
    description: "Comprobar pasadores de engrase y verificar ausencia de fisuras en las soldaduras de la timonería en Z. Engrasar diariamente cada niple antes de la jornada."
    critico: false
    frecuencia: "Diario / Cada 10 Horas"
    coords: { x: 0.0, y: 1.6, z: 2.2 }
checklist:
  - categoria: "Seguridad y Punto de Articulación"
    items:
      - id: "chk-articulacion-libre"
        tarea: "Retirar y asegurar el pasador de traba de articulación antes de iniciar operación"
        criterio: "Pasador guardado en soporte lateral con su chaveta de seguridad insertada."
        esCritico: true
      - id: "chk-frenos-servicio"
        tarea: "Prueba de freno de servicio y freno de estacionamiento secundario"
        criterio: "La máquina debe quedar inmovilizada a 1500 RPM en 2da marcha hacia adelante."
        esCritico: true
      - id: "chk-espejos-camara"
        tarea: "Regulación de espejos convexos y limpieza del lente de cámara retrovisora"
        criterio: "Visibilidad nítida de ambos neumáticos posteriores y radio de giro trasero."
        esCritico: true
  - categoria: "Compartimiento de Motor y Radiadores"
    items:
      - id: "chk-panales-radiador"
        tarea: "Inspección de obstrucción por pelusas o polvo en radiador y enfriador de aceite"
        criterio: "Rejillas libres de acumulación; aspas del ventilador sin fisuras ni holgura."
        esCritico: false
      - id: "chk-refrigerante"
        tarea: "Nivel en tanque de expansión de refrigerante"
        criterio: "Entre líneas MIN y MAX con motor frío. Tapa sellada firmemente."
        esCritico: true
  - categoria: "Operación de Balde y Mandos"
    items:
      - id: "chk-autonivelador"
        tarea: "Comprobación del sistema 'Return-to-Dig' (retorno automático a excavar)"
        criterio: "El cucharón regresa automáticamente a la posición horizontal al bajar los brazos."
        esCritico: false
      - id: "chk-posicion-acarreo"
        tarea: "Verificar altura de acarreo (Carrying Position)"
        criterio: "El balde debe viajar a unos 40 cm del suelo, replegado al máximo hacia atrás."
        esCritico: true
quiz:
  - id: 1
    pregunta: "¿A qué altura debe transportarse el cucharón cargado al desplazarse entre la pila de acopio y la tolva?"
    opciones:
      - "A máxima altura para que el material no toque el suelo."
      - "A unos 35 - 40 cm del suelo, con el balde totalmente replegado hacia atrás."
      - "A la altura exacta del techo de la cabina para equilibrar las ruedas."
      - "Tocando el suelo levemente para estabilizar la máquina."
    respuestaCorrecta: 1
    explicacion: "Transportar el cucharón bajo baja el centro de gravedad del cargador, evitando el riesgo crítico de vuelco lateral al tomar curvas o frenar en seco."
  - id: 2
    pregunta: "¿Cuál es la función vital de la barra de traba de articulación central?"
    opciones:
      - "Bloquear el eje delantero para tener mayor fuerza de empuje."
      - "Inmovilizar la articulación durante transporte en camión cama-baja o mantenimiento en chasis, evitando que la máquina gire y aplaste al técnico."
      - "Alinear los neumáticos para calibrar la dirección hidráulica."
      - "Trabar el cardán para evitar que la transmisión patine."
    respuestaCorrecta: 1
    explicacion: "La barra traba físicamente los dos semi-chasis para impedir que el sistema hidráulico cierre el ángulo de quiebre y atrape al personal que inspecciona el área central."
---

## Generalidades del Cargador Frontal

El cargador frontal sobre neumáticos es una máquina de alto rendimiento cíclico. A diferencia de las excavadoras, su desplazamiento constante sobre neumáticos y su diseño articulado demandan del operador una técnica de aceleración y frenado suave para no desgastar prematuramente las caras de los neumáticos OTR ni recalentar el convertidor de par.
