<template>
  <div class="toss-admin">
    <header>
      <h2>{{ $t('tossAdmin.payments.title') }}</h2>
    </header>
    <div v-if="loading">
      {{ $t('tossAdmin.payments.loading') }}
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <table
      v-else-if="payments.length > 0"
      class="txtable"
    >
      <thead>
        <tr>
          <th>{{ $t('tossAdmin.payments.orderId') }}</th>
          <th>{{ $t('tossAdmin.payments.amount') }}</th>
          <th>{{ $t('tossAdmin.payments.method') }}</th>
          <th>{{ $t('tossAdmin.payments.status') }}</th>
          <th>{{ $t('tossAdmin.payments.paymentKey') }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in payments"
          :key="p.id"
        >
          <td>{{ p.order_id }}</td>
          <td>{{ p.amount }} {{ p.currency }}</td>
          <td>{{ p.method || '—' }}</td>
          <td>
            <span :class="['status', `status--${p.status}`]">{{ p.status }}</span>
          </td>
          <td>{{ p.payment_key || '—' }}</td>
          <td>
            <button
              v-if="p.status === 'completed'"
              class="btn btn--refund"
              @click="onRefund(p)"
            >
              {{ $t('tossAdmin.payments.refund') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      {{ $t('tossAdmin.payments.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTossStore, type TossPayment } from '../stores/tossPayments';
import { api } from '@/api';

const store = useTossStore();
const { payments, loading, error } = storeToRefs(store);

onMounted(() => store.fetchPayments(api));

async function onRefund(p: TossPayment) {
  try {
    await store.refund(p.order_id, null, api);
    await store.fetchPayments(api);
  } catch (e) {
    window.alert(e instanceof Error ? e.message : 'refund failed');
  }
}
</script>

<style scoped>
.toss-admin { padding: 1.5rem; }
.txtable { width: 100%; border-collapse: collapse; }
.txtable th, .txtable td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vbwd-color-border, #e5e5e5);
  text-align: left;
}
.status--completed { color: var(--vbwd-color-success, #2a7); }
.status--failed,
.status--cancelled { color: var(--vbwd-color-danger, #b22); }
</style>
