import { Button, Space } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { getRouteApi } from '@tanstack/react-router'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { AddMemberModal } from '../components/AddMemberModal'
import { EditRoleModal } from '../components/EditRoleModal'
import { MembersTable } from '../components/MembersTable'
import { RemoveMemberModal } from '../components/RemoveMemberModal'
import { useMembers } from '../members.query'

import type { ProjectMember } from '@matrixhub/api-ts/v1alpha1/project.pb'
import type { MRT_RowSelectionState } from 'mantine-react-table'

const membersRouteApi = getRouteApi('/(auth)/(app)/projects/$projectId/members/')

export function ProjectMembersPage() {
  const { t } = useTranslation()
  const { projectId } = membersRouteApi.useParams()
  const navigate = membersRouteApi.useNavigate()
  const search = membersRouteApi.useSearch()

  const {
    data, isLoading, refetch,
  } = useMembers(projectId, {
    q: search.q,
    page: search.page,
  })

  const members = useMemo(() => data?.members ?? [], [data?.members])
  const pagination = data?.pagination

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  // Modal states
  const [addOpened, addHandlers] = useDisclosure(false)
  const [editOpened, editHandlers] = useDisclosure(false)
  const [removeOpened, removeHandlers] = useDisclosure(false)
  const [batchRemoveOpened, batchRemoveHandlers] = useDisclosure(false)

  const [processMember, setProcessMember] = useState<ProjectMember | null>(null)

  const handleSearchChange = useCallback((value: string) => {
    if (value === search.q) {
      return
    }

    setRowSelection({})
    void navigate({
      replace: true,
      search: prev => ({
        ...prev,
        page: 1,
        q: value,
      }),
    })
  }, [navigate, search.q])

  const handlePageChange = useCallback((page: number) => {
    setRowSelection({})
    void navigate({
      search: prev => ({
        ...prev,
        page,
      }),
    })
  }, [navigate])

  const handleRefresh = useCallback(() => {
    setRowSelection({})
    void refetch()
  }, [refetch])

  const selectedMembers = useMemo(
    () => members.filter((m) => {
      const key = `${m.memberType}:${m.memberId}`

      return !!rowSelection[key]
    }),
    [members, rowSelection],
  )

  const handleEditMember = useCallback((member: ProjectMember) => {
    setProcessMember(member)
    editHandlers.open()
  }, [editHandlers])

  const handleRemoveMember = useCallback((member: ProjectMember) => {
    setProcessMember(member)
    removeHandlers.open()
  }, [removeHandlers])

  const handleBatchRemove = useCallback(() => {
    if (selectedMembers.length === 0) {
      return
    }
    batchRemoveHandlers.open()
  }, [selectedMembers.length, batchRemoveHandlers])

  const handleBatchRemoveClose = useCallback(() => {
    batchRemoveHandlers.close()
    setRowSelection({})
  }, [batchRemoveHandlers])

  const handleRemoveClose = useCallback(() => {
    removeHandlers.close()
    setRowSelection({})
  }, [removeHandlers])

  return (
    <>
      <Space h="lg" />
      <MembersTable
        records={members}
        pagination={pagination}
        page={search.page}
        loading={isLoading}
        searchValue={search.q}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onEditRole={handleEditMember}
        onRemove={handleRemoveMember}
        onBatchDelete={handleBatchRemove}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onPageChange={handlePageChange}
        selectedCount={selectedMembers.length}
        toolbarExtra={(
          <Button
            leftSection={<IconPlus width={16} height={16} />}
            onClick={addHandlers.open}
          >
            {t('projects.detail.membersPage.addMember')}
          </Button>
        )}
      />

      <AddMemberModal
        opened={addOpened}
        onClose={addHandlers.close}
        projectId={projectId}
      />

      <EditRoleModal
        opened={editOpened}
        onClose={editHandlers.close}
        projectId={projectId}
        member={processMember}
      />

      <RemoveMemberModal
        opened={removeOpened}
        onClose={handleRemoveClose}
        projectId={projectId}
        member={processMember}
      />

      <RemoveMemberModal
        opened={batchRemoveOpened}
        onClose={handleBatchRemoveClose}
        projectId={projectId}
        members={selectedMembers}
      />
    </>
  )
}
