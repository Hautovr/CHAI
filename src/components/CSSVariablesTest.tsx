import { useEffect, useState } from 'react';

export function CSSVariablesTest() {
  const [variables, setVariables] = useState<any>({});

  useEffect(() => {
    const updateVariables = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      setVariables({
        primary: computedStyle.getPropertyValue('--theme-primary').trim(),
        secondary: computedStyle.getPropertyValue('--theme-secondary').trim(),
        accent: computedStyle.getPropertyValue('--theme-accent').trim(),
        background: computedStyle.getPropertyValue('--theme-background').trim(),
        text: computedStyle.getPropertyValue('--theme-text').trim(),
        card: computedStyle.getPropertyValue('--theme-card').trim(),
        border: computedStyle.getPropertyValue('--theme-border').trim()
      });
    };

    updateVariables();
    
    // Обновляем каждую секунду
    const interval = setInterval(updateVariables, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-card rounded-lg border mb-4">
      <h3 className="text-lg font-bold text-ink mb-4">🔍 CSS переменные</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold text-ink mb-1">Primary:</div>
          <div 
            className="p-2 rounded text-white text-xs font-mono"
            style={{ backgroundColor: variables.primary || '#3B82F6' }}
          >
            {variables.primary || 'не установлено'}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-ink mb-1">Secondary:</div>
          <div 
            className="p-2 rounded text-white text-xs font-mono"
            style={{ backgroundColor: variables.secondary || '#10B981' }}
          >
            {variables.secondary || 'не установлено'}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-ink mb-1">Accent:</div>
          <div 
            className="p-2 rounded text-white text-xs font-mono"
            style={{ backgroundColor: variables.accent || '#8B5CF6' }}
          >
            {variables.accent || 'не установлено'}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-ink mb-1">Background:</div>
          <div 
            className="p-2 rounded text-xs font-mono border"
            style={{ 
              backgroundColor: variables.background || '#F8FAFC',
              color: variables.text || '#1F2937',
              borderColor: variables.border || '#E5E7EB'
            }}
          >
            {variables.background || 'не установлено'}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Эти значения обновляются каждую секунду. Если они не меняются при смене темы, значит CSS переменные не применяются.
        </p>
      </div>
    </div>
  );
}
