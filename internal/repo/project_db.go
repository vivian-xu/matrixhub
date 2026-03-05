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

package repo

import (
	"context"

	"gorm.io/gorm"

	"github.com/matrixhub-ai/matrixhub/internal/domain/project"
	"github.com/matrixhub-ai/matrixhub/internal/domain/role"
)

type ProjectDBRepo struct {
	db *gorm.DB
}

func (r *ProjectDBRepo) GetProjectByName(ctx context.Context, name string) (*project.Project, error) {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) ListProjects(ctx context.Context, name string, projectType project.ProjectType, managedOnly bool, page, pageSize int) ([]*project.Project, int64, error) {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) UpdateProject(ctx context.Context, project *project.Project) error {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) DeleteProject(ctx context.Context, name int) error {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) ListProjectMembers(ctx context.Context, projectID int, memberName string, page, pageSize int) ([]*project.ProjectMember, int64, error) {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) AddProjectMemberWithRole(ctx context.Context, projectMember *project.ProjectMember) error {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) RemoveProjectMembers(ctx context.Context, projectID int, members []*project.Member) error {
	// TODO implement me
	panic("implement me")
}

func (r *ProjectDBRepo) UpdateProjectMemberRole(ctx context.Context, projectID int, memberID string, role role.RoleType) error {
	// TODO implement me
	panic("implement me")
}

var _ project.IProjectRepo = (*ProjectDBRepo)(nil)

func NewProjectDBRepo(db *gorm.DB) *ProjectDBRepo {
	return &ProjectDBRepo{db}
}

func (r *ProjectDBRepo) GetProject(ctx context.Context, param *project.Project) (*project.Project, error) {
	dbWithCtx := r.db.WithContext(ctx)
	output := &project.Project{}
	err := dbWithCtx.Where(param).First(output).Error
	return output, err
}

func (r *ProjectDBRepo) CreateProject(ctx context.Context, param *project.Project) error {
	dbWithCtx := r.db.WithContext(ctx)
	return dbWithCtx.Create(param).Error
}
