---
title: "Retroexcavadora / Retro-Cargadora"
model: "CAT 420 F2 / John Deere 310L"
category: "Retroexcavadoras"
brand: "Caterpillar / John Deere Spec"
description: "La navaja suiza de la construcción y redes urbanas. Combina cargador frontal, pluma excavadora trasera y patas estabilizadoras hidráulicas en un solo chasis compacto sobre ruedas."
image: "/images/machines/retroexcavadora.svg"
accentColor: "#f59e0b"
difficulty: "Básico"
durationHours: 8
specs:
  potenciaHp: 93
  pesoOperativoTn: 8.5
  capacidadBaldeM3: 1.0
  profundidadExcavacionM: 4.36
  velocidadMaxKmH: 38.5
  presionHidraulicaPsi: 3600
eppRequerido:
  - "Casco de seguridad clase E"
  - "Chaleco reflectivo de 360 grados"
  - "Lentes de seguridad transparentes y ahumados"
  - "Calzado de seguridad industrial punta reforzada"
  - "Protección auditiva adecuada para cabina abierta/cerrada"
hotspots:
  - id: "estabilizadores-hidraulicos"
    title: "Cilindros y Zapatas de Estabilizadores"
    part: "Sistema de Apoyo Posterior"
    description: "Inspeccionar las válvulas de retención anti-caída, pernos de las zapatas reversibles (goma para asfalto / garras para tierra) y holgura en bujes de pivote."
    critico: true
    frecuencia: "Diario / Pre-arranque"
    coords: { x: 0.9, y: 0.5, z: -1.5 }
  - id: "seguro-transporte-pluma"
    title: "Traba Mecánica de Transporte de Pluma"
    part: "Brazo Excavador Trasero"
    description: "Al transitar por calles o carreteras, la pluma debe estar asegurada mecánicamente con su seguro de bloqueo y el pestillo de giro para que no se desplome por pérdida de presión."
    critico: true
    frecuencia: "Antes de cada traslado carretero"
    coords: { x: 0.0, y: 1.8, z: -2.0 }
  - id: "asiento-giratorio-cabina"
    title: "Mecanismo Giratorio y Ergonomía del Asiento"
    part: "Cabina de Operación"
    description: "Comprobar que el bloqueo del asiento a 180° engancha con firmeza tanto en posición de conducción frontal como en posición de excavación trasera."
    critico: false
    frecuencia: "Diario"
    coords: { x: 0.0, y: 1.4, z: 0.0 }
checklist:
  - categoria: "Inspección Pre-arranque"
    items:
      - id: "chk-zapatas-estabilizador"
        tarea: "Verificar tipo de zapata según el terreno (asfalto o tierra)"
        criterio: "Pads de goma limpios para pavimento urbano; garras de acero limpias para tierra."
        esCritico: true
      - id: "chk-freno-mano"
        tarea: "Palanca de freno de estacionamiento manual"
        criterio: "Trinquete con retención firme; luz indicadora en tablero operativa."
        esCritico: true
      - id: "chk-dientes-cucharon-trasero"
        tarea: "Puntas de balde posterior y pasadores de chaveta"
        criterio: "Sin pasadores doblados o faltantes; sin holguras excesivas en el enganche rápido."
        esCritico: false
  - categoria: "Procedimiento de Apoyo y Estabilización"
    items:
      - id: "chk-estabilizacion-correcta"
        tarea: "Despliegue de estabilizadores y cuchara frontal antes de excavar"
        criterio: "Cucharón delantero apoyado con ruedas delanteras a 5 cm del suelo; neumáticos traseros sin peso muerto."
        esCritico: true
      - id: "chk-traba-pluma"
        tarea: "Liberación de la palanca de seguro de pluma para iniciar excavación"
        criterio: "Desenganche suave del pestillo con leve levantamiento de la pluma hacia el tope."
        esCritico: true
quiz:
  - id: 1
    pregunta: "¿Cómo deben apoyarse los estabilizadores traseros y el cucharón delantero para trabajar con el brazo excavador?"
    opciones:
      - "Dejar los neumáticos traseros en el aire libremente a medio metro del suelo."
      - "Bajar el balde frontal hasta que las ruedas delanteras apenas liberen peso del suelo y bajar estabilizadores hasta nivelar la máquina firmemente."
      - "Mantener la máquina apoyada únicamente sobre sus cuatro neumáticos sin tocar el suelo con las patas."
      - "Clavar el balde frontal verticalmente en el terreno hasta hundirlo por completo."
    respuestaCorrecta: 1
    explicacion: "El apoyo triangular estable (cucharón delantero plano al suelo y ambos estabilizadores firmes) descarga el peso de los ejes neumáticos y evita que la máquina balancee o dañe los semiejes."
---

## Versatilidad de la Retroexcavadora

La retroexcavadora combina la velocidad y movilidad de un tractor sobre neumáticos con la capacidad de carga y excavación precisa en espacios confinados urbanos, instalación de tuberías de agua y zanjas eléctricas.
