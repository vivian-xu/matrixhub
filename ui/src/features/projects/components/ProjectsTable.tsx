import {
  Anchor,
  Badge,
  Button,
  Text,
} from '@mantine/core'
import { ProjectType } from '@matrixhub/api-ts/v1alpha1/project.pb'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DataTable, type TableProps } from '@/shared/components/DataTable'
import { formatDateTime } from '@/shared/utils/date'

import type { Project } from '@matrixhub/api-ts/v1alpha1/project.pb'
import type { MRT_ColumnDef } from 'mantine-react-table'

function isPublicProject(type?: ProjectType) {
  return type === ProjectType.PROJECT_TYPE_PUBLIC
}

type ProjectCellProps = Parameters<NonNullable<MRT_ColumnDef<Project>['Cell']>>[0]

function ProjectNameCell({ row }: ProjectCellProps) {
  const name = row.original.name

  if (!name) {
    return <Text fw={600}>-</Text>
  }

  return (
    <Anchor
      fw={600}
      underline="never"
      renderRoot={props => (
        <Link
          {...props}
          to="/projects/$projectId"
          params={{ projectId: name }}
        />
      )}
    >
      {name}
    </Anchor>
  )
}

function ProjectVisibilityCell({ row }: ProjectCellProps) {
  const { t } = useTranslation()
  const isPublic = isPublicProject(row.original.type)

  return (
    <Badge
      color={isPublic ? 'green' : 'gray'}
      variant="light"
    >
      {isPublic
        ? t('routes.projects.visibility.public')
        : t('routes.projects.visibility.private')}
    </Badge>
  )
}

function ProjectProxyCell({ row }: ProjectCellProps) {
  const { t } = useTranslation()

  return (
    <Text size="sm">
      {row.original.enabledRegistry
        ? t('routes.projects.boolean.yes')
        : t('routes.projects.boolean.no')}
    </Text>
  )
}

function ProjectActionsCell({
  row,
  table,
}: ProjectCellProps) {
  const { t } = useTranslation()
  const onDelete = (
    table.options.meta as { onDelete?: (project: Project) => void } | undefined
  )?.onDelete

  return (
    <Button
      variant="subtle"
      color="red"
      size="compact-sm"
      onClick={() => onDelete?.(row.original)}
    >
      {t('routes.projects.actions.delete')}
    </Button>
  )
}

export function ProjectsTable({
  records,
  pagination,
  page,
  loading,
  searchValue,
  onSearchChange,
  onRefresh,
  onDelete,
  onBatchDelete,
  rowSelection,
  onRowSelectionChange,
  onPageChange,
  selectedCount,
  toolbarExtra,
}: TableProps<Project>) {
  const { t } = useTranslation()

  const columns = useMemo<MRT_ColumnDef<Project>[]>(() => [
    {
      accessorKey: 'name',
      header: t('routes.projects.table.name'),
      Cell: ProjectNameCell,
    },
    {
      id: 'type',
      enableSorting: false,
      header: t('routes.projects.table.visibility'),
      Cell: ProjectVisibilityCell,
    },
    {
      id: 'enabledRegistry',
      enableSorting: false,
      header: t('routes.projects.table.proxy'),
      Cell: ProjectProxyCell,
    },
    {
      accessorKey: 'modelCount',
      header: t('routes.projects.table.modelCount'),
    },
    {
      accessorKey: 'datasetCount',
      header: t('routes.projects.table.datasetCount'),
    },
    {
      id: 'updatedAt',
      header: t('routes.projects.table.updatedAt'),
      accessorFn: row => formatDateTime(row.updatedAt),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: t('routes.projects.table.actions'),
      Cell: ProjectActionsCell,
    },
  ], [t])

  return (
    <DataTable
      data={records}
      columns={columns}
      pagination={pagination}
      page={page}
      loading={loading}
      emptyTitle={t('routes.projects.table.empty')}
      searchPlaceholder={t('routes.projects.searchPlaceholder')}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onRefresh={onRefresh}
      onBatchDelete={onBatchDelete}
      selectedCount={selectedCount}
      toolbarExtra={toolbarExtra}
      onPageChange={onPageChange}
      enableRowSelection
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      getRowId={row => String(row.name)}
      tableOptions={{
        enableBatchRowSelection: true,
        enableMultiRowSelection: true,
        meta: { onDelete },
      }}
    />
  )
}
