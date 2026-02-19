<template>
  <v-navigation-drawer v-model="drawer" color="teal-darken-4" theme="dark" elevation="5" permanent :rail="rail">
    <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.png" title="Administrador" subtitle="Control Escolar UTXJ" nav class="py-4">
      <template v-slot:append v-if="!rail"><v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = true"></v-btn></template>
    </v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" nav class="mt-2">
      <v-list-item prepend-icon="mdi-table-account" title="Gestión de Alumnos" value="gestion" @click="tab = 'gestion'; rail = false" :active="tab === 'gestion'" active-color="amber-accent-4"></v-list-item>
      <v-list-item prepend-icon="mdi-chart-box-outline" title="Estadísticas y Agenda" value="stats" @click="tab = 'stats'; rail = false" :active="tab === 'stats'" active-color="amber-accent-4"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn v-if="!rail" block color="white" variant="outlined" prepend-icon="mdi-logout" @click="cerrarSesion">Cerrar Sesión</v-btn>
        <v-btn v-else icon="mdi-logout" color="white" variant="text" @click="cerrarSesion"></v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar color="white" elevation="1" density="comfortable">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="teal-darken-4"></v-app-bar-nav-icon>
    <v-app-bar-title class="text-subtitle-1 font-weight-bold text-teal-darken-4 text-uppercase">Panel de Control - Mantenimiento Industrial</v-app-bar-title>
    <template v-slot:append>
      <v-chip size="small" color="success" variant="flat" class="mr-2"><v-icon start icon="mdi-circle-slice-8" size="x-small" class="animate-pulse"></v-icon>En Línea</v-chip>
    </template>
  </v-app-bar>

  <v-main class="bg-grey-lighten-5">
    <v-container fluid class="pa-4">

      <v-card flat class="bg-transparent mb-4">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="auto"><img src="/logos/mascota.png" alt="Mascota" style="height: 65px; object-fit: contain;"></v-col>
          <v-col class="text-center px-4">
            <h1 class="text-h5 font-weight-black text-grey-darken-3 text-uppercase">{{ tab === 'gestion' ? 'Gestión de Aspirantes' : 'Dashboard y Agenda' }}</h1>
            <div class="text-caption text-grey-darken-1">Ciclo Escolar 2026 - Universidad Tecnológica de Xicotepec de Juárez</div>
          </v-col>
          <v-col cols="auto"><img src="/logos/industrial 1.png" alt="Logo Industrial" style="height: 60px; object-fit: contain;"></v-col>
        </v-row>
      </v-card>

      <v-window v-model="tab">
        <v-window-item value="gestion">
          <v-card class="elevation-2 rounded-lg border">
            <v-toolbar flat color="white" density="compact" class="border-b pl-2 pr-2">
              <v-toolbar-title class="text-subtitle-2 font-weight-bold text-grey-darken-3">Base de Datos</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-account-plus" class="mr-2" @click="abrirDialogo()">Nuevo</v-btn>
              <v-btn color="success" size="small" variant="flat" prepend-icon="mdi-file-excel" @click="dialogExcel = true">Importar</v-btn>
            </v-toolbar>

            <v-row class="pa-3 pb-0" dense>
              <v-col cols="12" md="4">
                <v-text-field v-model="busqueda" prepend-inner-icon="mdi-magnify" label="Buscar..." variant="outlined" density="compact" bg-color="grey-lighten-5" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" md="8" class="d-flex align-center justify-end flex-wrap">
                <v-chip 
                  :color="filtroContactar ? 'red-darken-3' : 'grey-darken-1'" 
                  :variant="filtroContactar ? 'elevated' : 'tonal'" 
                  size="small" class="mr-2 mb-1"
                  @click="filtroContactar = !filtroContactar"
                >
                  <v-icon start :icon="filtroContactar ? 'mdi-filter-remove' : 'mdi-phone-alert'"></v-icon>
                  {{ filtroContactar ? 'Quitar Filtro' : 'No Constestan' }}
                </v-chip>
                
                <v-chip color="blue-darken-3" variant="tonal" size="small" class="mr-2 mb-1"><v-icon start icon="mdi-school"></v-icon>Preinscritos</v-chip>
                <v-chip color="green-darken-3" variant="tonal" size="small" class="mb-1"><v-icon start icon="mdi-calendar-check"></v-icon>Citas</v-chip>
              </v-col>
            </v-row>

            <v-data-table
              :headers="encabezados" :items="alumnosFiltrados" :search="busqueda" :loading="cargando"
              items-per-page="10" hover :row-props="rowProps" class="header-bold text-caption mt-2" density="compact"
            >
              <template v-slot:item.contactado="{ item }">
                <v-tooltip location="top" :text="item.contactado ? 'Ya contactado. Clic para deshacer.' : 'Falta contactar. Clic para marcar como contactado.'">
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      icon size="x-small" variant="flat" v-bind="props"
                      :color="item.contactado ? 'green-lighten-4' : 'red-lighten-4'"
                      :class="item.contactado ? 'text-green-darken-4' : 'text-red-darken-4'"
                      @click="toggleContacto(item)"
                    >
                      <v-icon :icon="item.contactado ? 'mdi-phone-check' : 'mdi-phone-alert'"></v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>

              <template v-slot:item.preinscrito="{ item }">
                <v-chip :color="item.preinscrito ? 'blue-darken-2' : 'grey-lighten-2'" :class="item.preinscrito ? 'text-white' : 'text-grey-darken-1'" size="x-small" label class="font-weight-bold">
                  {{ item.preinscrito ? 'SÍ' : 'NO' }}
                </v-chip>
              </template>

              <template v-slot:item.telefono="{ item }">
                <div class="d-flex align-center">
                  <span class="font-weight-medium mr-2">{{ item.telefono }}</span>
                  <v-btn icon="mdi-whatsapp" size="x-small" color="green" variant="text" @click="enviarWhatsapp(item)"></v-btn>
                </div>
              </template>
              
              <template v-slot:item.notas_admin="{ item }">
                <div v-if="item.notas_admin && item.notas_admin.length > 2">
                  <v-tooltip location="top" :text="item.notas_admin">
                    <template v-slot:activator="{ props }"><v-icon v-bind="props" color="amber-darken-4" icon="mdi-star" size="small"></v-icon></template>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:item.visita_industrial="{ item }">
                <div class="d-flex align-center">
                  <v-chip :color="item.visita_industrial ? 'green-lighten-5' : 'grey-lighten-4'" :class="item.visita_industrial ? 'text-green-darken-4' : 'text-grey-darken-1'" size="x-small" label class="font-weight-bold border mr-2">
                    {{ item.visita_industrial ? 'SÍ' : 'NO' }}
                  </v-chip>
                  <div v-if="item.visita_industrial && item.fecha_agenda" class="d-flex flex-column lh-1">
                     <span class="text-green-darken-3 font-weight-bold" style="font-size: 0.7rem;">{{ new Date(item.fecha_agenda).toLocaleDateString() }}</span>
                     <span :class="esVisitaActiva(item.fecha_agenda) ? 'text-grey-darken-1' : 'text-red'" style="font-size: 0.65rem;">
                       {{ new Date(item.fecha_agenda).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                     </span>
                  </div>
                </div>
              </template>

              <template v-slot:item.acciones="{ item }">
                <v-btn icon="mdi-pencil" size="x-small" variant="text" color="blue" @click="abrirDialogo(item)"></v-btn>
                <v-btn icon="mdi-delete" size="x-small" variant="text" color="red" @click="confirmarBorrado(item)"></v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>

        <v-window-item value="stats">
          <v-row dense>
            <v-col cols="12" sm="6" md="3">
              <v-card class="mx-auto elevation-3 rounded-xl overflow-hidden bg-teal-darken-3" height="110">
                  <div class="d-flex flex-row align-center justify-space-between fill-height px-4">
                    <div>
                      <div class="text-h4 font-weight-black text-white">{{ totalAlumnos }}</div>
                      <div class="text-caption font-weight-medium text-teal-lighten-4 text-uppercase">Aspirantes</div>
                    </div>
                    <v-icon icon="mdi-account-group" size="48" color="white" class="opacity-30"></v-icon>
                  </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="mx-auto elevation-2 rounded-xl d-flex align-center px-4 border bg-blue-lighten-5" height="110">
                 <v-avatar color="blue-darken-2" size="40" class="mr-3"><v-icon icon="mdi-school" size="24" color="white"></v-icon></v-avatar>
                 <div>
                   <div class="text-h5 text-blue-darken-4 font-weight-bold">{{ totalPreinscritos }}</div>
                   <div class="text-caption text-blue-darken-2 lh-1">Preinscritos Oficiales</div>
                 </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="mx-auto elevation-2 rounded-xl d-flex align-center px-4 border bg-red-lighten-5" height="110">
                 <v-avatar color="red-darken-2" size="40" class="mr-3"><v-icon icon="mdi-phone-alert" size="24" color="white"></v-icon></v-avatar>
                 <div>
                   <div class="text-h5 text-red-darken-4 font-weight-bold">{{ totalPorContactar }}</div>
                   <div class="text-caption text-red-darken-2 lh-1">No Constestan</div>
                 </div>
              </v-card>
            </v-col>
             <v-col cols="12" sm="6" md="3">
              <v-card class="mx-auto elevation-2 rounded-xl d-flex align-center px-4 border" height="110" color="white">
                 <v-avatar color="amber-lighten-5" size="40" class="mr-3"><v-icon icon="mdi-calendar-check" size="24" color="amber-darken-4"></v-icon></v-avatar>
                 <div>
                   <div class="text-h5 text-amber-darken-4 font-weight-bold">{{ citasPendientes }}</div>
                   <div class="text-caption text-grey lh-1">Citas Pendientes</div>
                 </div>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="12" md="6">
              <v-card class="h-100 elevation-3 rounded-lg border">
                <v-card-title class="text-caption font-weight-bold text-uppercase text-teal-darken-4 bg-grey-lighten-4">1. Demanda General</v-card-title>
                <v-card-text style="height: 280px; position: relative;" class="pa-2">
                  <Bar v-if="chartData.carreras.labels" :data="chartData.carreras" :options="opcionesCarreras" :plugins="[pluginLogos]" />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 elevation-3 rounded-lg border">
                <v-card-title class="text-caption font-weight-bold text-uppercase text-blue-darken-4 bg-blue-lighten-5">2. Conversión a Preinscritos</v-card-title>
                <v-card-text style="height: 280px; position: relative;" class="pa-2">
                  <Bar v-if="chartData.preinscritos.labels" :data="chartData.preinscritos" :options="opcionesCarreras" :plugins="[pluginLogos]" />
                  <div v-if="!chartData.preinscritos.labels || chartData.preinscritos.labels.length === 0" class="d-flex justify-center align-center fill-height text-grey">Aún no hay alumnos preinscritos.</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 elevation-3 rounded-lg border mt-3">
                <v-card-title class="text-caption font-weight-bold text-uppercase text-teal-darken-4 bg-grey-lighten-4 d-flex justify-space-between align-center px-3 py-1">
                  <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="mesAnterior" color="teal-darken-3"></v-btn>
                  <span>3. Agenda ({{ nombreMesSeleccionado }})</span>
                  <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="mesSiguiente" color="teal-darken-3"></v-btn>
                </v-card-title>
                <v-card-text class="pa-2 pt-0">
                  <v-row no-gutters class="text-center mb-1 mt-2">
                     <v-col v-for="dia in ['D','L','M','M','J','V','S']" :key="dia" class="text-caption font-weight-bold text-grey">{{ dia }}</v-col>
                  </v-row>
                  <div class="calendar-grid">
                    <div v-for="n in paddingDiasMes" :key="'pad-'+n" class="day-cell empty"></div>
                    <div v-for="dia in diasDelMes" :key="dia" class="day-cell" :class="{'has-event': tieneCitaActiva(dia)}" @click="verCitasDelDia(dia)">
                      <span>{{ dia }}</span>
                      <div v-if="tieneCitaActiva(dia)" class="custom-dot"></div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="h-100 elevation-3 rounded-lg border mt-3">
                <v-card-title class="text-caption font-weight-bold text-uppercase text-teal-darken-4 bg-grey-lighten-4">4. Top Localidades</v-card-title>
                <v-card-text style="height: 280px; position: relative;" class="pa-2">
                  <Bar v-if="chartData.localidades.labels" :data="chartData.localidades" :options="opcionesLocalidades" />
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>
        </v-window-item>
      </v-window>
    </v-container>

    <v-dialog v-model="dialogoEditar" max-width="800px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="edicionID ? 'blue-darken-3' : 'teal-darken-3'" density="compact" dark>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">{{ edicionID ? 'Editar Información' : 'Registrar Aspirante' }}</v-toolbar-title>
          <v-btn icon="mdi-close" size="small" @click="cerrarDialogo"></v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formularioValido">
            <v-container class="pa-0">
              <v-row dense>
                
                <v-col cols="12" sm="6" class="mb-3">
                  <v-card variant="tonal" :color="formItem.preinscrito ? 'blue-darken-2' : 'grey-darken-1'" class="pa-2 border h-100 d-flex align-center">
                    <v-switch v-model="formItem.preinscrito" :label="formItem.preinscrito ? 'Preinscrito Oficialmente' : 'Solo Interesado'" color="blue-darken-3" hide-details inset></v-switch>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" class="mb-3">
                  <v-card variant="tonal" :color="formItem.contactado ? 'green-darken-2' : 'red-darken-1'" class="pa-2 border h-100 d-flex align-center">
                    <v-switch v-model="formItem.contactado" :label="formItem.contactado ? 'Ya fue contactado' : 'Falta contactar'" color="green-darken-3" hide-details inset></v-switch>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="4"><v-text-field v-model="formItem.nombre" label="Nombre(s) *" variant="outlined" density="compact" :rules="[reglas.requerido]"></v-text-field></v-col>
                <v-col cols="12" sm="4"><v-text-field v-model="formItem.ap_paterno" label="Ap. Paterno *" variant="outlined" density="compact" :rules="[reglas.requerido]"></v-text-field></v-col>
                <v-col cols="12" sm="4"><v-text-field v-model="formItem.ap_materno" label="Ap. Materno" variant="outlined" density="compact"></v-text-field></v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field v-model="formItem.telefono" label="Teléfono (WhatsApp) *" variant="outlined" density="compact" prepend-inner-icon="mdi-whatsapp" type="tel" maxlength="10" :rules="[reglas.requerido, reglas.telefonoMX]" @input="filtrarNumeros"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6"><v-text-field v-model="formItem.localidad_origen" label="Localidad" variant="outlined" density="compact" prepend-inner-icon="mdi-map-marker"></v-text-field></v-col>
                
                <v-col cols="12">
                  <v-select v-model="formItem.carrera_interes" :items="carrerasList" label="Carrera de Interés *" variant="outlined" density="compact" prepend-inner-icon="mdi-school" :rules="[reglas.requerido]"></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-card variant="outlined" class="pa-3 border-success bg-green-lighten-5" v-if="formItem.visita_industrial">
                     <div class="text-caption text-green-darken-4 font-weight-bold mb-1">Cita Programada</div>
                     <v-row no-gutters align="center">
                       <v-col cols="12" sm="8"><v-text-field v-model="formItem.fecha_agenda" type="datetime-local" variant="outlined" density="compact" bg-color="white" :rules="[reglas.horarioVisita]"></v-text-field></v-col>
                       <v-col cols="12" sm="4" class="text-sm-right mt-2 mt-sm-0"><v-btn size="small" color="red" variant="text" @click="formItem.visita_industrial = false; formItem.fecha_agenda = null">Cancelar Cita</v-btn></v-col>
                     </v-row>
                  </v-card>
                  <v-btn v-else block variant="tonal" color="success" prepend-icon="mdi-calendar-plus" @click="formItem.visita_industrial = true">Agendar Visita</v-btn>
                </v-col>
                
                <v-col cols="12"><v-textarea v-model="formItem.notas_admin" label="Notas Administrativas" rows="2" variant="outlined" density="compact" bg-color="amber-lighten-5"></v-textarea></v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn :color="edicionID ? 'blue-darken-2' : 'teal-darken-3'" variant="elevated" @click="guardarCambios" :disabled="!formularioValido">
            {{ edicionID ? 'Guardar Cambios' : 'Registrar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialogExcel" width="400">
      <v-card class="rounded-lg">
        <v-card-title class="bg-success text-white text-subtitle-2 pa-3">Importar Excel</v-card-title>
        <v-card-text class="pa-4 text-center">
          <v-file-input v-model="archivoExcel" label="Archivo .xlsx" variant="outlined" density="compact" accept=".xlsx"></v-file-input>
          <v-btn color="success" block class="mt-2" @click="subirExcel" :loading="cargando">Subir Datos</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoCitas" max-width="500">
      <v-card class="rounded-lg">
        <v-toolbar color="green-darken-2" density="compact">
          <v-toolbar-title class="text-subtitle-1">Citas Activas: {{ fechaSeleccionadaTexto }}</v-toolbar-title>
          <v-btn icon="mdi-close" size="small" @click="dialogoCitas = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <v-list lines="two">
             <v-list-item v-for="cita in citasDelDiaSeleccionado" :key="cita.id" :title="`${cita.nombre} ${cita.ap_paterno}`" :subtitle="cita.carrera_interes">
                <template v-slot:prepend><v-avatar color="green-lighten-4" size="small"><v-icon icon="mdi-account" color="green-darken-3" size="small"></v-icon></v-avatar></template>
                <template v-slot:append><div class="text-caption font-weight-bold">{{ new Date(cita.fecha_agenda).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }} Hrs</div></template>
             </v-list-item>
             <v-list-item v-if="citasDelDiaSeleccionado.length === 0"><v-list-item-title class="text-center text-grey py-4">No hay citas programadas para este día.</v-list-item-title></v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const router = useRouter();

const drawer = ref(true);
const rail = ref(false);
const tab = ref('gestion'); 

const listaAlumnos = ref([]);
const chartData = ref({ carreras: {}, visitas: {}, localidades: {}, preinscritos: {} });
const cargando = ref(false);
const busqueda = ref('');
const filtroContactar = ref(false); // NUEVO FILTRO

const dialogExcel = ref(false);
const archivoExcel = ref(null);
const dialogoEditar = ref(false);
const edicionID = ref(null);
const formItem = ref({});
const formRef = ref(null);
const formularioValido = ref(false);
const dialogoCitas = ref(false);
const citasDelDiaSeleccionado = ref([]);
const fechaSeleccionadaTexto = ref('');

const carrerasList = ['T.S.U. Mantenimiento Industrial', 'T.S.U. Mantenimiento Petróleo', 'T.S.U. Mantenimiento Soldadura', 'Ingeniería en Mantenimiento Industrial'];

const reglas = {
  requerido: value => !!value || 'Este campo es obligatorio.',
  telefonoMX: value => (value && value.length === 10) || 'El número debe tener 10 dígitos.',
  horarioVisita: (value) => {
    if (!formItem.value.visita_industrial) return true; 
    if (!value) return 'Debes seleccionar una fecha y hora.';
    const f = new Date(value);
    if (f.getDay() === 0 || f.getDay() === 6) return 'No disponible en fin de semana.';
    const mins = (f.getHours() * 60) + f.getMinutes();
    if (mins < 540 || mins > 930) return 'Horario: 09:00 AM a 03:30 PM.';
    return true;
  }
};

const filtrarNumeros = () => { if(formItem.value.telefono) formItem.value.telefono = formItem.value.telefono.replace(/\D/g, ''); };

// --- COMPUTADOS Y FILTROS ---
// Filtramos la lista principal si el botón rojo está activo
const alumnosFiltrados = computed(() => {
    if (filtroContactar.value) {
        return listaAlumnos.value.filter(a => !a.contactado);
    }
    return listaAlumnos.value;
});

const totalAlumnos = computed(() => listaAlumnos.value.length);
const totalPreinscritos = computed(() => listaAlumnos.value.filter(a => a.preinscrito).length);
const totalPorContactar = computed(() => listaAlumnos.value.filter(a => !a.contactado).length); // NUEVO KPI
const esVisitaActiva = (fechaStr) => {
    if (!fechaStr) return false;
    return (new Date(fechaStr).getTime() + 3600000) >= new Date().getTime(); 
};
const citasPendientes = computed(() => listaAlumnos.value.filter(a => a.visita_industrial && esVisitaActiva(a.fecha_agenda)).length);

// --- CALENDARIO ---
const fechaCalendario = ref(new Date()); 
const mesSeleccionado = computed(() => fechaCalendario.value.getMonth());
const anioSeleccionado = computed(() => fechaCalendario.value.getFullYear());
const nombreMesSeleccionado = computed(() => `${['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mesSeleccionado.value]} ${anioSeleccionado.value}`);
const diasDelMes = computed(() => new Date(anioSeleccionado.value, mesSeleccionado.value + 1, 0).getDate());
const paddingDiasMes = computed(() => new Date(anioSeleccionado.value, mesSeleccionado.value, 1).getDay());
const mesAnterior = () => fechaCalendario.value = new Date(anioSeleccionado.value, mesSeleccionado.value - 1, 1);
const mesSiguiente = () => fechaCalendario.value = new Date(anioSeleccionado.value, mesSeleccionado.value + 1, 1);

const tieneCitaActiva = (dia) => listaAlumnos.value.some(a => {
    if (!a.visita_industrial || !a.fecha_agenda || !esVisitaActiva(a.fecha_agenda)) return false;
    const f = new Date(a.fecha_agenda);
    return f.getDate() === dia && f.getMonth() === mesSeleccionado.value && f.getFullYear() === anioSeleccionado.value;
});

const verCitasDelDia = (dia) => {
    if (!tieneCitaActiva(dia)) return;
    citasDelDiaSeleccionado.value = listaAlumnos.value.filter(a => {
        if (!a.visita_industrial || !a.fecha_agenda || !esVisitaActiva(a.fecha_agenda)) return false;
        const f = new Date(a.fecha_agenda);
        return f.getDate() === dia && f.getMonth() === mesSeleccionado.value && f.getFullYear() === anioSeleccionado.value;
    });
    fechaSeleccionadaTexto.value = `${dia} de ${nombreMesSeleccionado.value.split(' ')[0]}`;
    dialogoCitas.value = true;
};

// --- GRÁFICAS ---
const mapaCarreras = {
  'T.S.U. Mantenimiento Industrial': { color: '#37474F', ruta: '/logos/industrial.png', imgObj: null },
  'T.S.U. Mantenimiento Petróleo':   { color: '#7CB342', ruta: '/logos/petroleo.png', imgObj: null },
  'T.S.U. Mantenimiento Soldadura':  { color: '#424242', ruta: '/logos/soldadura.png', imgObj: null },
  'Ingeniería en Mantenimiento Industrial': { color: '#2E7D32', ruta: '/logos/ingenieria.png', imgObj: null }
};

const precargarLogos = () => { for (const c in mapaCarreras) { const i = new Image(); i.src = mapaCarreras[c].ruta; i.onload = () => mapaCarreras[c].imgObj = i; } };

const opcionesCarreras = { responsive: true, maintainAspectRatio: false, layout: { padding: { bottom: 40 } }, plugins: { legend: { display: false }, datalabels: { color: 'white', font: { weight: 'bold' } } }, scales: { x: { ticks: { display: false }, grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } } };
const opcionesLocalidades = { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { color: 'white', anchor: 'end', align: 'start', font: { weight: 'bold', size: 10 } } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } }, y: { ticks: { color: '#000', font: { size: 10, weight: 'bold' }, autoSkip: false } } } };
const pluginLogos = { id: 'customLogos', afterDraw(chart) { const { ctx, scales: { x, y } } = chart; if (!chart.data.labels || chart.config.type !== 'bar' || chart.config.options.indexAxis === 'y') return; x.ticks.forEach((t, i) => { const l = chart.data.labels[i]; const m = mapaCarreras[l]; if (m && m.imgObj && m.imgObj.complete) { const xp = x.getPixelForTick(i); const yp = y.bottom + 10; try { ctx.drawImage(m.imgObj, xp - 15, yp, 30, 30); } catch(e){} } }); } };
const generarColores = (n) => Array.from({ length: n }, (_, i) => ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][i % 5]);

