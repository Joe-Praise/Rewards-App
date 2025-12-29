export interface ReferralLinkCardProps {
  pointsPerReferral?: number;
  onShare?: (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => void;
}