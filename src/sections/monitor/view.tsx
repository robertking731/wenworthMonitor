'use client';
import React from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartInstance, AgChartOptions } from 'ag-charts-community';
import 'ag-charts-enterprise';
import Container from '@mui/material/Container';
import {alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { options,chartLists } from './chartCofig';

export default function BasicGrid() {
  const settings = useSettingsContext();
  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Monitor</Typography>
      <TextField
          id="outlined-query-input"
          label="Enter a query or ticker"
          type="text"
          className='mt-8'
          fullWidth
        />
      <Box
        sx={{
          mt: 1,
          width: 1,
          borderRadius: 2,
          padding: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Grid container>
          <div className='flex flex-wrap justify-between'>
            {chartLists.map((item) => {
              var mainColor = "";
              console.log(item.percentage<0)
              if(Number(item.percentage) < 0) {
                options.series = [
                  {
                    type: 'area',
                    xKey: 'date',
                    yKey: 'detachedHouses',
                    fill: 'red',
                  },
                ],
                mainColor = "red";
              }else {
                options.series = [
                  {
                    type: 'area',
                    xKey: 'date',
                    yKey: 'detachedHouses',
                    fill: 'green',
                  },
                ],
                mainColor = "green";
              }
              const newOption = Object.assign({},options)
              return(
              <div className="w-[200px] mr-3">
                <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                  {item.title}
                </Typography>
                <div className="text-center">
                  <Typography variant="body1" gutterBottom>
                    price: {item.price} 
                  </Typography>
                  <div className="w-full h-[150px]">
                    <AgChartsReact options={newOption} />
                  </div>
                  <Typography variant="body1" gutterBottom color={mainColor}>
                    {item.percentage}% change
                  </Typography>
                </div>
              </div>
            )})}
          </div>
          <Grid item container marginTop={3} justifyContent="space-between" wrap="nowrap">
            <Grid item xs={12} sm={6} border={'1px solid black'} margin={'0 5px'}>
              <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                SUMMARY
              </Typography>
              <div>
                <Typography variant="body1" gutterBottom>
                  - Europe agrees on 500m pay package for Ukraine
                </Typography>
                <Typography variant="body1" gutterBottom>
                  - Embargo in Solomon Islands. This affects NVIDIA earnings who receive Nick
                  shipments...
                </Typography>
                <Typography variant="body1" gutterBottom>
                  - Donald Trump inches higher in the election polls following...
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Related Queries
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} border={'1px solid black'} margin={'0 5px'}>
              <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                PORTFOLIO
              </Typography>
              <Grid container justifyContent="space-between">
                <Grid item xs={12} sm={4}>
                  <div className="text-center">
                    <Typography variant="body1" gutterBottom>
                      &nbsp;
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      Wartime: 0.43%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      Decarb: -0.63%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      Ageing: -0.14%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      AI: -0.04%
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className="text-center">
                    <Typography variant="h6" gutterBottom>
                      % 1D
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      0.43%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      -0.63%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      -0.14%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'red'}>
                      -0.04%
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className="text-center">
                    <Typography variant="h6" gutterBottom>
                      % YTD
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      17.6%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      12.7%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      8.2%
                    </Typography>
                    <Typography variant="body1" gutterBottom color={'green'}>
                      26.0%
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container marginTop={3} justifyContent="space-between" wrap="nowrap">
            <Grid item xs={12} sm={6} md={4} border={'1px solid black'} margin={'0 5px'}>
              <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                NEWS
              </Typography>
              <div className="pl-2">
                <Typography variant="body1" gutterBottom color={'green'}>
                  Why the RBA wont raise rates
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The RBA raised its dot-plot so it will not raise rates until the 2nd half of this
                  year
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  Why the RBA wont raise rates
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The RBA raised its dot-plot so it will not raise rates until the 2nd half of this
                  year
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  Why the RBA wont raise rates
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The RBA raised its dot-plot so it will not raise rates until the 2nd half of this
                  year
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  Why the RBA wont raise rates
                </Typography>
                <Typography variant="body2" gutterBottom>
                  The RBA raised its dot-plot so it will not raise rates until the 2nd half of this
                  year
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} border={'1px solid black'} margin={'0 5px'}>
              <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                RESEARCH
              </Typography>
              <div className="pl-2">
                <Typography variant="body1" gutterBottom color={'green'}>
                  BOFA: Latest equity research trends
                </Typography>
                <Typography variant="body2" gutterBottom>
                  BOFA believes gold prices will rise
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  BOFA: Latest equity research trends
                </Typography>
                <Typography variant="body2" gutterBottom>
                  BOFA believes gold prices will rise
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  BOFA: Latest equity research trends
                </Typography>
                <Typography variant="body2" gutterBottom>
                  BOFA believes gold prices will rise
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
                <Typography variant="body1" gutterBottom color={'green'}>
                  BOFA: Latest equity research trends
                </Typography>
                <Typography variant="body2" gutterBottom>
                  BOFA believes gold prices will rise
                </Typography>
                <Typography variant="body2" gutterBottom color={'grey'}>
                  20th June
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} border={'1px solid black'} margin={'0 5px'}>
              <Typography variant="h6" gutterBottom bgcolor={'#104b57'} textAlign={'center'}>
                PORTFOLIO UPDATES
              </Typography>
              <div className="pl-2">
                <Typography variant="body1" gutterBottom>
                  30th June, 2024
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - AAPL reported earnings which caused the stock price to fall -2%
                </Typography>
                <Typography variant="body1" gutterBottom>
                  30th June, 2024
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - AAPL reported earnings which caused the stock price to fall -2%
                </Typography>
                <Typography variant="body1" gutterBottom>
                  30th June, 2024
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - AAPL reported earnings which caused the stock price to fall -2%
                </Typography>
                <Typography variant="body1" gutterBottom>
                  30th June, 2024
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - AAPL reported earnings which caused the stock price to fall -2%
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
