import { BarChart3, TrendingUp, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'scores' | 'standings' | 'settings';
  onTabChange: (tab: 'scores' | 'standings' | 'settings') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'scores' as const, label: 'Scores', icon: BarChart3 },
    { id: 'standings' as const, label: 'Standings', icon: TrendingUp },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#2c2c2e] z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-[393px] mx-auto flex items-center justify-around h-[60px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 cursor-pointer bg-transparent border-none transition-all"
            >
              <Icon 
                className={`size-5 ${isActive ? 'text-white' : 'text-[#8e8e93]'}`}
                strokeWidth={2}
              />
              <span 
                className={`text-[10px] font-['SF_Pro:Medium',sans-serif] ${
                  isActive ? 'text-white' : 'text-[#8e8e93]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
