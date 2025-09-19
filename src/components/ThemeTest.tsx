import { useThemes } from '../store/themes.store';

export function ThemeTest() {
  const { themes, currentThemeId, setCurrentTheme } = useThemes();

  return (
    <div className="p-4 bg-card rounded-lg border mb-4">
      <h3 className="text-lg font-bold text-ink mb-4">🧪 Тест тем</h3>
      
      <div className="mb-4">
        <p className="text-sm text-ink mb-2">
          Текущая тема: <strong>{currentThemeId}</strong>
        </p>
        <p className="text-sm text-ink mb-2">
          Всего тем: <strong>{themes.length}</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              console.log('🧪 Test: Switching to theme:', theme.id);
              setCurrentTheme(theme.id);
            }}
            className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
              currentThemeId === theme.id
                ? 'bg-mint text-white border-mint'
                : 'bg-card text-ink border-gray-300 hover:bg-gray-100'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => {
            console.log('🧪 Force applying default theme');
            setCurrentTheme('default');
          }}
          className="w-full p-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          Принудительно применить тему "Классический"
        </button>
        
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Проверьте консоль браузера для логов применения тем
          </p>
        </div>
      </div>
    </div>
  );
}
