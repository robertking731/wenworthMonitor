"use client";


import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Button, TextField, InputAdornment } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/#1',
  },
  {
    label: 'Settings',
    linkTo: '/#2',
  },
];


// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session, status } = useSession();
  const router = useRouter();
  const signPopover = usePopover();
  const profilePopover = usePopover();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isShowPassword = useBoolean(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      setEmail(session.user?.email as string);
      setName(session.user?.name as string);
    }
  }, [session, setName, setEmail])

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    signPopover.onClose();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error(result.error);
      enqueueSnackbar(result.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Login successful', { variant: 'success' });
    }
  };

  const handleLogout = async () => {
    try {
      profilePopover.onClose();
      signOut({
        redirect: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return "";

  return (
    <>
      {
        session ? <>
          <IconButton
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.05)}
            onClick={profilePopover.onOpen}
            sx={{
              width: 40,
              height: 40,
              background: (theme) => alpha(theme.palette.grey[500], 0.08),
              ...(profilePopover.open && {
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              }),
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                border: (theme) => `solid 2px ${theme.palette.background.default}`,
              }}
            >
              {name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <CustomPopover open={profilePopover.open} onClose={profilePopover.onClose} sx={{ width: 200, p: 0 }}>
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
              onClick={(handleLogout)}
              sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
            >
              Logout
            </MenuItem>
          </CustomPopover>
        </> : <>
          <IconButton color='primary' sx={{
            backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
          }} onClick={signPopover.onOpen}>
            <Iconify icon="material-symbols:login" />
          </IconButton>

          <CustomPopover open={signPopover.open} onClose={signPopover.onClose} sx={{ width: 200, p: 0 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <TextField fullWidth type='text' size='small' label="Email or phone" placeholder='Enter phonenumber or email'
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                name="password"
                label="Password"
                size='small'
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
              <Stack direction='row' justifyContent='end'>
                <Button variant='contained' color='primary' size='small' onClick={handleSignin}>Login</Button>
              </Stack>
            </Stack>
          </CustomPopover>
        </>
      }
    </>
  );
}
