import { Switch } from './ui/switch';

interface SettingsProps {
  hideScores: boolean;
  onHideScoresChange: (value: boolean) => void;
}

export function Settings({ hideScores, onHideScoresChange }: SettingsProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24">
      <div className="pt-6">
        <h1 className="font-['Barlow:Bold',sans-serif] text-[28px] text-white mb-6">
          Settings
        </h1>

        <div className="space-y-4">
          {/* Hide Scores Setting */}
          <div className="bg-[#1c1c1e] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-['Barlow:SemiBold',sans-serif] text-[16px] text-white mb-1">
                  Hide Scores
                </h3>
                <p className="font-['Barlow:Regular',sans-serif] text-[13px] text-[#8e8e93]">
                  Hide final scores and live game scores to avoid spoilers
                </p>
              </div>
              <Switch
                checked={hideScores}
                onCheckedChange={onHideScoresChange}
                className="ml-4"
              />
            </div>
          </div>

          {/* App Info */}
          <div className="mt-8 pt-6 border-t border-[#2c2c2e]">
            <h2 className="font-['Barlow:Bold',sans-serif] text-[20px] text-white mb-4">
              About
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-['Barlow:Regular',sans-serif] text-[14px] text-[#8e8e93]">
                  Version
                </span>
                <span className="font-['Barlow:Medium',sans-serif] text-[14px] text-white">
                  1.0.0
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Barlow:Regular',sans-serif] text-[14px] text-[#8e8e93]">
                  Data Source
                </span>
                <span className="font-['Barlow:Medium',sans-serif] text-[14px] text-white">
                  ESPN API
                </span>
              </div>
            </div>
          </div>

          {/* Additional Settings Placeholder */}
          <div className="mt-6">
            <p className="font-['Barlow:Regular',sans-serif] text-[12px] text-[#636366] text-center">
              More settings coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
