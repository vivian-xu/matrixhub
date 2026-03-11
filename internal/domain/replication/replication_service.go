// Copyright The MatrixHub Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package replication

import (
	"context"

	"github.com/matrixhub-ai/matrixhub/internal/domain/syncjob"
	"github.com/matrixhub-ai/matrixhub/internal/infra/log"
)

type IReplicationService interface {
	GetReplicationRule(ctx context.Context, param *ReplicationRule) (*ReplicationRule, error)
	CreateReplicationRule(ctx context.Context, param *ReplicationRule) error
	UpdateReplicationRule(ctx context.Context, param *ReplicationRule) error
	DeleteReplicationRule(ctx context.Context, param *ReplicationRule) error
	GetReplicationTask(ctx context.Context, param *ReplicationTask) (*ReplicationTask, error)
	CreateReplicationTask(ctx context.Context, param *ReplicationTask) (*ReplicationTask, error)
	CreateReplicationTaskAndSyncJobs(ctx context.Context, param *ReplicationRule) error
	CreateExcecuteReplicationTaskAndSyncJobs(ctx context.Context, param *ReplicationRule) error
}

type ReplicationService struct {
	replicationRuleRepo IReplicationRuleRepo
	replicationTaskRepo IReplicationTaskRepo
	syncJobService      syncjob.ISyncJobService
}

func NewReplicationService(rrrepo IReplicationRuleRepo, rtrepo IReplicationTaskRepo, sjservice syncjob.ISyncJobService) IReplicationService {
	return &ReplicationService{
		replicationRuleRepo: rrrepo,
		replicationTaskRepo: rtrepo,
		syncJobService:      sjservice,
	}
}

func (rt *ReplicationService) GetReplicationRule(ctx context.Context, param *ReplicationRule) (*ReplicationRule, error) {
	return rt.replicationRuleRepo.GetReplicationRule(ctx, param)
}

func (rt *ReplicationService) CreateReplicationRule(ctx context.Context, param *ReplicationRule) error {
	return rt.replicationRuleRepo.CreateReplicationRule(ctx, param)
}
func (rt *ReplicationService) UpdateReplicationRule(ctx context.Context, param *ReplicationRule) error {
	return rt.replicationRuleRepo.UpdateReplicationRule(ctx, param)
}

func (rt *ReplicationService) DeleteReplicationRule(ctx context.Context, param *ReplicationRule) error {
	return rt.replicationRuleRepo.DeleteReplicationRule(ctx, param)
}
func (rt *ReplicationService) GetReplicationTask(ctx context.Context, replicationTask *ReplicationTask) (*ReplicationTask, error) {
	return rt.replicationTaskRepo.GetReplicationTask(ctx, replicationTask)
}

func (rt *ReplicationService) CreateReplicationTask(ctx context.Context, replicationTask *ReplicationTask) (*ReplicationTask, error) {
	return rt.replicationTaskRepo.CreateReplicationTask(ctx, replicationTask)
}

func (rt *ReplicationService) CreateReplicationTaskAndSyncJobs(ctx context.Context, rule *ReplicationRule) error {
	task, jobs, err := rt.replicationRuleRepo.GenerateReplicationTaskAndSyncJobs(ctx, rule)
	if err != nil {
		return err
	}
	task, err = rt.replicationTaskRepo.CreateReplicationTask(ctx, task)
	if err != nil {
		return err
	}
	for _, job := range jobs {
		job.ReplicationTaskID = task.ID
		if err := rt.syncJobService.CreateSyncJob(ctx, job); err != nil {
			log.Infow("CreateSyncJob failed", "error", err)
		}
	}
	return nil
}

func (rt *ReplicationService) CreateExcecuteReplicationTaskAndSyncJobs(ctx context.Context, rule *ReplicationRule) error {
	task, jobs, err := rt.replicationRuleRepo.GenerateReplicationTaskAndSyncJobs(ctx, rule)
	if err != nil {
		return err
	}
	task, err = rt.replicationTaskRepo.CreateReplicationTask(ctx, task)
	if err != nil {
		return err
	}
	for _, job := range jobs {
		job.ReplicationTaskID = task.ID
		if err := rt.syncJobService.CreateAndExcecuteSyncJob(ctx, job); err != nil {
			log.Infow("CreateAndExcecuteSyncJob failed", "error", err)
		}
	}
	return nil
}
