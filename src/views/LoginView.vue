<template>
  <v-container class="fill-height" fluid style="background-color: #263238;">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        
        <v-card class="elevation-12">
          <v-toolbar color="teal-darken-4" dark flat>
            <v-toolbar-title>Admin Mantenimiento UTXJ</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="iniciarSesion">
              
              <v-text-field
                v-model="credenciales.username"
                label="Usuario Administrativo"
                prepend-icon="mdi-account"
                type="text"
                variant="outlined"
                required
              ></v-text-field>

              <v-text-field
                v-model="credenciales.password"
                label="Contraseña"
                prepend-icon="mdi-lock"
                type="password"
                variant="outlined"
                required
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-3"
                density="compact"
              >
                {{ error }}
              </v-alert>

            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="teal-darken-4" 
              block 
              variant="elevated" 
              size="large"
              @click="iniciarSesion"
              :loading="cargando"
            >
              Entrar al Sistema
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Para redirigir al dashboard
import api from '../services/api';

const router = useRouter();

// Variables
const credenciales = ref({
  username: '',
  password: ''
});
const error = ref('');
const cargando = ref(false);

const iniciarSesion = async () => {
  error.value = '';
  cargando.value = true;

  try {
    // Preparamos los datos como formulario
    const params = new URLSearchParams();
    params.append('username', credenciales.value.username); // OJO: Debe ser 'username', no 'email'
    params.append('password', credenciales.value.password);

    // --- AQUÍ ESTÁ EL CAMBIO ---
    // Agregamos un tercer parámetro para sobrescribir el encabezado solo por esta vez
    const respuesta = await api.post('/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // Guardamos el token
    localStorage.setItem('token', respuesta.data.access_token);
    
    // Redirigimos
    router.push('/admin');

  } catch (err) {
    console.error("Error detallado:", err.response?.data); // Esto nos ayudará a ver más detalles si falla
    error.value = 'Usuario o contraseña incorrectos.';
  } finally {
    cargando.value = false;
  }
};
</script>