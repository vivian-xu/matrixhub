import {
  Button, Group, Modal, Stack, Text,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import DangerIcon from '@/assets/svgs/danger.svg?react'
import InfoIcon from '@/assets/svgs/info.svg?react'

import type { ModalProps } from '@mantine/core'
import type { ReactNode } from 'react'

const modalTypeIcons = {
  info: <InfoIcon color="var(--mantine-color-cyan-6)" />,
  danger: <DangerIcon color="var(--mantine-color-red-6)" />,
}

export type ModalWrapperProps = Omit<ModalProps, 'title'> & {
  type?: 'info' | 'danger'
  title: ReactNode
  footer?: ReactNode
  confirmLoading?: boolean
  onConfirm?: () => void
}

export function ModalWrapper({
  type,
  title,
  children,
  footer,
  confirmLoading,
  onConfirm,
  ...rest
}: ModalWrapperProps) {
  const { t } = useTranslation()
  const icon = type ? modalTypeIcons[type] : null

  const header = (
    <Group gap="xs">
      { icon }
      <Text fw={600} fz="md">
        {title}
      </Text>
    </Group>
  )

  const defaultFooter = (
    <Group justify="flex-end" gap="md">
      <Button
        color="default"
        variant="subtle"
        onClick={rest.onClose}
      >
        {t('common.cancel')}
      </Button>
      <Button
        loading={confirmLoading}
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </Button>
    </Group>
  )

  return (
    <Modal
      title={header}
      centered
      {...rest}
    >
      <Stack gap="lg">
        {children}
        {footer ?? defaultFooter}
      </Stack>
    </Modal>
  )
}
