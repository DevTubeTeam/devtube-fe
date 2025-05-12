import { appRoutes } from '@/routes';
import { useRoutes } from 'react-router-dom';

export const useRoutesCustom = () => useRoutes(appRoutes);
