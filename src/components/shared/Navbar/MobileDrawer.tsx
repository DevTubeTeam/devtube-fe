import { Button, Drawer } from 'antd';
import { useState } from 'react';

type MobileDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({ visible, onClose }) => {
  const [menuItems] = useState([
    { label: 'Home', key: 'home' },
    { label: 'About', key: 'about' },
    { label: 'Contact', key: 'contact' },
  ]);

  return (
    <Drawer
      title="Menu"
      placement="left"
      onClose={onClose}
      visible={visible}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-4">
        <ul className="space-y-4">
          {menuItems.map(item => (
            <li key={item.key} className="text-lg font-medium">
              <Button type="link" block onClick={onClose}>
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;
