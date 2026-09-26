---
title: "Excavadora Hidráulica de Orugas"
model: "CAT 320 GC / Komatsu PC200"
category: "Excavadoras"
brand: "Caterpillar / Komatsu Spec"
description: "Piedra angular en movimiento de tierras, zanjeo y demolición. Su sistema hidráulico de alta presión y giro continuo de 360° exigen máximo rigor en inspección pre-operacional y control de zonas ciegas."
image: "/images/machines/excavadora.svg"
accentColor: "#f59e0b"
difficulty: "Intermedio"
durationHours: 12
specs:
  potenciaHp: 146
  pesoOperativoTn: 20.5
  capacidadBaldeM3: 1.2
  profundidadExcavacionM: 6.72
  alturaDescargaM: 6.49
  presionHidraulicaPsi: 5075
eppRequerido:
  - "Casco de seguridad clase E (dieléctrico)"
  - "Lentes de seguridad con protección UV y lateral"
  - "Chaleco reflectivo de alta visibilidad (Clase 2 o 3)"
  - "Zapatos con puntera de acero o composite y suela antipunzonamiento"
  - "Protección auditiva tipo copa (NRR >= 25dB)"
  - "Guantes de cuero flor / nitrilo de alta resistencia mecánica"
hotspots:
  - id: "nivel-aceite-motor"
    title: "Varilla de Nivel de Aceite Motor"
    part: "Compartimiento de Motor"
    description: "Verificar con máquina nivelada y motor frío. El nivel debe situarse estrictamente en la zona rayada de la varilla. Inspeccionar olor o consistencia lechosa (posible fuga de refrigerante)."
    critico: true
    frecuencia: "Diario / Pre-arranque"
    coords: { x: 0.2, y: 1.5, z: -1.2 }
  - id: "tension-orugas"
    title: "Tensión del Tren de Rodaje y Orugas"
    part: "Tren Inferior"
    description: "Inspeccionar la comba o flecha de la oruga sobre los rodillos superiores. Orugas muy tensas provocan desgaste prematuro de bujes y mandos finales; orugas flojas arriesgan desengarpe."
    critico: true
    frecuencia: "Diario / Pre-arranque"
    coords: { x: -1.4, y: 0.4, z: 0.0 }
  - id: "cilindros-hidraulicos"
    title: "Vástagos y Sellos de Cilindros Hidráulicos"
    part: "Pluma (Boom) y Balancín (Arm)"
    description: "Revisar picaduras, rayaduras o pérdida de cromado en los vástagos. Detectar rezumes de aceite hidráulico en las empaquetaduras de los cilindros de pluma, brazo y balde."
    critico: true
    frecuencia: "Diario / Pre-arranque"
    coords: { x: 0.0, y: 2.2, z: 1.8 }
  - id: "dientes-balde"
    title: "Dientes, Puntas y Cuchillas de Desgaste"
    part: "Herramienta de Ataque (GET)"
    description: "Comprobar pasadores y retenedores de las puntas del cucharón. El uso con dientes quebrados o desgastados multiplica el esfuerzo hidráulico y dispara el consumo de combustible."
    critico: false
    frecuencia: "Diario / Pre-arranque"
    coords: { x: 0.0, y: 0.5, z: 3.5 }
  - id: "filtro-separador-agua"
    title: "Filtro Decantador de Combustible"
    part: "Sistema de Inyección Diésel"
    description: "Drenar el agua y sedimentos acumulados en el vaso transparente inferior antes de encender el motor para evitar daños irreversibles a la bomba e inyectores Common Rail."
    critico: true
    frecuencia: "Diario"
    coords: { x: 0.5, y: 1.2, z: -1.0 }
