<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class=" mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
       
        <div v-html="terms.content"></div>

        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { termConditionService ,notificationService } from '@/services/_singletons';
const terms:any = ref('');

onMounted(async () => {
  await handleSubmitTerms();
});
const handleSubmitTerms = async () => {
  try {
   
    const res: any = await termConditionService.showTermCondition();
    terms.value = res.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 422) {
      notificationService.showError(e.response.data.message);
      return;
    }
    if (e instanceof AxiosError && e.response?.status === 401) {
      notificationService.showError(e.response.data.message);
    } 
  }
}
</script>
