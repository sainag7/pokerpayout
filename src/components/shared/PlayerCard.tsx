import type { Player } from '../../types/game';
import { getTotalBuyIn } from '../../utils/calculations';

const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663'];

interface PlayerCardProps {
  player: Player;
  index: number;
  children?: React.ReactNode;
}

export function PlayerCard({ player, index, children }: PlayerCardProps) {
  const suit = SUITS[index % 4];
  const suitColor = index % 4 === 1 || index % 4 === 2 ? 'text-loss/30' : 'text-text-secondary/20';
  const totalBuyIn = getTotalBuyIn(player);

  return (
    <div className="bg-surface rounded-xl border border-gold/15 p-4 relative overflow-hidden animate-fade-in">
      <span
        className={`absolute top-2 right-3 text-2xl ${suitColor} pointer-events-none select-none`}
        aria-hidden="true"
      >
        {suit}
      </span>

      <div className="flex items-center gap-3 mb-1">
        <h3 className="font-semibold text-text-primary text-lg">{player.name}</h3>
        {player.isBanker && (
          <span className="bg-gold text-felt-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Banker
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary">
        Buy-in: ${totalBuyIn.toFixed(2)}
        {player.buyIns.length > 1 && (
          <span className="text-text-secondary/60 ml-1">
            ({player.buyIns.length} buy-ins)
          </span>
        )}
      </p>

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
