import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface TossPayment {
  id: string;
  order_id: string;
  payment_key: string | null;
  method: string | null;
  amount: string;
  currency: string;
  status: string;
  last_provider_status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TossCashReceipt {
  id: string;
  receipt_id: string | null;
  payment_key: string;
  identifier_type: string;
  identifier_hash: string;
  receipt_type: string;
  status: string;
  issued_at: string | null;
}

export const useTossStore = defineStore('toss-admin', () => {
  const payments = ref<TossPayment[]>([]);
  const receipts = ref<TossCashReceipt[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPayments(api: { get: typeof fetch }) {
    loading.value = true;
    error.value = null;
    try {
      const resp = await api.get('/api/v1/plugins/toss-payments/payments');
      const body = await resp.json();
      payments.value = body.payments || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed';
    } finally {
      loading.value = false;
    }
  }

  async function fetchReceipts(api: { get: typeof fetch }) {
    loading.value = true;
    try {
      const resp = await api.get('/api/v1/plugins/toss-payments/cash-receipts');
      const body = await resp.json();
      receipts.value = body.receipts || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed';
    } finally {
      loading.value = false;
    }
  }

  async function refund(
    orderId: string,
    amount: number | null,
    api: {
      post: (url: string, body: unknown) => Promise<Response>;
    },
  ) {
    const resp = await api.post(
      `/api/v1/plugins/toss-payments/payments/${orderId}/refund`,
      amount !== null ? { amount } : {},
    );
    if (!resp.ok) throw new Error(`refund failed: ${resp.status}`);
    return resp.json();
  }

  return { payments, receipts, loading, error, fetchPayments, fetchReceipts, refund };
});