// --- API & DATA ---
const cargarTodo = async () => {
  cargando.value = true;
  try {
    const resL = await api.get('/prospectos/'); listaAlumnos.value = resL.data;
    const resS = await api.get('/admin/dashboard-stats'); procesarGraficas(resS.data);
  } catch (e) { if(e.response?.status === 401) router.push('/login'); } finally { cargando.value = false; }
};

const procesarGraficas = (d) => {
    chartData.value.carreras = { labels: d.carreras.labels, datasets: [{ label: 'Aspirantes', backgroundColor: d.carreras.labels.map(l => mapaCarreras[l]?.color), data: d.carreras.data, borderRadius: 5, barPercentage: 0.6 }] };
    if(d.preinscritos) chartData.value.preinscritos = { labels: d.preinscritos.labels, datasets: [{ label: 'Preinscritos', backgroundColor: d.preinscritos.labels.map(l => mapaCarreras[l]?.color), data: d.preinscritos.data, borderRadius: 5, barPercentage: 0.6 }] };
    chartData.value.localidades = { labels: d.localidades.labels, datasets: [{ label: '', backgroundColor: generarColores(d.localidades.labels.length), data: d.localidades.data, borderRadius: 4 }] };
};

// --- CRUD & ACCIONES RÁPIDAS ---

