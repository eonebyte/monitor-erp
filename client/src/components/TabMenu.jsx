import  { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Tabs, ConfigProvider } from 'antd';
import { QuestionCircleOutlined, HomeOutlined, ContactsOutlined, DollarOutlined, FileDoneOutlined, CalendarOutlined } from '@ant-design/icons';
import LayoutAdmin from "../layouts/LayoutAdmin";
import { TabPaneWrapper } from './TabPaneWrapper';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { ContactDetail } from '../pages/ContactDetail';
import { SalesRevenue } from '../pages/sales/SalesRevenue';
import { SalesRevenueByDelivery } from '../pages/sales/SalesRevenueByDelivery';
import SalesOrderTable from '../components/sales/tables/SalesOrderTable';
import GLJournal from '../pages/accounting/GLJournal';
import SummaryAccount from '../pages/accounting/SummaryAccount';
import VendorDueDate from '../pages/purchase/VendorDueDate';
import { SalesInvoice } from '../pages/sales/SalesInvoice';
import { PurchaseInvoice } from '../pages/purchase/PurchaseInvoice';

// Data untuk item menu dropdown
const menuItems = [
  {
    key: '1',
    label: 'About',
    component: About, // Misalnya Home untuk keperluan ini, ganti dengan komponen yang sesuai
    icon: <QuestionCircleOutlined />,
  },
  {
    key: '2',
    label: 'Contact',
    children: [
      {
        key: '2-1',
        label: 'List Contact',
        component: Contact, // Misalnya Home untuk keperluan ini, ganti dengan komponen yang sesuai
        icon: <ContactsOutlined />
      },
      {
        key: '2-2',
        label: 'Contact Detail',
        component: ContactDetail, // Misalnya Home untuk keperluan ini, ganti dengan komponen yang sesuai
        icon: <ContactsOutlined />
      },
    ],
  },
  {
    key: '4',
    label: 'Sales',
    children: [
      {
        key: '4-4',
        label: 'Sales Order',
        component: SalesOrderTable,
        icon: <FileDoneOutlined />
      },
      {
        key: '4-5',
        label: 'Sales Invoice',
        component: SalesInvoice,
        icon: <FileDoneOutlined />
      },
      {
      key: '4-6',
      label: 'Sales Revenue',
      component: SalesRevenue,
      icon: <DollarOutlined />
    },
    {
      key: '4-7',
      label: 'Sales Revenue By Delivery',
      component: SalesRevenueByDelivery,
      icon: <DollarOutlined />
    },
    ]
  },
  {
    key: '5',
    label: 'Accounting',
    children: [
      {
        key: '5-1',
        label: 'GL Journal',
        component: GLJournal,
        icon: <FileDoneOutlined />
      },
      {
        key: '5-2',
        label: 'Summary Account',
        component: SummaryAccount,
        icon: <FileDoneOutlined />
      }
    ]
  },
  {
    key: '6',
    label: 'Purchase',
    children: [
      {
        key: '6-1',
        label: 'Purchase Invoice',
        component: PurchaseInvoice,
        icon: <FileDoneOutlined />
      },
      {
        key: '6-2',
        label: 'Vendor Due Date',
        component: VendorDueDate,
        icon: <CalendarOutlined />
      },
    ]
  }
];

export function TabMenu() {
  // Fungsi untuk menangani klik menu
  const handleMenuClick = (key, params = {}) => {
    const selectedItem = findMenuItemByKey(menuItems, key);
    if (selectedItem) {
      // Format label based on parameters
      const formattedLabel = params.contactNumber
        ? `${selectedItem.label}: ${params.contactNumber}`
        : selectedItem.label;

      const tabKey = params.contactNumber
        ? `${key}-${params.contactNumber}-${new Date().getTime()}`
        : `${key}-${new Date().getTime()}`;

      addTab(tabKey, formattedLabel, selectedItem.component, params, selectedItem.icon);
    }
  };

  const [activeTabs, setActiveTabs] = useState([
    {
      key: "home",
      label: "Home",
      children: <TabPaneWrapper><Home onNavigate={handleMenuClick} /></TabPaneWrapper>,
      closable: false,
      icon: <HomeOutlined />
    }
  ]);

  const [activeKey, setActiveKey] = useState("home");

  // Fungsi untuk menambahkan tab baru
  const addTab = (key, label, Component, params, icon) => {
    setActiveTabs(prevTabs => {
      // Tambahkan tab baru ke dalam array
      const newTabs = [
        ...prevTabs,
        {
          key,
          label,
          children: <TabPaneWrapper><Component {...params} /></TabPaneWrapper>,
          closable: true,
          icon,
        }
      ];
      return newTabs;
    });
    setActiveKey(key); // Set tab yang baru ditambahkan sebagai tab aktif
  };

  // Fungsi untuk menghapus tab
  const removeTab = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex;
    activeTabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newTabs = activeTabs.filter(tab => tab.key !== targetKey);
    if (newTabs.length && newActiveKey === targetKey) {
      newActiveKey = newTabs[lastIndex >= 0 ? lastIndex : 0].key;
    }
    setActiveTabs(newTabs);
    setActiveKey(newActiveKey);
  };

  // Fungsi rekursif untuk mencari item menu berdasarkan kunci
  const findMenuItemByKey = (data, key) => {
    for (const item of data) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findMenuItemByKey(item.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    // Fungsi untuk menampilkan alert sebelum refresh
    const handleBeforeUnload = (event) => {
      // Cek jika tab selain Home terbuka
      if (activeTabs.length > 1 && activeKey !== "home") {
        // Pesan yang akan ditampilkan pada alert
        const message = 'Ada tab terbuka selain Home. Apakah Anda yakin ingin meninggalkan halaman ini?';
        event.preventDefault(); // Mencegah tindakan default
        event.returnValue = message; // Set pesan untuk browser (beberapa browser mungkin tidak menampilkan pesan ini)
        return message;
      }
    };

    // Menambahkan event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Membersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTabs, activeKey]);


  return (
    <ConfigProvider>
      <LayoutAdmin onMenuClick={handleMenuClick}>
        <div>
          <Tabs
            hideAdd
            activeKey={activeKey}
            onChange={setActiveKey}
            type="editable-card"
            onEdit={(targetKey, action) => {
              if (action === 'remove') removeTab(targetKey);
            }}
            className="custom-tabs"
            items={activeTabs}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </LayoutAdmin>
    </ConfigProvider>
  );
}
