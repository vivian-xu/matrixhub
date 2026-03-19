import {
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { ProjectRoleType } from '@matrixhub/api-ts/v1alpha1/role.pb'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { ModalWrapper } from '@/shared/components/ModalWrapper'
import { fieldError } from '@/shared/utils/form'

import { updateMemberRoleMutationOptions } from '../members.mutation'

import type { ProjectMember } from '@matrixhub/api-ts/v1alpha1/project.pb'

const requiredString = z.string().min(1)

interface EditRoleModalProps {
  opened: boolean
  onClose: () => void
  projectId: string
  member: ProjectMember | null
}

export function EditRoleModal({
  opened,
  onClose,
  projectId,
  member,
}: EditRoleModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(updateMemberRoleMutationOptions())

  const form = useForm({
    defaultValues: {
      role: member?.role ?? '' as string,
    },
    onSubmit: async ({ value }) => {
      if (!member?.memberId || !member?.memberType) {
        return
      }

      await mutation.mutateAsync({
        name: projectId,
        memberType: member.memberType,
        memberId: member.memberId,
        role: value.role as ProjectRoleType,
      })
      handleClose()
    },
  })

  // Sync form when member prop changes
  useEffect(() => {
    form.setFieldValue('role', member?.role ?? '')
  }, [form, member])

  const roleOptions = [
    {
      value: ProjectRoleType.ROLE_TYPE_PROJECT_ADMIN,
      label: t('projects.detail.membersPage.role.admin'),
    },
    {
      value: ProjectRoleType.ROLE_TYPE_PROJECT_EDITOR,
      label: t('projects.detail.membersPage.role.editor'),
    },
    {
      value: ProjectRoleType.ROLE_TYPE_PROJECT_VIEWER,
      label: t('projects.detail.membersPage.role.viewer'),
    },
  ]

  const handleClose = useCallback(() => {
    form.reset()
    onClose()
  }, [form, onClose])

  const canSubmit = useStore(form.store, s => s.canSubmit && !s.isSubmitting)
  const isSubmitting = useStore(form.store, s => s.isSubmitting)

  const handleConfirm = useCallback(() => {
    void form.handleSubmit()
  }, [form])

  return (
    <ModalWrapper
      opened={opened}
      onClose={handleClose}
      title={t('projects.detail.membersPage.editRoleModal.title')}
      confirmLoading={isSubmitting}
      onConfirm={canSubmit ? handleConfirm : undefined}
    >
      <Stack gap="md">
        <TextInput
          label={t('projects.detail.membersPage.editRoleModal.user')}
          value={member?.memberName ?? ''}
          disabled
        />
        <form.Field
          name="role"
          validators={{ onChange: requiredString }}
        >
          {field => (
            <Select
              label={t('projects.detail.membersPage.editRoleModal.roleType')}
              withAsterisk
              data={roleOptions}
              value={field.state.value || null}
              onChange={value => field.handleChange(value ?? '')}
              error={fieldError(field)}
            />
          )}
        </form.Field>
      </Stack>
    </ModalWrapper>
  )
}
