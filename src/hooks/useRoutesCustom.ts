import { appRoutes } from '@/routes';
import { useRoutes } from 'react-router-dom';

export const useRoutesCustom = () => {
  const element = useRoutes(appRoutes);
  return element;
};
