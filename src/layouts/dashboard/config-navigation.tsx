import Image from 'next/image';
import { useMemo } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import AdjustIcon from '@mui/icons-material/Adjust';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: ' ',
        items: [
          { title: 'Build', path: paths.dashboard.build, icon: <SearchIcon /> },
          { title: 'Monitor', path: paths.dashboard.monitor, icon: <MonitorHeartIcon /> },
          {
            title: 'Research',
            path: paths.dashboard.research,
            icon: <AdjustIcon />,
            info: <Image width={20} height={20} alt='pro' src="/assets/icons/pro.png" />
          },
          {
            title: 'Watchlists',
            path: paths.dashboard.watchlists,
            icon: <LibraryBooksIcon />,
            info: <Image width={20} height={20} alt='pro' src="/assets/icons/pro.png" />
          },
        ],
      },
    ],
    []
  );

  return data;
}
