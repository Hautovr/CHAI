import { motion } from 'framer-motion';
import { Headphones, MessageCircle, Mail, Phone, Clock, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubscription } from '../store/subscription.store';
import { useState } from 'react';

export function PrioritySupport() {
  const { hasFeature } = useSubscription();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hasFeature('priority_support')) {
    return null;
  }

  const contactMethods = [
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Мгновенные ответы в чате',
      icon: MessageCircle,
      responseTime: '5-15 минут',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Подробные ответы на вопросы',
      icon: Mail,
      responseTime: '1-2 часа',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'phone',
      name: 'Телефон',
      description: 'Прямое общение с поддержкой',
      icon: Phone,
      responseTime: 'Немедленно',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const handleContact = async (method: string) => {
    setSelectedContact(method);
    setIsSubmitting(true);

    // Симуляция отправки запроса
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setMessage('');
  };

  const handleSubmitMessage = async () => {
    if (!message.trim() || !selectedContact) return;

    setIsSubmitting(true);

    // Симуляция отправки сообщения
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setMessage('');
    setSelectedContact(null);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <Headphones className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-orange-800 dark:text-orange-300">
            🎧 Приоритетная поддержка
          </h2>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Быстрые ответы и помощь
          </p>
        </div>
      </div>

      {/* Статус поддержки */}
      <motion.div
        className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-orange-200 dark:border-orange-700/50 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Поддержка онлайн
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Специалисты доступны 24/7
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-orange-600 dark:text-orange-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Среднее время ответа: 5 минут</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>Рейтинг: 4.9/5</span>
          </div>
        </div>
      </motion.div>

      {/* Способы связи */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          const isSelected = selectedContact === method.id;
          
          return (
            <motion.button
              key={method.id}
              onClick={() => handleContact(method.id)}
              disabled={isSubmitting}
              className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-orange-500 shadow-lg scale-105' 
                  : 'border-orange-200 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600/50'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              whileHover={isSubmitting ? {} : { scale: 1.05, y: -2 }}
              whileTap={isSubmitting ? {} : { scale: 0.95 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${method.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${method.textColor}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-300">
                    {method.name}
                  </h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {method.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Ответ: {method.responseTime}
                </div>
                {isSelected && (
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Форма сообщения */}
      {selectedContact && (
        <motion.div
          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-orange-200 dark:border-orange-700/50 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Отправить сообщение
            </span>
          </div>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Опишите вашу проблему или вопрос..."
            className="w-full h-24 p-3 rounded-lg border border-orange-200 dark:border-orange-700/50 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {message.length}/500 символов
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отмена
              </motion.button>
              <motion.button
                onClick={handleSubmitMessage}
                disabled={!message.trim() || isSubmitting}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                  !message.trim() || isSubmitting
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
                whileHover={!message.trim() || isSubmitting ? {} : { scale: 1.05 }}
                whileTap={!message.trim() || isSubmitting ? {} : { scale: 0.95 }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ */}
      <motion.div
        className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-4 border border-orange-300 dark:border-orange-600/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">
            Частые вопросы
          </span>
        </div>
        <div className="space-y-2 text-xs text-orange-700 dark:text-orange-400">
          <div>• Как восстановить данные после сброса?</div>
          <div>• Почему не синхронизируются данные?</div>
          <div>• Как изменить цель на день?</div>
          <div>• Где найти резервную копию?</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
