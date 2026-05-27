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

/** Minimal surface of the host's ``@/api`` ApiClient — promise-returning,
    already-parsed body. Each plugin types its store against this so the
    view can pass ``api`` from the host without TS complaints. */
interface ApiClientLike {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, body?: unknown, config?: unknown): Promise<T>;
}

export const useTossStore = defineStore('toss-admin', () => {
  const payments = ref<TossPayment[]>([]);
  const receipts = ref<TossCashReceipt[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPayments(api: ApiClientLike) {
    loading.value = true;
    error.value = null;
    try {
      const body = await api.get<{ payments: TossPayment[] }>('/api/v1/plugins/toss-payments/payments');
      payments.value = body.payments || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed';
    } finally {
      loading.value = false;
    }
  }

  async function fetchReceipts(api: ApiClientLike) {
    loading.value = true;
    try {
      const body = await api.get<{ receipts: TossCashReceipt[] }>('/api/v1/plugins/toss-payments/cash-receipts');
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
    api: ApiClientLike,
  ) {
    return api.post(`/api/v1/plugins/toss-payments/payments/${orderId}/refund`,
      amount !== null ? { amount } : {},);
  }

  return { payments, receipts, loading, error, fetchPayments, fetchReceipts, refund };
});
