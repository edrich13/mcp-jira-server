import axios, { AxiosInstance } from 'axios';

export interface JiraConfig {
  baseUrl: string;
  personalAccessToken: string;
}

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
    };
    issuetype: {
      name: string;
    };
    priority?: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    reporter?: {
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    [key: string]: any;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls?: {
    '48x48'?: string;
  };
}

export interface CreateIssueInput {
  projectKey: string;
  summary: string;
  description?: string;
  issueType: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  components?: string[];
}

export interface UpdateIssueInput {
  summary?: string;
  description?: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  status?: string;
}

export interface JiraComment {
  id: string;
  body: string;
  author: {
    displayName: string;
    emailAddress: string;
  };
  created: string;
  updated: string;
}

export class JiraClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: JiraConfig) {
    this.baseUrl = config.baseUrl;
    
    this.client = axios.create({
      baseURL: `${config.baseUrl}/rest/api/2`,
      headers: {
        'Authorization': `Bearer ${config.personalAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    const response = await this.client.get(`/issue/${issueKey}`);
    return response.data;
  }

  async searchIssues(jql: string, maxResults: number = 50): Promise<JiraIssue[]> {
    const response = await this.client.post('/search', {
      jql,
      maxResults,
      fields: ['summary', 'status', 'assignee', 'reporter', 'priority', 'issuetype', 'created', 'updated', 'description']
    });
    return response.data.issues;
  }

  async createIssue(input: CreateIssueInput): Promise<JiraIssue> {
    const issueData: any = {
      fields: {
        project: {
          key: input.projectKey
        },
        summary: input.summary,
        issuetype: {
          name: input.issueType
        }
      }
    };

    if (input.description) {
      issueData.fields.description = input.description;
    }

    if (input.priority) {
      issueData.fields.priority = { name: input.priority };
    }

    if (input.assignee) {
      issueData.fields.assignee = { name: input.assignee };
    }

    if (input.labels && input.labels.length > 0) {
      issueData.fields.labels = input.labels;
    }

    if (input.components && input.components.length > 0) {
      issueData.fields.components = input.components.map(c => ({ name: c }));
    }

    const response = await this.client.post('/issue', issueData);
    return await this.getIssue(response.data.key);
  }

  async updateIssue(issueKey: string, input: UpdateIssueInput): Promise<JiraIssue> {
    const updateData: any = {
      fields: {}
    };

    if (input.summary) {
      updateData.fields.summary = input.summary;
    }

    if (input.description !== undefined) {
      updateData.fields.description = input.description;
    }

    if (input.assignee) {
      updateData.fields.assignee = { name: input.assignee };
    }

    if (input.priority) {
      updateData.fields.priority = { name: input.priority };
    }

    if (input.labels) {
      updateData.fields.labels = input.labels;
    }

    await this.client.put(`/issue/${issueKey}`, updateData);

    // Handle status transition separately if provided
    if (input.status) {
      await this.transitionIssue(issueKey, input.status);
    }

    return await this.getIssue(issueKey);
  }

  async transitionIssue(issueKey: string, statusName: string): Promise<void> {
    // Get available transitions
    const transitionsResponse = await this.client.get(`/issue/${issueKey}/transitions`);
    const transitions = transitionsResponse.data.transitions;

    // Find the transition that matches the desired status
    const transition = transitions.find((t: any) => 
      t.to.name.toLowerCase() === statusName.toLowerCase()
    );

    if (!transition) {
      throw new Error(`No transition found to status: ${statusName}`);
    }

    await this.client.post(`/issue/${issueKey}/transitions`, {
      transition: {
        id: transition.id
      }
    });
  }

  async addComment(issueKey: string, comment: string): Promise<JiraComment> {
    const response = await this.client.post(`/issue/${issueKey}/comment`, {
      body: comment
    });
    return response.data;
  }

  async getComments(issueKey: string): Promise<JiraComment[]> {
    const response = await this.client.get(`/issue/${issueKey}/comment`);
    return response.data.comments;
  }

  async getProjects(): Promise<JiraProject[]> {
    const response = await this.client.get('/project');
    return response.data;
  }

  async getProject(projectKey: string): Promise<JiraProject> {
    const response = await this.client.get(`/project/${projectKey}`);
    return response.data;
  }

  async getIssueTypes(projectKey: string): Promise<any[]> {
    const response = await this.client.get(`/project/${projectKey}`);
    return response.data.issueTypes || [];
  }

  async assignIssue(issueKey: string, assignee: string): Promise<void> {
    await this.client.put(`/issue/${issueKey}/assignee`, {
      name: assignee
    });
  }

  async deleteIssue(issueKey: string): Promise<void> {
    await this.client.delete(`/issue/${issueKey}`);
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/myself');
    return response.data;
  }
}
