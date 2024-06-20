'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Table, Stack, Dialog, TableRow, Container, TableHead, TableCell, TableBody, Typography, ButtonBase, Skeleton as defaultSkeleton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingCubeScreen } from 'src/components/loading-screen';

import ChartBox from './chart-box';
import SignInBox from './signin-box';
import MessageInput from './message-input';
import RequestEmailBox from './request-email-box';

const Skeleton = styled(defaultSkeleton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  backdropFilter: 'blur(10px)',
  borderRadius: '4px',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  backgroundColor: 'transparent',
  '& .MuiBackdrop-root': {
    backgroundColor: 'transparent',
    backdropFilter: 'blur(10px)',
  },
  '& .MuiDialog-container': {
    // backgroundColor: 'transparent',
    '& .MuiDialog-paper': {
      backgroundColor: alpha(theme.palette.background.default, 0.8),
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      boxShadow: theme.shadows[10],
    },
  },
}));

// ----------------------------------------------------------------------

type responseDataType = {
  loading?: boolean,
  port_name?: string,
  port_name_loading?: boolean,
  port_desc?: string,
  port_desc_loading?: boolean,
  port_return_drivers?: string,
  port_return_drivers_loading?: boolean,
  port_risk_drivers?: string,
  port_risk_drivers_loading?: boolean,
  kpi?: {
    loading?: boolean,
    tot_ret?: string,
    ann_ret?: string,
    bench_ret?: string,
    sharpe?: string,
    maxdd?: string,
  },
  chart?: {
    loading?: boolean,
    xaxis: string[],
    yaxis: number[],
  },
  summary?: {
    loading?: boolean,
    benchmark: string[],
    metrics: string[],
    portfolio: string[],
  }
  table?: {
    loading?: boolean,
    ticker: string[],
    weighting: string[],
    holding: string[],
  }
}