checklist:
  - categoria: "Inspección Alrededor de la Máquina (Vuelta del Gallo)"
    items:
      - id: "chk-fugas"
        tarea: "Inspección de fugas hidráulicas, refrigerante y combustible en suelo y chasís"
        criterio: "Sin charcos ni goteos activos bajo el tren de rodaje o mandos finales."
        esCritico: true
      - id: "chk-orugas"
        tarea: "Comprobar pernos sueltos en zapatas y desgaste en ruedas guía/sprockets"
        criterio: "Zapatas firmes, sin fisuras visibles ni acumulación excesiva de lodo o rocas."
        esCritico: true
      - id: "chk-luces"
        tarea: "Verificación de faros de trabajo LED en pluma y cabina, circulina y baliza"
        criterio: "Todas las luces operativas sin micas rajadas ni suciedad opacante."
        esCritico: false
  - categoria: "Fluidos y Compartimiento de Potencia"
    items:
      - id: "chk-aceite-motor"
        tarea: "Medición de nivel y condición del aceite de motor"
        criterio: "Entre marcas ADD y FULL. Sin contaminación ni virutas metálicas."
        esCritico: true
      - id: "chk-aceite-hidraulico"
        tarea: "Nivel de visor del tanque hidráulico (posición de transporte/inspección)"
        criterio: "Brazo retraído y balde apoyado en suelo; nivel visible en mirilla verde."
        esCritico: true
      - id: "chk-filtro-aire"
        tarea: "Válvula de vaciado de polvo del filtro de aire primario"
        criterio: "Oprimir boquilla de goma para expulsar polvo acumulado; sensor sin alarma."
        esCritico: false
  - categoria: "Cabina y Controles Operacionales"
    items:
      - id: "chk-cinturon"
        tarea: "Cinturón de seguridad retráctil de 3 pulgadas"
        criterio: "Mecanismo traba con tirón súbito; cinta sin cortes ni desgaste por roce."
        esCritico: true
      - id: "chk-palanca-bloqueo"
        tarea: "Palanca roja de bloqueo hidráulico (control lock)"
        criterio: "En posición levantada (bloqueada) ningún joystick ni pedal debe enviar presión."
        esCritico: true
      - id: "chk-alarma-retroceso"
        tarea: "Alarma sonora de desplazamiento / retroceso y bocina de cabina"
        criterio: "Audible a más de 15 metros en ambiente de obra con ruido activo."
        esCritico: true
quiz:
  - id: 1
    pregunta: "¿Cuál es la posición reglamentaria de la excavadora para medir con precisión el nivel de aceite hidráulico?"
    opciones:
      - "Con la pluma totalmente extendida hacia arriba para liberar los pistones."
      - "En suelo plano, brazo retraído, cilindro de balde extendido con el cucharón apoyado en el suelo."
      - "En cualquier pendiente siempre que el freno de giro esté accionado."
      - "Con el motor encendido a 1800 RPM y sistema hidráulico en ciclo cerrado."
    respuestaCorrecta: 1
    explicacion: "El manual del fabricante exige colocar los cilindros en posición de servicio (balde apoyado en suelo y brazo replegado) para que el volumen de fluido retorne al depósito principal."
  - id: 2
    pregunta: "Durante la operación en pendiente pronunciada (>25%), ¿cómo debe desplazarse la excavadora al subir?"
    opciones:
      - "Con la cabina orientada hacia abajo para tener vista de retroceso."
      - "Con los mandos finales hacia atrás y el equipo de trabajo extendido al ras del suelo hacia arriba (a 20-30 cm)."
      - "Con el cucharón cargado de material para aumentar el peso sobre el eje frontal."
      - "A máxima velocidad para ganar inercia sin desacelerar."
    respuestaCorrecta: 1
    explicacion: "Al subir una pendiente, el cucharón debe orientarse ladera arriba a 20-30 cm del terreno para actuar como freno o anclaje de emergencia si la oruga pierde tracción."
  - id: 3
    pregunta: "¿Por qué es crucial bajar la palanca roja de bloqueo hidráulico antes de salir de la cabina?"
    opciones:
      - "Para apagar el compresor del aire acondicionado."
      - "Para despresurizar el sistema piloto e impedir movimientos accidentales por roce con la ropa o calzado."
      - "Para purgar el tanque de combustible automáticamente."
      - "Para evitar que la batería se descargue con la radio."
    respuestaCorrecta: 1
    explicacion: "La palanca de traba corta el paso del fluido piloto hacia las válvulas principales, asegurando que un enganche involuntario de los joysticks no cause un accidente fatal."
---

## Introducción a la Excavadora Hidráulica

La excavadora hidráulica es el equipo rey en obras civiles pesadas y minería a cielo abierto. Su configuración sobre orugas le confiere estabilidad en terrenos fangosos o pedregosos, distribuyendo su peso de más de 20 toneladas en una baja presión sobre el suelo (PSI).

### Componentes Clave:
1. **Tren de rodaje:** Orugas de acero, rodillos inferiores/superiores, rueda guía (idlers) y rueda motriz (sprocket).
2. **Torreta o superestructura:** Aloja el motor diésel turboalimentado, banco de válvulas distribuidoras, bomba de caudal variable y contrapeso.
3. **Equipo de trabajo:** Pluma monobloque (Boom), balancín (Arm) y cuchara de excavación con dientes intercambiables.
4. **Cabina con certificación ROPS/FOPS:** Protección contra volcaduras y caída de objetos.
