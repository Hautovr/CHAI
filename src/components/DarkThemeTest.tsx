import { useThemes } from '../store/themes.store';

export function DarkThemeTest() {
  const { themes, currentThemeId, setCurrentTheme } = useThemes();
  
  const darkThemes = themes.filter(theme => 
    theme.id === 'dark' || theme.id === 'neon'
  );

  return (
    <div className="bg-card rounded-xl p-6 border shadow-lg mb-4">
      <h2 className="text-2xl font-bold text-ink mb-4">
        🌙 Тест темных тем
      </h2>
      
      <div className="mb-6">
        <p className="text-ink mb-4">
          Проверьте, как отображаются темная и неон темы:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {darkThemes.map((theme) => (
            <div key={theme.id} className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-ink mb-2">
                  {theme.name}
                </h3>
                <button
                  onClick={() => {
                    console.log('🌙 Switching to dark theme:', theme.id);
                    setCurrentTheme(theme.id);
                  }}
                  className={`w-full p-3 rounded-lg font-semibold transition-all ${
                    currentThemeId === theme.id
                      ? 'bg-mint text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Применить {theme.name}
                </button>
              </div>
              
              {/* Превью темы */}
              <div 
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border
                }}
              >
                <div 
                  className="text-sm font-semibold mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Превью {theme.name}
                </div>
                
                <div className="space-y-2">
                  <div 
                    className="p-2 rounded text-white text-xs font-semibold"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Основной цвет: {theme.colors.primary}
                  </div>
                  
                  <div 
                    className="p-2 rounded text-white text-xs font-semibold"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    Вторичный: {theme.colors.secondary}
                  </div>
                  
                  <div 
                    className="p-2 rounded text-white text-xs font-semibold"
                    style={{ backgroundColor: theme.colors.accent }}
                  >
                    Акцентный: {theme.colors.accent}
                  </div>
                  
                  <div 
                    className="p-2 rounded text-xs font-semibold border"
                    style={{ 
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }}
                  >
                    Карточка: {theme.colors.card}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Демонстрация элементов в текущей теме */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">
          Элементы в текущей теме ({themes.find(t => t.id === currentThemeId)?.name}):
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <h4 className="text-ink font-semibold mb-2">Карточка</h4>
            <p className="text-ink text-sm mb-3">
              Это карточка с текстом темы
            </p>
            <button className="bg-mint text-white px-3 py-1 rounded text-sm">
              Кнопка
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-ink font-semibold mb-2">Белая карточка</h4>
            <p className="text-ink text-sm mb-3">
              Карточка с белым фоном
            </p>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              Зеленая кнопка
            </button>
          </div>
          
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--theme-background)' }}>
            <h4 className="text-ink font-semibold mb-2">Фон темы</h4>
            <p className="text-ink text-sm mb-3">
              Карточка с фоном темы
            </p>
            <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm">
              Фиолетовая кнопка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
