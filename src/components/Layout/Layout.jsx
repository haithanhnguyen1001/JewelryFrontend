import Navigator from '../Navigator/Navigator';
import Router from '../Router/Router';
import './layout.css';
import { CssBaseline } from '@mui/material';

const Layout = () => {
  return (
    <>
      {/* Form selector */}
      <CssBaseline />
      <section className="website-wrapper">
        <Navigator />

        <div className="main-section">
          <div className="content">
            <Router />
          </div>
        </div>
      </section>
    </>
  );
};

export default Layout;
