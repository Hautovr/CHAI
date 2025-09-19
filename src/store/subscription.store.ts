import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  expiresAt?: Date;
  isActive: boolean;
  features: string[];
  paymentMethod?: 'stars' | 'card';
  starsAmount?: number;
}

export interface SubscriptionState {
  subscription: Subscription;
  setSubscription: (subscription: Partial<Subscription>) => void;
  checkSubscriptionStatus: () => void;
  upgradeToPremium: (paymentMethod?: 'stars' | 'card') => void;
  upgradeWithStars: (starsAmount: number) => void;
  downgradeToFree: () => void;
  hasFeature: (feature: string) => boolean;
  getPremiumPrice: () => { stars: number };
}

const defaultSubscription: Subscription = {
  tier: 'free',
  status: 'active',
  isActive: true,
  features: [
    'basic_tracking',
    'basic_stats',
    'basic_achievements',
    'basic_notifications'
  ]
};

export const useSubscription = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: defaultSubscription,

      setSubscription: (updates) => {
        set((state) => ({
          subscription: { ...state.subscription, ...updates }
        }));
      },

      checkSubscriptionStatus: () => {
        const { subscription } = get();
        
        if (subscription.status === 'active' && subscription.expiresAt) {
          const now = new Date();
          const expireDate = new Date(subscription.expiresAt);
          
          if (now > expireDate) {
            set((state) => ({
              subscription: {
                ...state.subscription,
                status: 'expired',
                tier: 'free',
                isActive: false,
                features: defaultSubscription.features
              }
            }));
          }
        }
      },

      upgradeToPremium: (paymentMethod = 'stars') => {
        // Эта функция теперь только для демонстрации
        // Реальная оплата должна происходить через StarsPayment компонент
        console.warn('upgradeToPremium called without payment - this should not happen');
        return false;
      },

      upgradeWithStars: (starsAmount: number) => {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 месяц подписки

        set((state) => ({
          subscription: {
            ...state.subscription,
            tier: 'premium',
            status: 'active',
            expiresAt,
            isActive: true,
            paymentMethod: 'stars',
            starsAmount,
            features: [
              'basic_tracking',
              'basic_stats',
              'basic_achievements',
              'basic_notifications',
              'advanced_analytics',
              'export_data',
              'smart_notifications',
              'custom_themes',
              'cloud_sync',
              'priority_support'
            ]
          }
        }));
      },

      downgradeToFree: () => {
        set((state) => ({
          subscription: {
            ...state.subscription,
            tier: 'free',
            status: 'active',
            isActive: true,
            features: defaultSubscription.features
          }
        }));
      },

      hasFeature: (feature: string) => {
        const { subscription } = get();
        return subscription.features.includes(feature);
      },


      getPremiumPrice: () => {
        return {
          stars: 99 // 99 звезд за месяц
        };
      },

      // Функция для сброса подписки (только для тестирования)
      resetSubscription: () => {
        set(() => ({
          subscription: defaultSubscription
        }));
      }
    }),
    {
      name: 'subscription-storage',
    }
  )
);
