<template>
  <div class="toss-receipts">
    <header><h2>{{ $t('tossAdmin.receipts.title') }}</h2></header>
    <div v-if="loading">
      {{ $t('tossAdmin.receipts.loading') }}
    </div>
    <table
      v-else-if="receipts.length > 0"
      class="txtable"
    >
      <thead>
        <tr>
          <th>{{ $t('tossAdmin.receipts.receiptId') }}</th>
          <th>{{ $t('tossAdmin.receipts.paymentKey') }}</th>
          <th>{{ $t('tossAdmin.receipts.type') }}</th>
          <th>{{ $t('tossAdmin.receipts.identifierType') }}</th>
          <th>{{ $t('tossAdmin.receipts.status') }}</th>
          <th>{{ $t('tossAdmin.receipts.issuedAt') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in receipts"
          :key="r.id"
        >
          <td>{{ r.receipt_id || '—' }}</td>
          <td>{{ r.payment_key }}</td>
          <td>{{ r.receipt_type }}</td>
          <td>{{ r.identifier_type }}</td>
          <td>{{ r.status }}</td>
          <td>{{ formatDate(r.issued_at) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      {{ $t('tossAdmin.receipts.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, storeToRefs } from 'vue';
import { useTossStore } from '../stores/tossPayments';
import { api } from '@/api';

const store = useTossStore();
const { receipts, loading } = storeToRefs(store);

onMounted(() => store.fetchReceipts(api));

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}
</script>

<style scoped>
.toss-receipts { padding: 1.5rem; }
.txtable { width: 100%; border-collapse: collapse; }
.txtable th, .txtable td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vbwd-color-border, #e5e5e5);
  text-align: left;
}
</style>
