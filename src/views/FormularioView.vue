<template>
  <v-container class="bg-grey-lighten-4 fill-height align-start pt-md-8" fluid>
    
    <div class="d-flex justify-end w-100 px-4 mb-4">
      <v-btn variant="text" color="teal-darken-3" prepend-icon="mdi-shield-account" size="small" to="/login">
        Acceso Administrativo
      </v-btn>
    </div>

    <v-row justify="center" class="w-100 mx-auto" style="max-width: 1200px;">
      
      <v-col cols="12" md="7" lg="8">
        <v-card class="elevation-10 rounded-lg">
          <v-toolbar color="teal-darken-4" dark flat class="px-2">
            <v-icon icon="mdi-school-outline" class="mr-2"></v-icon>
            <v-toolbar-title class="font-weight-bold text-body-1 text-md-h6">
              Registro de Aspirantes Mantenimiento Industrial UTXJ
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-4 pa-md-6">
            
            <div v-if="registroExitoso" class="text-center py-6 animated fadeIn">
  <v-icon 
    :icon="esNuevoRegistro ? 'mdi-check-circle' : 'mdi-information'" 
    :color="esNuevoRegistro ? 'success' : 'blue-darken-2'" 
    size="80" 
    class="mb-4"
  ></v-icon>

  <h2 class="text-h5 font-weight-black text-teal-darken-4 mb-2">
    {{ esNuevoRegistro ? '¡Registro Exitoso!' : 'Número ya Registrado' }}
  </h2>
  
  <p class="text-body-1 mb-6">
    {{ esNuevoRegistro 
       ? 'Tus datos han sido recibidos correctamente en el área de Mantenimiento.' 
       : 'Este número ya se encuentra en nuestro sistema. No es necesario registrarte de nuevo.' 
    }}
  </p>

  <v-card variant="flat" color="teal-lighten-5" class="pa-6 border-dashed border-teal-darken-4 mb-6 rounded-xl text-left">
    <h3 class="text-h6 font-weight-bold text-teal-darken-4 mb-4 text-center">
      <v-icon icon="mdi-laptop" class="mr-2"></v-icon>Pasos para tu Trámite Oficial
    </h3>
    
    <v-list bg-color="transparent" density="compact" class="mb-4">
      <v-list-item prepend-icon="mdi-monitor-screenshot" class="mb-2">
        <v-list-item-title class="text-wrap">
          <strong>Usa una computadora:</strong> El sistema oficial SII <strong>no funciona correctamente en celulares</strong>.
        </v-list-item-title>
      </v-list-item>

      <v-list-item prepend-icon="mdi-cursor-default-click" class="mb-2">
        <v-list-item-title class="text-wrap">
          <strong>Selecciona "Aspirantes":</strong> Dentro del portal oficial, busca la opción "Registro de Ficha de Admisión" y sigue los pasos.
        </v-list-item-title>
      </v-list-item>

      <v-list-item prepend-icon="mdi-whatsapp" class="text-green-darken-3">
        <v-list-item-title class="text-wrap">
          <strong>¿Dudas?</strong> Contacta a los administradores del grupo; ellos resolverán tus dudas de inmediato.
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mb-6"></v-divider>
    <div class="text-subtitle-1 font-weight-bold text-teal-darken-4 mb-3 text-center">
      <v-icon icon="mdi-play-circle" class="mr-1"></v-icon> ¿Cómo generar tu ficha?
    </div>
    
    <v-responsive :aspect-ratio="16/9" class="rounded-lg elevation-4 mb-6">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/NWoRq-t3JT8"
        title="Tutorial de Registro SII"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </v-responsive>
    <v-btn 
      color="teal-darken-4" 
      size="x-large" 
      block 
      elevation="4"
      href="http://201.116.22.214:8080/sii2/controlEscolar/aspirante/registroFichaAspirante.xhtml" 
      target="_blank"
      prepend-icon="mdi-file-document-edit"
      class="font-weight-bold mt-4"
    >
      Ir a Generar Ficha Oficial
    </v-btn>
  </v-card>

  <v-btn variant="text" color="teal-darken-2" @click="limpiarFormulario">
    <v-icon icon="mdi-arrow-left" class="mr-1"></v-icon> Volver al inicio
  </v-btn>
