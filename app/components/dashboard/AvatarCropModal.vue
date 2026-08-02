<script setup lang="ts">
import { ref } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import Button from '~/components/forms/Button.vue';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  show: boolean;
  imageUrl: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [blob: Blob];
}>();

const cropperRef = ref<any>(null);
const isProcessing = ref(false);

const handleConfirm = async () => {
  if (!cropperRef.value) return;
  
  isProcessing.value = true;
  
  try {
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          emit('confirm', blob);
        }
        isProcessing.value = false;
      }, 'image/jpeg', 0.9);
    }
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    isProcessing.value = false;
  }
};

const handleClose = () => {
  if (!isProcessing.value) {
    emit('close');
  }
};
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-75 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-surface-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Ajustar Foto de Perfil
        </h3>
        <button
          type="button"
          @click="handleClose"
          :disabled="isProcessing"
          aria-label="Fechar modal de ajuste da foto"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-it-primary dark:hover:bg-surface-700 dark:hover:text-gray-200 disabled:opacity-50"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cropper Area -->
      <div class="p-6">
        <div class="bg-gray-100 dark:bg-surface-900 rounded-lg overflow-hidden" style="height: 500px;">
          <Cropper
            ref="cropperRef"
            :src="imageUrl"
            :stencil-component="CircleStencil"
            :stencil-props="{
              aspectRatio: 1,
            }"
            class="cropper"
            :canvas="{
              maxWidth: 512,
              maxHeight: 512,
            }"
          />
        </div>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Arraste e redimensione a área para selecionar a foto de perfil
        </p>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-surface-700">
        <Button
          label="Cancelar"
          @click="handleClose"
          variant="danger"
          :disabled="isProcessing"
          size="sm"
        />
        <Button
          label="Confirmar"
          @click="handleConfirm"
          :loading="isProcessing"
          size="sm"
          :disabled="isProcessing"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cropper {
  height: 100%;
  width: 100%;
}

:deep(.vue-advanced-cropper__background),
:deep(.vue-advanced-cropper__foreground) {
  background: #f3f4f6;
}

:deep(.vue-advanced-cropper__stretcher) {
  background: transparent;
}
</style>