const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function BuildView() {
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const [message, setMessage] = useState("");
  const [marketOption, setMarketOption] = useState("Sample50");
  const [optimizationOption, setOptimizationMarketOption] = useState("EqualWeighted");
  const [responseData, setResponseData] = useState<responseDataType[]>([]);
  const isFirstResponse = useBoolean(true);
  const isLoadingForNewResponse = useBoolean(false);
  const isShowRequestEmailDialog = useBoolean(false);
  const isShowSignInDialog = useBoolean(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [businessEmail, setBusinessEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const smUp = useResponsive('up', 'sm');

  const handleMarketOptionChange = (val: string) => {
    setMarketOption(val);
  };

  const handleOptimizationChange = (val: string) => {
    setOptimizationMarketOption(val);
  };

  // If user already request the email, don't show the modal, if not, show the modal to requet the email and name
  const handleSendWithConfirmEmail = (query: string) => {
    if (!query) {
      enqueueSnackbar('Please input the text.', {
        variant: 'error',
      });
      return;
    }
    if (!session) {
      isShowRequestEmailDialog.onTrue();
    } else {
      handleSend(query);
    }
  }

  // while streaming, scroll keeps the down
  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 10000,
      });
    }
  }

  // Apply the stream effect
  const handleSend = async (query: string) => {
    isShowRequestEmailDialog.onFalse();
    isShowSignInDialog.onFalse();
    setMessage("");
    if (!session) {
      enqueueSnackbar('Please sign in and try again.', {
        variant: 'info',
      });
      return;
    }

    isFirstResponse.onFalse();
    isLoadingForNewResponse.onTrue();
    scrollDown();
    const responseResult = await queryQuestion(query);
    console.log("responseResult", responseResult);
    if (!responseResult) {
      enqueueSnackbar('Something wrong', {
        variant: 'error',
      });
      return;
    }
    isLoadingForNewResponse.onFalse();
    scrollDown();

    let newResponse: responseDataType = {
      port_name_loading: true,
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(1000);
    scrollDown();

    newResponse = {
      ...newResponse,
      port_name_loading: false,
      port_name: responseResult.port_name,
      kpi: {
        loading: true,
      }
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(1000);
    scrollDown();

    newResponse = {
      ...newResponse,
      kpi: {
        ...responseResult.kpi,
        loading: false,
      },
      port_desc_loading: true,
      summary: {
        loading: true,
        metrics: [],
        benchmark: [],
        portfolio: [],
      }
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(2000);
    scrollDown();
    newResponse = {
      ...newResponse,
      port_desc_loading: false,
      port_desc: responseResult.port_desc,
      port_return_drivers: responseResult.port_return_drivers,
      port_risk_drivers: responseResult.port_risk_drivers,
      summary: {
        metrics: responseResult.summary.metrics,
        benchmark: responseResult.summary.benchmark,
        portfolio: responseResult.summary.portfolio,
      },
      chart: {
        loading: true,
        xaxis: [],
        yaxis: [],
      }
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(2000);
    scrollDown();

    newResponse = {
      ...newResponse,
      chart: {
        loading: false,
        xaxis: [...responseResult.chart.xaxis],
        yaxis: [...responseResult.chart.yaxis],
      },
      table: {
        loading: true,
        ticker: [],
        weighting: [],
        holding: [],
      }
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(2000);
    scrollDown();

    newResponse = {
      ...newResponse,
      table: {
        loading: false,
        ticker: [...responseResult.table.ticker],
        weighting: [...responseResult.table.weighting],
        holding: [...responseResult.table.holding],
      }
    }
    setResponseData([...responseData, newResponse])
    scrollDown();
    await delay(2000);
    scrollDown();
  }

  // 
  const handleClickStaticQuery = (query: string) => {
    setMessage(query);
    handleSendWithConfirmEmail(query);
  }

  // API call
  const queryQuestion = async (query: string) => {
    console.log(query, marketOption, optimizationOption);
    await delay(2000);
    try {
      const res = await axios.post(endpoints.message, {
        query,
        market: marketOption,
        optimization: optimizationOption,
      })
      const { body } = res.data;
      return JSON.parse(body);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  const handlePopupToggle = (isSignUp: boolean) => {
    if (isSignUp) {
      isShowRequestEmailDialog.onFalse();
      isShowSignInDialog.onTrue();
    } else {
      isShowRequestEmailDialog.onTrue();
      isShowSignInDialog.onFalse();
    }
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box ref={scrollContainerRef}
          sx={{
            flex: 1,
            width: '100%',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            pt: 2,
            pb: 16,
          }}
        >
          {
            isFirstResponse.value &&
            <Box sx={{
              width: '100%',
              maxWidth: "600px",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
              px: 2,
              py: 2,
            }}>
              <Typography variant="h3" sx={{
                mt: 2,
                mb: 2,
                textAlign: 'center',
              }}>
                Build smart portfolios, instantly
              </Typography>
              <MessageInput
                message={message}
                onChangeMessage={setMessage}
                marketOption={marketOption}
                onMarketOptionChange={handleMarketOptionChange}
                optimizationOption={optimizationOption}
                onOptimizationOptionChange={handleOptimizationChange}
                onSend={() => handleSendWithConfirmEmail(message)}
                isDevMode={isDevMode}
                onDevModeChange={(v) => setIsDevMode(!v)}
                sx={{
                  mb: 2,
                }}
              />

              <Box>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 1,
                }}>
                  <ButtonBase sx={{
                    flex: 1,
                    borderRadius: '4px',
                    border: theme => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    transition: 'all 0.3s',
                    p: 0.5,
                    gap: 1,
                    ':hover': {
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    }
                  }} onClick={() => handleClickStaticQuery(staticQueries[0])}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      backgroundColor: theme => alpha(theme.palette.divider, 0.15),
                    }}>
                      <Box sx={{ fontSize: '16px' }}>☘️</Box>
                    </Box>
                    <Typography variant='body2' component="span" align='left' sx={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      flex: 1,
                    }}>
                      {staticQueries[0]}
                    </Typography>
                  </ButtonBase>

                  <ButtonBase sx={{
                    flex: 1,
                    borderRadius: '4px',
                    border: theme => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    transition: 'all 0.3s',
                    p: 0.5,
                    gap: 1,
                    ':hover': {
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    }
                  }} onClick={() => handleClickStaticQuery(staticQueries[1])}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      backgroundColor: theme => alpha(theme.palette.divider, 0.15),
                    }}>
                      <Box sx={{ fontSize: '16px' }}>🌎</Box>
                    </Box>
                    <Typography variant='body2' component="span" align='left' sx={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      flex: 1,
                    }}>
                      {staticQueries[1]}
                    </Typography>
                  </ButtonBase>
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 1,
                }} onClick={() => handleClickStaticQuery(staticQueries[1])}>
                  <ButtonBase sx={{
                    flex: 1,
                    borderRadius: '4px',
                    border: theme => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    transition: 'all 0.3s',
                    p: 0.5,
                    gap: 1,
                    ':hover': {
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    }
                  }}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      backgroundColor: theme => alpha(theme.palette.divider, 0.15),
                    }}>
                      <Box sx={{ fontSize: '16px' }}>📰</Box>
                    </Box>
                    <Typography variant='body2' component="span" align='left' sx={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      flex: 1,
                    }}>
                      {staticQueries[2]}
                    </Typography>
                  </ButtonBase>

                  <ButtonBase sx={{
                    flex: 1,
                    borderRadius: '4px',
                    border: theme => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    transition: 'all 0.3s',
                    p: 0.5,
                    gap: 1,
                    ':hover': {
                      backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    }
                  }} onClick={() => handleClickStaticQuery(staticQueries[3])}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      backgroundColor: theme => alpha(theme.palette.divider, 0.15),
                    }}>
                      <Box sx={{ fontSize: '16px' }}>🏦</Box>
                    </Box>
                    <Typography variant='body2' component="span" align='left' sx={{
                      fontSize: '12px',
                      lineHeight: '12px',
                      flex: 1,
                    }}>
                      {staticQueries[3]}
                    </Typography>
                  </ButtonBase>
                </Box>
              </Box>
            </Box>
          }

          <Box sx={{
            width: '100%',
            maxWidth: "876px",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            px: 2,
          }}>
            {/* name section */}
            {
              responseData.map((response, index) => <Box key={`msg-${index}`}>
                <Box sx={{
                  mt: 4,
                  mb: 4,
                }}>
                  {
                    response.port_name_loading ?
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                      }}>
                        <Skeleton variant="text" sx={{
                          height: '48px',
                          maxWidth: '400px',
                          width: '100%',
                        }} />
                      </Box>
                      :
                      <Typography variant="h4" sx={{
                        mt: 4,
                        mb: 2,
                        textAlign: 'center',
                        color: 'primary.main',
                      }}>{response.port_name}</Typography>
                  }

                  {/* KPI section */}
                  {
                    response.kpi && <>
                      {
                        response.kpi.loading ? <Stack direction={smUp ? "row" : "column"} alignItems='center' justifyContent='space-between' spacing={4} sx={{ mb: 4 }}>
                          <Stack direction="column" sx={{ width: '100%' }}>
                            <Skeleton variant="text" sx={{ width: "60px", fontSize: '2rem' }} />
                            <Stack direction='row' spacing={2} justifyContent='space-between'>
                              <Box>
                                <Skeleton variant="text" sx={{ width: "60px", fontSize: '1rem' }} />
                                <Skeleton variant="text" sx={{ width: "40px", fontSize: '1rem' }} />
                              </Box>
                              <Box>
                                <Skeleton variant="text" sx={{ width: "60px", fontSize: '1rem' }} />
                                <Skeleton variant="text" sx={{ width: "40px", fontSize: '1rem' }} />
                              </Box>
                              <Box>
                                <Skeleton variant="text" sx={{ width: "60px", fontSize: '1rem' }} />
                                <Skeleton variant="text" sx={{ width: "40px", fontSize: '1rem' }} />
                              </Box>
                            </Stack>
                          </Stack>

                          <Stack direction="column" sx={{ width: '100%' }}>
                            <Skeleton variant="text" sx={{ width: "60px", fontSize: '2rem' }} />
                            <Stack direction='row' spacing={2} justifyContent='space-between'>
                              <Box>
                                <Skeleton variant="text" sx={{ width: "60px", fontSize: '1rem' }} />
                                <Skeleton variant="text" sx={{ width: "40px", fontSize: '1rem' }} />
                              </Box>
                              <Box>
                                <Skeleton variant="text" sx={{ width: "60px", fontSize: '1rem' }} />
                                <Skeleton variant="text" sx={{ width: "40px", fontSize: '1rem' }} />
                              </Box>
                              <Box />
                            </Stack>
                          </Stack>
                        </Stack>
                          :
                          <Stack direction={smUp ? "row" : "column"} alignItems='center' justifyContent='space-between' spacing={smUp ? 6 : 2} sx={{ mb: 4 }}>
                            <Stack direction="column" sx={{ width: '100%' }} spacing={1}>
                              <Typography variant='h6' sx={{ color: 'primary.main' }}>Return</Typography>
                              <Stack direction='row' spacing={2} justifyContent='space-between'>
                                <Box>
                                  <Typography variant='body2' sx={{
                                    color: theme => alpha(theme.palette.text.primary, 0.8),
                                    fontSize: '12px',
                                    mb: 1,
                                  }} >Portfolio Return</Typography>
                                  <Typography variant='h6'>{response.kpi.tot_ret}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant='body2' sx={{
                                    color: theme => alpha(theme.palette.text.primary, 0.8),
                                    fontSize: '12px',
                                    mb: 1,
                                  }} >Benchmark Relative</Typography>
                                  <Typography variant='h6'>{response.kpi.ann_ret}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant='body2' sx={{
                                    color: theme => alpha(theme.palette.text.primary, 0.8),
                                    fontSize: '12px',
                                    mb: 1,
                                  }} >Sharpe</Typography>
                                  <Typography variant='h6'>{response.kpi.sharpe}</Typography>
                                </Box>
                              </Stack>
                            </Stack>

                            <Stack direction="column" sx={{ width: '100%' }} spacing={1}>
                              <Typography variant='h6' sx={{ color: 'primary.main' }}>Risk</Typography>
                              <Stack direction='row' spacing={2} justifyContent='space-between'>
                                <Box>
                                  <Typography variant='body2' sx={{
                                    color: theme => alpha(theme.palette.text.primary, 0.8),
                                    fontSize: '12px',
                                    mb: 1,
                                  }} >Standard Deviation</Typography>
                                  <Typography variant='h6'>{response.kpi.maxdd}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant='body2' sx={{
                                    color: theme => alpha(theme.palette.text.primary, 0.8),
                                    fontSize: '12px',
                                    mb: 1,
                                  }} >Drawdown</Typography>
                                  <Typography variant='h6'>{response.kpi.maxdd}</Typography>
                                </Box>
                                <Box />
                              </Stack>
                            </Stack>
                          </Stack>
                      }
                    </>
                  }

                  {/* descirption section */}
                  {
                    response.summary && <>
                      {
                        response.port_desc_loading ? <Stack direction={smUp ? "row" : "column"} justifyContent='space-between' spacing={4} sx={{ mb: 4 }}>
                          <Stack direction="column" sx={{ width: '100%' }}>
                            <Box>
                              <Skeleton variant="text" sx={{ width: "100px", fontSize: '1.6rem' }} />
                              <Skeleton variant="text" sx={{ width: "100%", fontSize: '1rem' }} />
                              <Skeleton variant="text" sx={{ width: "80%", fontSize: '1rem' }} />
                            </Box>
                            <Box>
                              <Skeleton variant="text" sx={{ width: "100px", fontSize: '1.6rem' }} />
                              <Skeleton variant="text" sx={{ width: "100%", fontSize: '1rem' }} />
                              <Skeleton variant="text" sx={{ width: "80%", fontSize: '1rem' }} />
                            </Box>
                            <Box>
                              <Skeleton variant="text" sx={{ width: "100px", fontSize: '1.6rem' }} />
                              <Skeleton variant="text" sx={{ width: "100%", fontSize: '1rem' }} />
                              <Skeleton variant="text" sx={{ width: "80%", fontSize: '1rem' }} />
                            </Box>
                          </Stack>

                          <Stack direction="column" sx={{ width: '100%' }}>
                            <Skeleton variant="text" sx={{ width: "120px", fontSize: '1.6rem' }} />
                            <Skeleton variant="rectangular" sx={{ width: "100%", flex: 1 }} />
                          </Stack>
                        </Stack>
                          :
                          <Stack direction={smUp ? "row" : "column"} justifyContent='space-between' spacing={4} sx={{ mb: 4 }}>
                            <Stack direction="column" sx={{ width: '100%' }}>
                              <Box>
                                <Typography variant='h6' sx={{ mb: 1, color: 'primary.main' }}>Portfolio Description</Typography>
                                <Typography variant="body1" sx={{
                                  fontSize: '14px',
                                  color: theme => theme.palette.text.primary,
                                  textAlign: 'left',
                                  mb: 4,
                                }}>{response.port_desc}</Typography>
                              </Box>
                              <Box>
                                <Typography variant='h6' sx={{ mb: 1, color: 'primary.main' }}>Return Drivers</Typography>
                                <Typography variant="body1" sx={{
                                  fontSize: '14px',
                                  color: theme => theme.palette.text.primary,
                                  textAlign: 'left',
                                  mb: 4,
                                }}>{response.port_return_drivers}</Typography>
                              </Box>
                              <Box>
                                <Typography variant='h6' sx={{ mb: 1, color: 'primary.main' }}>Risk Drivers</Typography>
                                <Typography variant="body1" sx={{
                                  fontSize: '14px',
                                  color: theme => theme.palette.text.primary,
                                  textAlign: 'left',
                                  mb: 4,
                                }}>{response.port_risk_drivers}</Typography>
                              </Box>
                            </Stack>

                            <Stack direction="column" sx={{ width: '100%' }}>
                              <Typography variant='h6' sx={{ mb: 1, color: 'primary.main' }}>Performance Summary</Typography>

                              <Table>
                                <TableHead>
                                  <TableRow key="row-key-0">
                                    <TableCell sx={{
                                      backgroundColor: theme => alpha(theme.palette.divider, 0.05),
                                      border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                      p: 1,
                                    }} />
                                    <TableCell sx={{
                                      backgroundColor: theme => alpha(theme.palette.divider, 0.05),
                                      border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                      p: 1,
                                    }}>Port</TableCell>
                                    <TableCell sx={{
                                      backgroundColor: theme => alpha(theme.palette.divider, 0.05),
                                      border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                      p: 1,
                                    }}>Benchmark</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {
                                    response.summary && response.summary.metrics.map((_ticker, _index) => <TableRow key={`row-key-${_index}`}>
                                      <TableCell sx={{
                                        border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                        p: 1,
                                      }}>
                                        {metricsLabel[_ticker]}
                                      </TableCell>
                                      <TableCell sx={{
                                        border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                        p: 1,
                                      }}>
                                        {response.summary && response.summary.portfolio[_index]}
                                      </TableCell>
                                      <TableCell sx={{
                                        border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                        p: 1,
                                      }}>
                                        {response.summary && response.summary.benchmark[_index]}
                                      </TableCell>
                                    </TableRow>
                                    )
                                  }
                                </TableBody>
                              </Table>
                            </Stack>
                          </Stack>
                      }
                    </>
                  }
                </Box>

                {/* Chart section */}
                {
                  response.chart && <>
                    {
                      response.chart.loading ?
                        <Box sx={{
                          mb: 4
                        }}>
                          <Skeleton variant="text" sx={{
                            height: '32px',
                            width: '100%',
                            maxWidth: '200px',
                          }} />
                          <Skeleton variant="rectangular" sx={{
                            height: '256px',
                            width: '100%',
                          }} />
                        </Box>
                        :
                        <Box sx={{ mb: 4 }}>
                          <Typography variant='subtitle2' sx={{
                            fontWeight: 700,
                          }}>5yr Portfolio Backtest</Typography>

                          <ChartBox xData={response.chart.xaxis} yData={response.chart.yaxis} />
                        </Box>
                    }
                  </>
                }

                {/* Table section */}
                {
                  response.table && <>
                    {
                      response.table.loading ?
                        <Box sx={{
                        }}>
                          <Skeleton variant="text" sx={{
                            height: '32px',
                            width: '100%',
                            maxWidth: '200px',
                          }} />
                          <Skeleton variant="rectangular" sx={{
                            height: '256px',
                            width: '100%',
                          }} />
                        </Box> :
                        <Box sx={{ mb: 0 }}>
                          <Typography variant='subtitle2' sx={{
                            fontWeight: 700,
                            mb: 2,
                          }}>Your portfolio has {response.table.ticker.length} holdings listed below:</Typography>

                          <Table>
                            <TableHead>
                              <TableRow key="row-key-0">
                                {
                                  Object.keys(response.table).map((_key, _index) => {
                                    if (_key === 'loading') return <></>;
                                    return <TableCell key={`table-header-${_index}`} sx={{
                                      backgroundColor: theme => alpha(theme.palette.divider, 0.05),
                                      border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                      p: 1,
                                      ...(_index % 2 === 0 ? {
                                        backgroundColor: theme => alpha(theme.palette.divider, 0.05),
                                      } : {}),
                                    }}>
                                      {_key}
                                    </TableCell>
                                  })
                                }
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                response.table.ticker.map((_ticker, _index) => <TableRow key={`row-key-${_index}`}>

                                  {
                                    Object.keys(response.table ? response.table : []).map((_key, _i) => {
                                      const tableData = response.table as {
                                        [key: string]: any;
                                      };
                                      if (_key === 'loading') return <></>;
                                      return <TableCell key={`table-cell-${_index}-${_i}`} sx={{
                                        border: theme => `1px solid ${alpha(theme.palette.divider, 0.4)}!important`,
                                        p: 1,
                                        ...(_i % 2 === 0 ? {
                                          color: theme => alpha(theme.palette.text.primary, 0.8),
                                          fontSize: '14px',
                                        } : {}),
                                      }}>
                                        {tableData[_key][_i]}
                                      </TableCell>
                                    })
                                  }
                                </TableRow>
                                )
                              }
                            </TableBody>
                          </Table>
                        </Box>
                    }
                  </>
                }
              </Box>)
            }
            {

              isLoadingForNewResponse.value && <Box key="msg-0">
                <Box sx={{
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                }}>
                  <LoadingCubeScreen />
                </Box>
              </Box>
            }
          </Box>
        </Box>

        {
          !isFirstResponse.value &&
          <Box sx={{
            width: '100%',
            maxWidth: "876px",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            px: 2,
            py: 2,
            position: 'absolute',
            bottom: 0,
          }}>
            <MessageInput
              message={message}
              onChangeMessage={setMessage}
              marketOption={marketOption}
              onMarketOptionChange={handleMarketOptionChange}
              optimizationOption={optimizationOption}
              onOptimizationOptionChange={handleOptimizationChange}
              onSend={() => handleSendWithConfirmEmail(message)}
              placeholder='Ask about this portfolio'
              isDevMode={isDevMode}
            />
          </Box>
        }
      </Box>
      <Box>
        <Link href="/contact" sx={{
          color: 'text.primary',
        }}>Contact</Link>
      </Box>

      <StyledDialog open={isShowRequestEmailDialog.value} onClose={() => isShowRequestEmailDialog.onFalse()} maxWidth="xs" fullWidth>
        <RequestEmailBox
          businessEmail={businessEmail}
          onChangeBusinessEmail={setBusinessEmail}
          companyName={companyName}
          onChangeCompanyName={setCompanyName}
          onSaved={() => handleSend(message)}
          onLoginPopup={() => handlePopupToggle(true)}
        />
      </StyledDialog>

      <StyledDialog open={isShowSignInDialog.value} onClose={() => isShowSignInDialog.onFalse()} maxWidth="xs" fullWidth>
        <SignInBox
          onSaved={() => isShowSignInDialog.onFalse()}
          onLoginPopup={() => handlePopupToggle(false)}
        />
      </StyledDialog>
    </Container >
  );
}