// Botón Toggle para la tabla (Cambia de Rojo a Verde con 1 clic)
const toggleContacto = async (item) => {
    item.contactado = !item.contactado; // Lo cambiamos visualmente de inmediato
    try {
        await api.put(`/admin/prospectos/${item.id}`, item);
        // Opcional: cargarTodo() si quieres actualizar las gráficas, pero es más rápido así.
    } catch(e) {
        item.contactado = !item.contactado; // Si falla, lo regresamos a como estaba
        alert("Error al actualizar el estado de contacto.");
    }
};

const enviarWhatsapp = (i) => { 
  let n = i.telefono.replace(/\D/g, ''); if (n.length === 10) n = '52' + n; 
  window.open(`https://wa.me/${n}?text=${encodeURIComponent(`Hola ${i.nombre}, te contactamos de UTXJ.`)}`, '_blank'); 
};

const rowProps = (d) => { if (d.item.notas_admin && d.item.notas_admin.length > 2) return { class: 'bg-amber-lighten-5' }; return {}; };

const encabezados = [
  { title: 'Contactado', key: 'contactado', align: 'center', sortable: false }, 
  { title: 'Preinscrito', key: 'preinscrito', align: 'center' }, 
  { title: 'Nombre', key: 'nombre' }, { title: 'Apellido', key: 'ap_paterno' }, 
  { title: 'Teléfono', key: 'telefono' }, { title: 'Carrera', key: 'carrera_interes' }, 
  { title: 'Nota', key: 'notas_admin', align: 'center' }, { title: 'Visita', key: 'visita_industrial' }, 
  { title: 'Acciones', key: 'acciones' }
];

