import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const maquinas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/maquinas' }),
  schema: z.object({
    title: z.string(),
    model: z.string(),
    category: z.string(),
    brand: z.string(),
    description: z.string(),
    image: z.string(),
    accentColor: z.string().default('#f59e0b'),
    difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado']),
    durationHours: z.number(),
    specs: z.object({
      potenciaHp: z.number(),
      pesoOperativoTn: z.number(),
      capacidadBaldeM3: z.number().optional(),
      profundidadExcavacionM: z.number().optional(),
      alturaDescargaM: z.number().optional(),
      presionHidraulicaPsi: z.number().optional(),
    }),
    eppRequerido: z.array(z.string()),
    hotspots: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        part: z.string(),
        description: z.string(),
        critico: z.boolean(),
        frecuencia: z.string(), // "Pre-arranque", "Semanal", etc.
        coords: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
      })
    ),
    checklist: z.array(
      z.object({
        categoria: z.string(),
        items: z.array(
          z.object({
            id: z.string(),
            tarea: z.string(),
            criterio: z.string(),
            esCritico: z.boolean(),
          })
        ),
      })
    ),
    quiz: z.array(
      z.object({
        id: z.number(),
        pregunta: z.string(),
        opciones: z.array(z.string()),
        respuestaCorrecta: z.number(),
        explicacion: z.string(),
      })
    ),
  }),
});

const seguridad = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/seguridad' }),
  schema: z.object({
    title: z.string(),
    code: z.string(),
    category: z.string(),
    description: z.string(),
    priority: z.enum(['Crítica', 'Alta', 'Media']),
    order: z.number(),
    badgeColor: z.string().default('yellow'),
  }),
});

export const collections = { maquinas, seguridad };
