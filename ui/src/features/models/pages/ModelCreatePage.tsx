import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { Projects, ProjectType } from '@matrixhub/api-ts/v1alpha1/project.pb'
import { IconInfoCircle } from '@tabler/icons-react'
import { useForm } from '@tanstack/react-form'
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  useEffect,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'

import { createModelMutationOptions } from '@/features/models/models.mutation'
import { createModelSchema } from '@/features/models/models.schema'

interface ModelCreatePageProps {
  initialProjectId?: string
}

interface ProjectOption {
  value: string
  label: string
  isPublic: boolean
}

export function ModelCreatePage({ initialProjectId = '' }: ModelCreatePageProps) {
  const { t } = useTranslation()
  const routeApi = getRouteApi('/(auth)/(app)/models/')
  const navigate = routeApi.useNavigate()
  const createMutation = useMutation(createModelMutationOptions())

  const { data: projects = [] } = useQuery({
    queryKey: ['ModelCreate.ListProjects'],
    queryFn: async () => {
      const response = await Projects.ListProjects({})

      return response.projects ?? []
    },
  })

  const projectOptions = useMemo<ProjectOption[]>(() => {
    return projects
      .map((project) => {
        const projectName = project.name?.trim()

        if (!projectName) {
          return null
        }

        return {
          value: projectName,
          label: projectName,
          isPublic: project.type === ProjectType.PROJECT_TYPE_PUBLIC,
        }
      })
      .filter((option): option is ProjectOption => option !== null)
  }, [projects])

  const modelCreateSchema = createModelSchema(t)

  const form = useForm({
    defaultValues: {
      name: '',
      projectId: initialProjectId?.trim(),
    },
    validators: {
      onChange: modelCreateSchema,
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        name: value.name,
        project: value.projectId,
      })

      // FIXME: confirm which page to navigate after creation
      void navigate({})
    },
  })

  useEffect(() => {
    const selectedProjectId = form.state.values.projectId

    if (projectOptions.length === 0
      || (selectedProjectId && projectOptions.find(option => option.value === selectedProjectId))) {
      return
    }

    form.setFieldValue('projectId', projectOptions[0]?.value ?? '')
  }, [form, projectOptions])

  return (
    <Stack
      w="100%"
      maw={640}
      pt={20}
      gap="lg"
    >
      <Title order={3}>{t('model.new')}</Title>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <Stack gap="md">
          <form.Field name="name">
            {field => (
              <TextInput
                label={t('model.create.modelName')}
                withAsterisk
                placeholder={t('model.create.modelNamePlaceholder')}
                description={t('model.create.modelNameHelper')}
                value={field.state.value}
                error={field.state.meta.errors[0]?.message?.toString()}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.currentTarget.value)}
              />
            )}
          </form.Field>

          <form.Field name="projectId">
            {field => (
              <Select
                label={(
                  <Group
                    component="span"
                    gap={6}
                    align="center"
                    wrap="nowrap"
                    style={{ display: 'inline-flex' }}
                  >
                    <Text size="sm" fw={500}>{t('model.create.project')}</Text>
                    <Tooltip label={t('model.create.projectTooltip')}>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        color="gray"
                      >
                        <IconInfoCircle size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                )}
                withAsterisk
                placeholder={t('model.create.projectPlaceholder')}
                value={field.state.value || null}
                error={field.state.meta.errors[0]?.message?.toString()}
                data={projectOptions}
                allowDeselect={false}
                renderOption={({ option }) => {
                  const currentOption = option as ProjectOption

                  return (
                    <Group gap={8} wrap="nowrap">
                      <Text size="sm">{currentOption.label}</Text>
                      <Badge size="xs" variant="light" color={currentOption.isPublic ? 'green' : 'gray'}>
                        {currentOption.isPublic ? t('projects.type.public') : t('projects.type.private')}
                      </Badge>
                    </Group>
                  )
                }}
                onBlur={field.handleBlur}
                onChange={value => field.handleChange(value ?? '')}
              />
            )}
          </form.Field>

          <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting, s.isPristine]}>
            {([canSubmit, isSubmitting, isPristine]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isPristine}
                loading={isSubmitting}
              >
                {t('model.create.submit')}
              </Button>
            )}
          </form.Subscribe>

          <Text size="sm" c="dimmed">{t('model.create.uploadTip')}</Text>
        </Stack>
      </form>
    </Stack>
  )
}

export default ModelCreatePage