const dummyData: responseDataType[] = [
  {
    "port_name": "The Decarbonize Portfolio",
    "port_name_loading": false,
    "port_desc": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints. The portfolio has significant exposure to renewable energy providers and equipment manufacturers, electric vehicle manufacturers and battery producers, energy efficiency solutions providers, and innovative materials and technologies that drive sustainability. Other areas of focus include green hydrogen, carbon capture & storage, biofuels, and technologies that support the modernization and decarbonization of the power grid. Companies were selected based on assessing their strategic positioning and product roadmaps relative to broader decarbonization trends, their targets and track record on emissions reductions, and leadership in supporting policies and frameworks that enable the clean energy transition. Let me know if you would like me to modify or add any details to this description. I tried to capture the key elements and positioning for a forward-looking decarbonization-focused portfolio.",
    "port_desc_loading": false,
    "port_return_drivers": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints.",
    "port_risk_drivers": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints.",
    "kpi": {
      loading: false,
      "tot_ret": "47%",
      "ann_ret": "13%",
      "bench_ret": "13%",
      "sharpe": "2.13",
      "maxdd": "-12%"
    },
    "chart": {
      loading: false,
      "yaxis": [3, 2, 3, 9, 10, 6, 11, 12, 14],
      "xaxis": [
        "04-24",
        "05-24",
        "06-24",
        "07-24",
        "08-24",
        "09-24",
        "10-24",
        "11-24",
        "12-24"
      ]
    },
    "table": {
      loading: false,
      "ticker": [
        "ABC",
        "ABC",
        "ABC",
        "ABC",
        "ABC",
      ],
      weighting: [
        "12%",
        "12%",
        "12%",
        "12%",
        "12%",
      ],
      "holding": [
        "This is a holding description",
        "This is a holding description",
        "This is a holding description",
        "This is a holding description",
        "This is a holding description"
      ],
    },
    "summary": {
      loading: false,
      benchmark: [
        "$10,000",
        "$20,000",
        "15%",
        "11%",
        "20%",
        "-12%",
        "-14%",
        "2.13",
      ],
      metrics: [
        "start_bal",
        "end_bal",
        "ann_ret",
        "stdev",
        "best_yr",
        "worst_yr",
        "max_dd",
        "sharpe",
      ],
      portfolio: [
        "$10,000",
        "$20,000",
        "15%",
        "11%",
        "20%",
        "-12%",
        "-14%",
        "2.13",
      ]
    }
  },
  {
    "port_name": "The Decarbonize Portfolio",
    "port_name_loading": true,
    "port_desc": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints. The portfolio has significant exposure to renewable energy providers and equipment manufacturers, electric vehicle manufacturers and battery producers, energy efficiency solutions providers, and innovative materials and technologies that drive sustainability. Other areas of focus include green hydrogen, carbon capture & storage, biofuels, and technologies that support the modernization and decarbonization of the power grid. Companies were selected based on assessing their strategic positioning and product roadmaps relative to broader decarbonization trends, their targets and track record on emissions reductions, and leadership in supporting policies and frameworks that enable the clean energy transition. Let me know if you would like me to modify or add any details to this description. I tried to capture the key elements and positioning for a forward-looking decarbonization-focused portfolio.",
    "port_desc_loading": true,
    "port_return_drivers": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints.",
    "port_risk_drivers": "This portfolio aims to capitalize on growing global efforts and momentum towards decarbonization across industries. It includes companies that are poised to benefit from the transition to a lower-carbon economy, either through the products and services they offer to enable emissions reductions or their own commitments to aggressively reducing their carbon footprints.",
    "kpi": {
      loading: true,
      "tot_ret": "47%",
      "ann_ret": "13%",
      "bench_ret": "13%",
      "sharpe": "2.13",
      "maxdd": "-12%"
    },
    "chart": {
      loading: true,
      "yaxis": [3, 2, 3, 9, 10, 6, 11, 12, 14],
      "xaxis": [
        "04-24",
        "05-24",
        "06-24",
        "07-24",
        "08-24",
        "09-24",
        "10-24",
        "11-24",
        "12-24"
      ]
    },
    "table": {
      loading: true,
      "ticker": [
        "ABC",
        "ABC",
        "ABC",
        "ABC",
        "ABC",
      ],
      "holding": [
        "This is a holding description",
        "This is a holding description",
        "This is a holding description",
        "This is a holding description",
        "This is a holding description"
      ],
      weighting: [
        "12%",
        "12%",
        "12%",
        "12%",
        "12%",
      ]
    },
    "summary": {
      loading: true,
      benchmark: [
        "$10,000",
        "$20,000",
        "15%",
        "11%",
        "20%",
        "-12%",
        "-14%",
        "2.13",
      ],
      metrics: [
        "start_bal",
        "end_bal",
        "ann_ret",
        "stdev",
        "best_yr",
        "worst_yr",
        "max_dd",
        "sharpe",
      ],
      portfolio: [
        "$10,000",
        "$20,000",
        "15%",
        "11%",
        "20%",
        "-12%",
        "-14%",
        "2.13",
      ]
    }
  },
];

const staticQueries = [
  "Portfolio that benefits from decarbonisation",
  "Portfolio that benefits from rising population",
  "Portfolio that benefits from increased government defence spending",
  "Index portfolio with no technology shares",
]

const metricsLabel: {
  [key: string]: any;
} = {
  "start_bal": "Starting Balance",
  "end_bal": "Ending Balance",
  "ann_ret": "Annualized Return (CAGR)",
  "stdev": "Standard Deviation",
  "best_yr": "Best Year",
  "worst_yr": "Worst Year",
  "max_dd": "Maximum Drawdown",
  "sharpe": "Sharpe Ratio",
}