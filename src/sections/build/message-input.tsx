'use client';

import Image from 'next/image';
import { useState } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Stack, Button, Switch, MenuItem, Typography, IconButton, InputLabel, FormControl } from '@mui/material';

import { useSnackbar } from 'src/components/snackbar';

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  color: ${theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[900]};
  background: transparent;
`,
);

interface MessageInputProps extends BoxProps {
    message?: string;
    onChangeMessage?: (text: string) => void;
    marketOption?: string;
    optimizationOption?: string;
    isDevMode?: boolean;
    placeholder?: string;
    onMarketOptionChange?: (marketOption: string) => void;
    onOptimizationOptionChange?: (optimizationOption: string) => void;
    onDevModeChange?: (v: boolean) => void;
    onSend?: () => void;
}

export default function MessageInput({
    message,
    onChangeMessage,
    marketOption: defaultMarketOption,
    optimizationOption: defaultOptimizationOption,
    onMarketOptionChange,
    onOptimizationOptionChange,
    onDevModeChange,
    onSend,
    placeholder = 'Build me a portfolio that',
    isDevMode = false,
    sx,
    ...other
}: MessageInputProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = useState(message);
    const [marketOption, setMarketOption] = useState(defaultMarketOption);
    const [optimizationOption, setOptimizationMarketOption] = useState(defaultOptimizationOption);
    const [isShowAdvancedOptions, setIsShowAdvancedOptions] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        if (onChangeMessage) {
            console.log(event.target.value);
            onChangeMessage(event.target.value);
        }
    }

    const handleMarketOptionChange = (event: SelectChangeEvent) => {
        const _marketOption = event.target.value as string;
        if ((marketOptions.find((_, _i) => _.value === _marketOption) as optionType).pro) {
            enqueueSnackbar('Contact us for a demo to access the pro features, there should be an email input, and we will hook up the output into something like Mailchimp or AIrtable.', {
                variant: 'error',
            });
            return;
        }

        setMarketOption(_marketOption);
        if (onMarketOptionChange) {
            onMarketOptionChange(event.target.value as string);
        }
    };

    const handleOptimizationChange = (event: SelectChangeEvent) => {
        const _optimizationOption = event.target.value as string;
        if ((optimizationOptions.find((_, _i) => _.value === _optimizationOption) as optionType).pro) {
            enqueueSnackbar('Contact us for a demo to access the pro features, there should be an email input, and we will hook up the output into something like Mailchimp or AIrtable.', {
                variant: 'error',
            });
            return;
        }

        setOptimizationMarketOption(_optimizationOption);
        if (onOptimizationOptionChange) {
            onOptimizationOptionChange(event.target.value as string);
        }
    };

    const handleDevModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        if (onDevModeChange) {
            onDevModeChange(e.target.value === "true");
        }
    }

    const onSendHandle = () => {
        if (onSend) {
            onSend();
        }
    }

    return <Box sx={{
        pl: 2,
        pt: 2,
        pr: 1,
        pb: 1,
        width: '100%',
        borderRadius: '6px',
        border: theme => `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
        ...(isFocus ? {
            border: theme => `1px solid ${theme.palette.primary.main}`,
            background: theme => alpha(theme.palette.primary.main, 0.05),
        } : {}),
        ...sx,
    }} {...other}>
        {/* textare to input the text */}
        <Textarea value={value} placeholder={placeholder} onChange={handleTextChange} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} sx={{
            width: '100%',
            mb: 1,
        }} />
        <Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}>
                    <Button sx={{
                        fontSize: '12px',
                        color: theme => alpha(theme.palette.text.secondary, 0.8),
                        borderRadius: '20px',
                        border: theme => `1px solid transparent`,
                        transition: 'all 0.3s',
                        '&:hover': {
                            border: theme => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        }
                    }} startIcon={<KeyboardArrowDownIcon sx={{
                        transition: 'all 0.3s',
                        rotate: (isShowAdvancedOptions ? '180deg' : '0'),
                    }} />} onClick={() => {
                        setIsShowAdvancedOptions(!isShowAdvancedOptions)
                    }}>Advanced Options</Button>
                </Box>
                <Stack direction='row' alignItems='center'>
                    <Switch color='primary' value={isDevMode} onChange={handleDevModeChange} />
                    <IconButton color="primary" size='small' sx={{
                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                        transition: 'all 0.3s',
                    }} onClick={onSendHandle}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden',
                height: (isShowAdvancedOptions ? '52px' : '0px'),
                pt: (isShowAdvancedOptions ? '12px' : '0px'),
            }}>
                <FormControl
                    sx={{
                    }}
                    size="small"
                >
                    <InputLabel id="market-option-label">Market</InputLabel>
                    <Select
                        labelId="market-option-label"
                        value={marketOption}
                        label="Market"
                        onChange={handleMarketOptionChange}
                        size='small'
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    backgroundColor: 'transparent',
                                },
                            },
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: '200px',
                            minWidth: '120px',
                        }}
                    >
                        {
                            marketOptions.map((_mar, _index) => <MenuItem key={`mar-key-${_index}`} value={_mar.value}>
                                {
                                    _mar.pro ? <Stack direction="row" alignItems='center' justifyContent='space-between' spacing={2} sx={{ width: '100%' }}>
                                        <Typography variant='body2' component='span'>{_mar.label}</Typography>
                                        <Image width={16} height={16} alt='pro' src="/assets/icons/pro.png" />
                                    </Stack> : _mar.label
                                }
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl
                    sx={{
                    }}
                    size="small"
                >
                    <InputLabel id="optimization-option-label">Optimization</InputLabel>
                    <Select
                        labelId="optimization-option-label"
                        value={optimizationOption}
                        label="Optimization"
                        onChange={handleOptimizationChange}
                        size='small'
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    backgroundColor: 'transparent',
                                },
                            },
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: '200px',
                            minWidth: '160px',
                        }}
                    >
                        {
                            optimizationOptions.map((_opt, _index) => <MenuItem key={`opt-key-${_index}`} value={_opt.value}>
                                {
                                    _opt.pro ? <Stack direction="row" alignItems='center' justifyContent='space-between' spacing={2} sx={{ width: '100%' }}>
                                        <Typography variant='body2' component='span'>{_opt.label}</Typography>
                                        <Image width={16} height={16} alt='pro' src="/assets/icons/pro.png" />
                                    </Stack> : _opt.label
                                }
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>
            </Box>
        </Box>
    </Box>
}

type optionType = {
    value: string,
    label: string,
    pro?: boolean,
}

const marketOptions: optionType[] = [
    {
        value: "Sample50",
        label: "Sample50",
    },
    {
        value: "S&P500",
        label: "S&P500",
        pro: true,
    },
    {
        value: "ASX200",
        label: "ASX200",
        pro: true,
    },
];

const optimizationOptions: optionType[] = [
    {
        value: "EqualWeighted",
        label: "Equal Weighted",
    },
    {
        value: "MarketCap",
        label: "Market Cap",
        pro: true,
    },
    {
        value: "MinimumVariance",
        label: "Minimum Variance",
        pro: true,
    },
    {
        value: "Momentum",
        label: "Momentum",
        pro: true,
    },
];