import React from 'react';
import Container from 'react-bootstrap/Container';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Header } from '../skeleton/Header/Header';
import { Footer } from '../skeleton/Footer/Footer';
import { FullScreenSpinner } from '../controls/controls/Spinner';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { clearSnackbar } from '../../reducers/configReducer';

import './App.css';

export const App = ({Component}: {Component: any}) => {
  const config = useTtcSelector(state => state.config);
  const dispatch = useTtcDispatch();
  if (!config.initialLoadCompleted) {
    return <FullScreenSpinner />;
  }

  const containerStyle: React.CSSProperties = {width: undefined};
  const isBigTodayMatches = config.settings.container100PerWidth;
  if (isBigTodayMatches) {
    containerStyle.width = '100%';
  }

  return (
    <div id="react">
      <ThemeProvider theme={createTheme()}>
        <div style={{height: '100%'}}>
          <div className="wrapper">
            <Header />
            <Container style={containerStyle}>
              <Component />
            </Container>
            <div className="push" />
          </div>
          {!isBigTodayMatches ? <Footer /> : null}
          <Snackbar
            open={!!config.snackbar}
            message={config.snackbar}
            autoHideDuration={3000}
            onClose={() => dispatch(clearSnackbar())}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => dispatch(clearSnackbar())}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          />
        </div>
      </ThemeProvider>
    </div>
  );
};