</div>
            <v-form v-else ref="formRef" v-model="formularioValido" @submit.prevent="enviarFormulario">
              <v-alert type="info" variant="tonal" class="mb-5 text-caption text-md-body-2" density="compact">
                Ingresa tus datos correctamente. El teléfono será usado para contactarte vía WhatsApp.
              </v-alert>

              <h3 class="text-subtitle-1 text-md-h6 mb-3 text-teal-darken-4 font-weight-bold">Datos del Aspirante</h3>
              <v-row dense>
                <v-col cols="12" sm="6"><v-text-field v-model="prospecto.nombre" label="Nombre(s) *" variant="outlined" density="comfortable" :rules="[reglas.requerido]"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field v-model="prospecto.ap_paterno" label="Apellido Paterno *" variant="outlined" density="comfortable" :rules="[reglas.requerido]"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field v-model="prospecto.ap_materno" label="Apellido Materno" variant="outlined" density="comfortable"></v-text-field></v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="prospecto.telefono" label="Teléfono (WhatsApp) *" variant="outlined" density="comfortable" prepend-inner-icon="mdi-whatsapp" type="tel" maxlength="10" placeholder="Ej. 7641234567" :rules="[reglas.requerido, reglas.telefonoMX]" @input="filtrarNumeros"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-combobox v-model="prospecto.localidad_origen" :items="localidadesSugeridas" label="Localidad / Municipio" variant="outlined" density="comfortable" prepend-inner-icon="mdi-map-marker" hint="Selecciona o escribe tu localidad" persistent-hint clearable></v-combobox>
                </v-col>
              </v-row>

              <v-divider class="my-5"></v-divider>

              <h3 class="text-subtitle-1 text-md-h6 mb-3 text-teal-darken-4 font-weight-bold">Interés Académico</h3>
              <v-select v-model="prospecto.carrera_interes" :items="carrerasList" label="Selecciona una Carrera *" variant="outlined" density="comfortable" prepend-inner-icon="mdi-school" :rules="[reglas.requerido]"></v-select>

              <v-divider class="my-5"></v-divider>

              <h3 class="text-subtitle-1 text-md-h6 mb-3 text-teal-darken-4 font-weight-bold">Visita al Área de Mantenimiento Industrial</h3>
              
              <v-card variant="outlined" class="pa-4 border-success bg-green-lighten-5" v-if="prospecto.visita_industrial">
                 <div class="text-caption text-md-subtitle-2 text-green-darken-4 font-weight-bold mb-2">Selecciona la fecha y hora tentativa para tu visita.</div>
                 <div class="text-caption text-grey-darken-2 mb-3">
                   <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                   <strong>Horario permitido:</strong> Lunes a Viernes de 9:00 AM a 3:30 PM.
                 </div>
                 <v-row no-gutters align="center">
                   <v-col cols="12" sm="8">
                     <v-text-field v-model="prospecto.fecha_agenda" type="datetime-local" variant="outlined" density="compact" bg-color="white" :rules="[reglas.horarioVisita]"></v-text-field>
                   </v-col>
                   <v-col cols="12" sm="4" class="text-right mt-3 mt-sm-0">
                     <v-btn size="small" color="red" variant="text" @click="prospecto.visita_industrial = false; prospecto.fecha_agenda = null">Cancelar Visita</v-btn>
                   </v-col>
                 </v-row>
              </v-card>
              
              <v-btn v-else block variant="tonal" color="success" prepend-icon="mdi-calendar-plus" @click="prospecto.visita_industrial = true" class="py-4 text-caption text-md-button">
                Sí, quiero agendar una visita guiada
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions v-if="!registroExitoso" class="pa-4 bg-grey-lighten-4 flex-column flex-sm-row">
            <v-btn color="grey-darken-2" variant="text" @click="limpiarFormulario" class="mb-2 mb-sm-0 w-100 w-sm-auto">Limpiar Datos</v-btn>
            <v-spacer class="d-none d-sm-block"></v-spacer>
            <v-btn color="teal-darken-4" variant="elevated" @click="enviarFormulario" :loading="cargando" :disabled="!formularioValido" class="px-6 w-100 w-sm-auto" size="large">
              Registrarme Oficialmente
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="5" lg="4">
        <v-card class="elevation-10 rounded-lg h-100 d-flex flex-column" color="teal-darken-4" theme="dark">
          <v-card-text class="text-center pa-6 d-flex flex-column justify-center flex-grow-1">
            
            <v-avatar color="green-accent-4" size="64" class="mx-auto mb-4 elevation-5">
              <v-icon icon="mdi-whatsapp" size="40" color="white"></v-icon>
            </v-avatar>
            
            <h5 class="text-h6 font-weight-black mb-2 text-white">¡Únete a la Comunidad de Aspirantes!</h5>
            <p class="text-body-2 text-teal-lighten-4 mb-6">
              Escanea este código para unirte a nuestro grupo oficial de WhatsApp. Recibe noticias al instante.
            </p>

            <v-card color="white" class="pa-3 mx-auto rounded-xl elevation-5" max-width="220">
              <img 
                src="/logos/QR.jpg" 
                alt="Código QR de WhatsApp" 
                style="width: 100%; height: auto; border-radius: 8px; display: block;"
              />
            </v-card>

            <div class="mt-6">
              <div class="text-caption text-teal-lighten-2 mb-2">¿Estás viendo esto desde tu celular?</div>
              <v-btn 
                color="green-accent-4" 
                variant="elevated" 
                prepend-icon="mdi-link-variant" 
                block 
                size="large"
                class="text-teal-darken-4 font-weight-bold"
                href="https://chat.whatsapp.com/DDTeLnltAZD9WODtWYQ461?mode=gi_t" 
                target="_blank"
              >
                Toca aquí para unirte
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top" elevation="24">
      <div class="text-body-1 font-weight-bold">{{ snackbar.text }}</div>
      <template v-slot:actions><v-btn variant="text" color="white" @click="snackbar.show = false">Cerrar</v-btn></template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api'; 

