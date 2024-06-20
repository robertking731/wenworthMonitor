import { useState } from "react";

import SaveIcon from '@mui/icons-material/Save';
import { Box, Link, Stack, Button, BoxProps, TextField, Typography, IconButton, InputAdornment } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import axios, { endpoints } from 'src/utils/axios';

import Iconify from "src/components/iconify";
import { useSnackbar } from 'src/components/snackbar';

interface RequestEmailBoxProps extends BoxProps {
    businessEmail?: string;
    onChangeBusinessEmail?: (email: string) => void;
    companyName?: string;
    onChangeCompanyName?: (name: string) => void;
    onSaved?: () => void;
    onLoginPopup?: () => void;
}

export default function RequestEmailBox({ businessEmail: defaultBusinessEmail = "", onChangeBusinessEmail, companyName: defaultCompanyName = "", onChangeCompanyName, onSaved, onLoginPopup, sx, ...other }: RequestEmailBoxProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [businessEmail, setBusinessEmail] = useState(defaultBusinessEmail);
    const [companyName, setCompanyName] = useState(defaultCompanyName);
    const [password, setPassword] = useState("");
    const isShowPassword = useBoolean(false);

    // save user's email and name on localstorage
    const handleSave = async () => {
        if (!businessEmail) {
            enqueueSnackbar('Please input the business email.', {
                variant: 'error',
            });
            return;
        }
        if (!companyName) {
            enqueueSnackbar('Please input the company name.', {
                variant: 'error',
            });
            return;
        }
        if (onSaved) {
            axios.post(endpoints.auth.signup, {
                email: businessEmail,
                name: companyName,
                password,
            }).then(() => {
                enqueueSnackbar('User created!', {
                    variant: 'success',
                });
                onSaved();
            }).catch((error) => {
                enqueueSnackbar('Something wrong!', {
                    variant: 'error',
                });
            });
        }
    }

    const handleLoginPopup = () => {
        if (onLoginPopup) onLoginPopup();
    }

    return <Box sx={{
        px: 2,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
    }} {...other}>
        <Typography variant="subtitle1" component='h3' align="center"><Link onClick={handleLoginPopup} sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
        }}>Login here</Link> to view the result</Typography>
        <Typography variant="body1" component='p' align="center" sx={{
            color: theme => theme.palette.text.secondary,
        }}>Not a user? Sign up for free</Typography>
        <TextField fullWidth label="Business Email" type="email" value={businessEmail} onChange={(e) => { setBusinessEmail(e.target.value) }} />
        <TextField fullWidth label="Company Name" type="text" value={companyName} onChange={(e) => { setCompanyName(e.target.value) }} />
        <TextField
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isShowPassword.value ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={isShowPassword.onToggle} edge="end">
                            <Iconify icon={isShowPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
        <Stack direction="row" justifyContent="end" gap={2}>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
                Save
            </Button>
        </Stack>
    </Box>
}