const abrirDialogo = (item = null) => {
    if (item) { edicionID.value = item.id; formItem.value = { ...item }; } 
    else { edicionID.value = null; formItem.value = { nombre: '', ap_paterno: '', ap_materno: '', localidad_origen: '', telefono: '', carrera_interes: 'T.S.U. Mantenimiento Industrial', visita_industrial: false, fecha_agenda: null, notas_admin: '', preinscrito: false, contactado: false }; }
    if(formRef.value) formRef.value.resetValidation();
    dialogoEditar.value = true;
};

const cerrarDialogo = () => { dialogoEditar.value = false; };

const guardarCambios = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    const telLimpio = formItem.value.telefono.replace(/\D/g, '');
    const duplicado = listaAlumnos.value.find(a => a.telefono === telLimpio && a.id !== edicionID.value);
    if (duplicado) return alert(`El número ${telLimpio} ya está registrado.`);
    formItem.value.telefono = telLimpio;

    try {
        if (edicionID.value) await api.put(`/admin/prospectos/${edicionID.value}`, formItem.value);
        else await api.post('/prospectos/', formItem.value);
        cerrarDialogo(); cargarTodo();
    } catch (e) { alert(e.response?.data?.detail || 'Error al guardar'); }
};

const confirmarBorrado = async (i) => { if (confirm('¿Eliminar del sistema?')) { try { await api.delete(`/admin/prospectos/${i.id}`); cargarTodo(); } catch (e) {} } };