const formRef = ref(null);
const formularioValido = ref(false);
const cargando = ref(false);
const registroExitoso = ref(false); 
const esNuevoRegistro = ref(true); 

const prospecto = ref({
  nombre: '', ap_paterno: '', ap_materno: '', localidad_origen: '', 
  telefono: '', carrera_interes: null, visita_industrial: false, fecha_agenda: null
});

const carrerasList = ['T.S.U. Mantenimiento Industrial', 'T.S.U. Mantenimiento Petróleo', 'T.S.U. Mantenimiento Soldadura', 'Ingeniería en Mantenimiento Industrial'];
const localidadesSugeridas = ['Xicotepec de Juárez', 'Huauchinango', 'Juan Galindo (Nuevo Necaxa)', 'Zihuateutla', 'Tlaxcalantongo', 'Tlacuilotepec', 'Jalpan', 'Tlaxco', 'Venustiano Carranza', 'Pantepec', 'Francisco Z. Mena', 'Villa Ávila Camacho (La Ceiba)'];
const snackbar = ref({ show: false, text: '', color: 'success' });

const reglas = {
  requerido: value => !!value || 'Este campo es obligatorio.',
  telefonoMX: value => (value && value.length === 10) || 'El número debe tener 10 dígitos.',
  horarioVisita: (value) => {
    if (!prospecto.value.visita_industrial) return true; 
    if (!value) return 'Debes seleccionar una fecha y hora.';
    const fechaSeleccionada = new Date(value);
    const diaSemana = fechaSeleccionada.getDay(); 
    const horas = fechaSeleccionada.getHours();
    const minutos = fechaSeleccionada.getMinutes();
    if (diaSemana === 0 || diaSemana === 6) return 'Las visitas no están disponibles en fin de semana.';
    const tiempoEnMinutos = (horas * 60) + minutos;
    const inicioMinutos = 9 * 60; 
    const finMinutos = (15 * 60) + 30; 
    if (tiempoEnMinutos < inicioMinutos || tiempoEnMinutos > finMinutos) return 'El horario válido es de 09:00 AM a 03:30 PM.';
    return true; 
  }
};

const filtrarNumeros = () => {
  if (prospecto.value.telefono) prospecto.value.telefono = prospecto.value.telefono.replace(/\D/g, '');
};

const enviarFormulario = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    mostrarMensaje('Por favor revisa los campos en rojo.', 'warning');
    return;
  }

  cargando.value = true;
  try {
    const telefonoLimpio = prospecto.value.telefono.replace(/\D/g, '');
    prospecto.value.telefono = telefonoLimpio;
    
    await api.post('/prospectos/', prospecto.value);
    
    esNuevoRegistro.value = true;
    registroExitoso.value = true; 
    mostrarMensaje('¡Registro exitoso!', 'success');
    
  } catch (error) {
    // Obtenemos el mensaje que viene del servidor
    const mensajeError = error.response?.data?.detail || '';
    
    // LOG DE DEPURACIÓN (Opcional: puedes verlo en la consola del navegador F12)
    console.log("Error del servidor:", mensajeError);

    // VALIDACIÓN FLEXIBLE:
    // Buscamos si el error contiene "ya se encuentra registrado" o "ya existe"
    const esDuplicado = mensajeError.toLowerCase().includes('registrado') || 
                        mensajeError.toLowerCase().includes('existe');

    if (error.response?.status === 400 && esDuplicado) {
      esNuevoRegistro.value = false; // Cambia el título a "Número ya Registrado"
      registroExitoso.value = true;  // Muestra la pantalla de la ficha del SII
      mostrarMensaje('Tu número ya está en el sistema. Redirigiendo a instrucciones...', 'info');
    } else {
      // Si es otro tipo de error (ej. conexión), mostramos el mensaje normal
      mostrarMensaje(mensajeError || 'Hubo un error al registrar.', 'error');
    }
  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
  registroExitoso.value = false;
  esNuevoRegistro.value = true;
  prospecto.value = {
    nombre: '', ap_paterno: '', ap_materno: '', localidad_origen: '', 
    telefono: '', carrera_interes: null, visita_industrial: false, fecha_agenda: null
  };
  if (formRef.value) formRef.value.resetValidation();
};

const mostrarMensaje = (texto, color) => {
  snackbar.value = { show: true, text: texto, color: color };
};
</script>

<style scoped>
.v-btn { transition: all 0.3s ease; }
.animated { animation-duration: 0.5s; animation-fill-mode: both; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fadeIn { animation-name: fadeIn; }
.border-dashed { border-style: dashed !important; border-width: 2px !important; }
</style>

