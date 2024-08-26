import { Buy, Sell, Product, Report, Supplier, Service,  } from '../../pages';
// Icons
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

const publicRoutes = [
  { path: '/sell', component: Sell, name: 'Phiếu bán', icon: SellRoundedIcon },
  { path: '/buy', component: Buy, name: 'Phiếu mua', icon: ShoppingCartRoundedIcon },
  { path: '/service', component: Service, name: 'Phiếu dịch vụ', icon: BusinessCenterRoundedIcon },
  { path: '/product', component: Product, name: 'Sản phẩm', icon: LocalMallRoundedIcon },
  { path: '/supplier', component: Supplier, name: 'Nhà cung cấp', icon: Groups2RoundedIcon },
  { path: '/report', component: Report, name: 'Báo cáo', icon: AssessmentRoundedIcon },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
