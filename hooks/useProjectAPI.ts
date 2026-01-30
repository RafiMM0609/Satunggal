interface Job {
  id: number;
  title: string;
  client: string;
  status: 'open' | 'pending' | 'in_progress' | 'done' | 'revision' | 'pending_review';
  deadline: string;
  reward: string;
  category: string;
  description?: string;
  freelancerId?: number;
  createdAt: string;
  updatedAt: string;
}

export function useProjectAPI() {
  const fetchAllJobs = async (): Promise<Job[]> => {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  };

  const fetchJobById = async (id: number): Promise<Job> => {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  };

  const takeProject = async (jobId: number, freelancerId: number): Promise<Job> => {
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'take', freelancerId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to take project');
    }
    return res.json();
  };

  const createProject = async (
    projectData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>,
    userId: number,
    userRole: string
  ): Promise<Job> => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, userId, userRole }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create project');
    }
    return res.json();
  };

  const updateJob = async (jobId: number, jobData: Partial<Job>): Promise<Job> => {
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
  };

  const deleteJob = async (jobId: number): Promise<void> => {
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete job');
  };

  return {
    fetchAllJobs,
    fetchJobById,
    takeProject,
    createProject,
    updateJob,
    deleteJob,
  };
}
