import {
  type MemberToRemove,
  type MemberType,
  Projects,
} from '@matrixhub/api-ts/v1alpha1/project.pb'
import { mutationOptions } from '@tanstack/react-query'

import { memberKeys } from './members.query'

import type { ProjectRoleType } from '@matrixhub/api-ts/v1alpha1/role.pb'

export function addMemberMutationOptions() {
  return mutationOptions({
    mutationFn: (input: {
      name: string
      memberType: MemberType
      memberId: string
      role: ProjectRoleType
    }) => Projects.AddProjectMemberWithRole(input),
    meta: {
      invalidates: [memberKeys.lists()],
    },
  })
}

export function updateMemberRoleMutationOptions() {
  return mutationOptions({
    mutationFn: (input: {
      name: string
      memberType: MemberType
      memberId: string
      role: ProjectRoleType
    }) => Projects.UpdateProjectMemberRole(input),
    meta: {
      invalidates: [memberKeys.lists()],
    },
  })
}

export function removeMembersMutationOptions() {
  return mutationOptions({
    mutationFn: (input: {
      name: string
      members: MemberToRemove[]
    }) => Projects.RemoveProjectMembers(input),
    meta: {
      invalidates: [memberKeys.lists()],
    },
  })
}
