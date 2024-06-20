import { useState } from "react";
import { signIn } from 'next-auth/react';

import SaveIcon from '@mui/icons-material/Save';
import { Box, Link, Stack, Button, BoxProps, TextField, Typography, IconButton, InputAdornment } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSnackbar } from 'src/components/snackbar';

interface SignInBoxProps extends BoxProps {
    onSaved?: () => void;
    onLoginPopup?: () => void;
}

export default function SignInBox({ onSaved, onLoginPopup, sx, ...other }: SignInBoxProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [businessEmail, setBusinessEmail] = useState("");
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
        if (onSaved) {
            const result = await signIn('credentials', {
                redirect: false,
                email: businessEmail,
                password,
            });

            if (result?.error) {
                console.error(result.error);
                enqueueSnackbar(result.error, { variant: 'error' });
            } else {
                enqueueSnackbar('Login successful', { variant: 'success' });
                onSaved()
            }
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
        <Typography variant="subtitle1" component='h3' align="center">Login to view the result</Typography>
        <Typography variant="body1" component='p' align="center" sx={{
            color: theme => theme.palette.text.secondary,
        }}>Not a user? <Link onClick={handleLoginPopup} sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
        }}>Sign up for free</Link></Typography>
        <TextField fullWidth label="Business Email" type="email" value={businessEmail} onChange={(e) => { setBusinessEmail(e.target.value) }} />
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