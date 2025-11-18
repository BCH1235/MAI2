import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

/**
 * Simple modal that prompts the user for a beat name before saving.
 */
export default function BeatSaveDialog({
  open,
  defaultValue = '',
  onCancel,
  onConfirm,
  busy = false,
}) {
  const colors = {
    background: '#0F0F0F',
    border: 'rgba(45, 212, 191, 0.25)',
    text: '#FFFFFF',
    textMuted: '#B0B0B0',
    accent: '#2DD4BF',
    buttonHover: 'rgba(45, 212, 191, 0.12)',
  };

  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setError('');
    }
  }, [open, defaultValue]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('이름을 입력해주세요.');
      return;
    }
    onConfirm?.(trimmed);
  };
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: 3,
          boxShadow: `0 20px 40px rgba(0,0,0,0.7)`,
        },
      }}
    >
      <DialogTitle sx={{ color: colors.text, fontWeight: 700 }}>비트 이름 저장</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            inputRef={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            label="라이브러리에서 보일 이름"
            placeholder="나의 새로운 비트"
            autoComplete="off"
            disabled={busy}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: '#050505',
                color: colors.text,
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.border,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.accent,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.accent,
              },
              '& .MuiInputLabel-root': {
                color: colors.textMuted,
              },
              '&.Mui-focused .MuiInputLabel-root': {
                color: colors.accent,
              },
              '& .MuiFormHelperText-root': {
                color: error ? '#EF5350' : colors.textMuted,
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onCancel}
          disabled={busy}
          sx={{
            color: colors.textMuted,
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={busy}
          sx={{
            bgcolor: colors.accent,
            color: '#0B0B0B',
            fontWeight: 700,
            px: 3,
            '&:hover': { bgcolor: '#27c5ad' },
            '&.Mui-disabled': {
              bgcolor: 'rgba(45, 212, 191, 0.4)',
              color: '#0B0B0B',
            },
          }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
