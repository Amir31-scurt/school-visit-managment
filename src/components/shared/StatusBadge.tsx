import { RequestStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { useTranslation } from '../../i18n';

export const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const { t } = useTranslation();
  
  const variantMap: Record<RequestStatus, 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  };

  return <Badge variant={variantMap[status]}>{t(`status.${status}` as any)}</Badge>;
};
