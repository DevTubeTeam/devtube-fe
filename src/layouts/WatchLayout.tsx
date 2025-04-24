import { Outlet } from 'react-router-dom';

type Props = {};

export const WatchLayout = (props: Props) => {
  return (
    <div>
      <h1>WatchLayout</h1>
      <Outlet />
    </div>
  );
};
  