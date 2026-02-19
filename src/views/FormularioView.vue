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
              Registro de Aspirantes UTXJ
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pa-4 pa-md-6">
            <v-alert type="info" variant="tonal" class="mb-5 text-caption text-md-body-2" density="compact">
              Ingresa tus datos correctamente. El teléfono será usado para contactarte vía WhatsApp.
            </v-alert>

            <v-form ref="formRef" v-model="formularioValido" @submit.prevent="enviarFormulario">
              <h3 class="text-subtitle-1 text-md-h6 mb-3 text-teal-darken-4 font-weight-bold">Datos Personales</h3>
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

              <h3 class="text-subtitle-1 text-md-h6 mb-3 text-teal-darken-4 font-weight-bold">Visita Industrial</h3>
              
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

          <v-card-actions class="pa-4 bg-grey-lighten-4 flex-column flex-sm-row">
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
            
            <h2 class="text-h5 font-weight-black mb-2 text-white">¡Únete a la Comunidad!</h2>
            <p class="text-body-2 text-teal-lighten-4 mb-6">
              Escanea este código o tócalo para unirte a nuestro grupo oficial de WhatsApp. Recibe noticias y resuelve tus dudas al instante.
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

const prospecto = ref({
  nombre: '', ap_paterno: '', ap_materno: '', localidad_origen: '', 
  telefono: '', carrera_interes: null, visita_industrial: false, fecha_agenda: null
});

const carrerasList = ['T.S.U. Mantenimiento Industrial', 'T.S.U. Mantenimiento Petróleo', 'T.S.U. Mantenimiento Soldadura', 'Ingeniería en Mantenimiento Industrial'];
const localidadesSugeridas = ['Xicotepec de Juárez', 'Huauchinango', 'Juan Galindo (Nuevo Necaxa)', 'Zihuateutla', 'Tlaxcalantongo', 'Tlacuilotepec', 'Jalpan', 'Tlaxco', 'Venustiano Carranza', 'Pantepec', 'Francisco Z. Mena', 'Villa Ávila Camacho (La Ceiba)'];
const snackbar = ref({ show: false, text: '', color: 'success' });

// --- VALIDACIONES MODO ESTRICTO ---
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
    
    if (diaSemana === 0 || diaSemana === 6) {
      return 'Las visitas no están disponibles en fin de semana.';
    }
    
    const tiempoEnMinutos = (horas * 60) + minutos;
    const inicioMinutos = 9 * 60; 
    const finMinutos = (15 * 60) + 30; 
    
    if (tiempoEnMinutos < inicioMinutos || tiempoEnMinutos > finMinutos) {
      return 'El horario válido es de 09:00 AM a 03:30 PM.';
    }
    
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

  const telefonoLimpio = prospecto.value.telefono.replace(/\D/g, '');
  if (telefonoLimpio.length !== 10) {
    mostrarMensaje('El teléfono debe tener 10 dígitos exactos.', 'warning');
    return;
  }

  cargando.value = true;
  try {
    prospecto.value.telefono = telefonoLimpio;
    await api.post('/prospectos/', prospecto.value);
    
    mostrarMensaje('¡Registro exitoso! Bienvenido a Mantenimiento Industrial UTXJ.', 'success');
    limpiarFormulario();
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
       mostrarMensaje(error.response.data.detail || 'Error en los datos proporcionados.', 'error');
    } else {
       mostrarMensaje('Hubo un error al registrar. Verifica tu conexión a internet.', 'error');
    }
  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
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
</style>