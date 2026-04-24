import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';

export const tossPaymentsAdminPlugin: IPlugin = {
  name: 'toss-payments-admin',
  version: '1.0.0',
  description: 'Toss Payments admin — payments list, refunds, cash-receipts',

  install(sdk: IPlatformSDK) {
    sdk.addRoute({
      path: 'toss/payments',
      name: 'toss-payments',
      component: () => import('./src/views/TossPayments.vue'),
      meta: { requiredPermission: 'payments.configure' },
    });
    sdk.addRoute({
      path: 'toss/cash-receipts',
      name: 'toss-cash-receipts',
      component: () => import('./src/views/TossCashReceipts.vue'),
      meta: { requiredPermission: 'payments.configure' },
    });
  },

  activate() {},
  deactivate() {},
};
