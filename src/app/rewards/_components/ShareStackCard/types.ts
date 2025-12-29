export interface ShareStackCardProps {
  pointsReward: number;
  onShare?: () => void;
}

export interface ShareStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  userHasStack?: boolean;
}