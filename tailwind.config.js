/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Usar 'class' para control manual
  content: [
    './src/**/*.{html,ts}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios basados en la imagen
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Color azul principal de la imagen
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // Colores de éxito (verde)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Verde éxito de la imagen
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        // Paleta de grises para modo oscuro (basada en la imagen)
        dark: {
          50: '#f9fafb',   // Texto muy claro
          100: '#f3f4f6',  // Texto claro
          200: '#e5e7eb',  // Bordes claros 
          300: '#d1d5db',  // Texto medio
          400: '#9ca3af',  // Texto secundario (#9CA3AF de la imagen)
          500: '#6b7280',  // Texto deshabilitado
          600: '#4b5563',  // Elementos UI secundarios
          700: '#374151',  // Elementos UI (#374151 de la imagen)
          800: '#1f2937',  // Superficies (#1F2937 de la imagen)
          900: '#111827'   // Fondo principal (#111827 de la imagen)
        }
      },
      // Personalización adicional para modo oscuro
      backgroundColor: {
        'dark-primary': '#111827',    // Fondo principal
        'dark-secondary': '#1f2937',  // Superficies 
        'dark-tertiary': '#374151',   // Elementos UI
      },
      textColor: {
        'dark-primary': '#ffffff',    // Texto principal blanco
        'dark-secondary': '#9ca3af',  // Texto secundario gris
      },
      borderColor: {
        'dark-border': '#374151',     // Bordes en modo oscuro
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
};