const subirExcel = async () => {
    // 1. Verificamos que se haya seleccionado un archivo
    if (!archivoExcel.value) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    // 2. Extraemos el archivo real (Vuetify a veces lo envuelve en un Array)
    let archivo = archivoExcel.value;
    if (Array.isArray(archivoExcel.value)) {
        archivo = archivoExcel.value[0];
    }

    // 3. Verificamos que sea un archivo válido
    if (!(archivo instanceof File)) {
        alert("Ocurrió un error leyendo el archivo en el navegador.");
        return;
    }

    cargando.value = true;
    
    // 4. Preparamos los datos
    const fd = new FormData();
    fd.append('file', archivo); // 'file' es el nombre que espera FastAPI

    try {
        // 5. SOLUCIÓN INFALIBLE: Usamos fetch nativo en lugar de Axios para que no rompa el archivo
        const token = localStorage.getItem('token');
        
        // Asumimos que tu backend está en localhost:8000. 
        // Si tienes otro puerto, cámbialo aquí.
        const respuesta = await fetch('http://127.0.0.1:8000/admin/upload-excel', {
            method: 'POST',
            headers: {
                // Le pasamos el token de administrador para que nos deje entrar
                'Authorization': `Bearer ${token}`
                // OJO: ¡No ponemos Content-Type! El navegador debe generarlo solo con un código "boundary" secreto.
            },
            body: fd
        });

        // 6. Evaluamos la respuesta de FastAPI
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            console.error("Error del servidor:", errorData);
            throw new Error(errorData.detail || 'Error al procesar el archivo');
        }

        // Si todo sale bien:
        dialogExcel.value = false;
        archivoExcel.value = null; // Limpiamos la cajita
        cargarTodo(); // Recargamos la tabla
        alert('Carga masiva procesada con éxito. Revisa tu tabla.');

    } catch (error) {
        console.error("Falla en la subida:", error);
        alert(error.message || 'Error al subir el archivo. Verifica que tu servidor esté encendido.');
    } finally {
        cargando.value = false;
    }
};

const cerrarSesion = () => { localStorage.removeItem('token'); router.push('/login'); };

onMounted(() => { precargarLogos(); cargarTodo(); });
</script>

<style scoped>
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.day-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 6px; background-color: #f5f5f5; font-size: 0.85rem; font-weight: bold; color: #555; position: relative; }
.day-cell.empty { background: transparent; }
.day-cell.has-event { background-color: #E8F5E9; color: #1B5E20; cursor: pointer; border: 1px solid #A5D6A7; }
.day-cell.has-event:hover { background-color: #C8E6C9; }
.custom-dot { width: 6px; height: 6px; background-color: #00C853; border-radius: 50%; margin-top: 2px; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
.lh-1 { line-height: 1.1 !important; }
</style>