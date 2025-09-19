import { useThemes } from '../store/themes.store';

export function FullThemeDemo() {
  const { getCurrentTheme } = useThemes();
  const currentTheme = getCurrentTheme();

  if (!currentTheme) return null;

  return (
    <div className="bg-card rounded-xl p-6 border shadow-lg mb-4">
      <h1 className="text-3xl font-bold text-ink mb-2">
        🎨 Полная демонстрация темы
      </h1>
      <h2 className="text-xl font-semibold text-ink mb-4">
        Тема: {currentTheme.name}
      </h2>
      
      <div className="space-y-6">
        {/* Заголовки */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Заголовки</h3>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-ink">Заголовок H1</h1>
            <h2 className="text-xl font-semibold text-ink">Заголовок H2</h2>
            <h3 className="text-lg font-medium text-ink">Заголовок H3</h3>
            <h4 className="text-base font-medium text-ink">Заголовок H4</h4>
          </div>
        </section>

        {/* Текст */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Текст</h3>
          <div className="space-y-2">
            <p className="text-ink">
              Это обычный параграф текста. Он должен использовать цвет темы.
            </p>
            <p className="text-muted">
              Это приглушенный текст с меньшей непрозрачностью.
            </p>
            <span className="text-ink font-semibold">Жирный текст</span>
            <span className="text-ink ml-4 italic">Курсивный текст</span>
          </div>
        </section>

        {/* Кнопки */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Кнопки</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-mint text-white px-4 py-2 rounded-lg font-semibold">
              Основная кнопка
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
              Вторичная кнопка
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold">
              Акцентная кнопка
            </button>
            <button className="border border-mint text-mint px-4 py-2 rounded-lg font-semibold">
              Кнопка с границей
            </button>
          </div>
        </section>

        {/* Карточки */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Карточки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h4 className="text-ink font-semibold mb-2">Карточка 1</h4>
              <p className="text-ink text-sm">
                Содержимое карточки с текстом темы.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="text-ink font-semibold mb-2">Карточка 2</h4>
              <p className="text-ink text-sm">
                Еще одна карточка с применением темы.
              </p>
            </div>
          </div>
        </section>

        {/* Формы */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Формы</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-ink font-medium mb-1">
                Поле ввода
              </label>
              <input 
                type="text" 
                placeholder="Введите текст..."
                className="w-full px-3 py-2 border rounded-lg bg-white text-ink"
              />
            </div>
            <div>
              <label className="block text-ink font-medium mb-1">
                Текстовое поле
              </label>
              <textarea 
                placeholder="Введите длинный текст..."
                className="w-full px-3 py-2 border rounded-lg bg-white text-ink h-20"
              />
            </div>
          </div>
        </section>

        {/* Ссылки */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Ссылки</h3>
          <div className="space-y-2">
            <a href="#" className="text-mint hover:text-green-500">
              Основная ссылка
            </a>
            <br />
            <a href="#" className="text-green-500 hover:text-mint">
              Вторичная ссылка
            </a>
          </div>
        </section>

        {/* Цветовая палитра */}
        <section>
          <h3 className="text-lg font-bold text-ink mb-3">Цветовая палитра темы</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div 
                className="w-full h-16 rounded-lg mb-2"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <p className="text-xs text-ink font-medium">Основной</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-16 rounded-lg mb-2"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <p className="text-xs text-ink font-medium">Вторичный</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-16 rounded-lg mb-2"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
              <p className="text-xs text-ink font-medium">Акцентный</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-16 rounded-lg mb-2 border"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border
                }}
              />
              <p className="text-xs text-ink font-medium">Фон</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
