# MCP Jira Server - Release Notes

## 🚀 Version 1.0.2 - October 8, 2025

### 🎉 Initial Public Release

We're excited to announce the first public release of **MCP Jira Server** - A Model Context Protocol (MCP) server that brings powerful Jira integration to AI assistants like Claude Desktop and VS Code with GitHub Copilot.

### 📦 Package Information
- **npm Package**: `mcp-jira-server`
- **Version**: 1.0.2
- **License**: MIT
- **Bundle Size**: 11.4 kB compressed, 51.8 kB unpacked

### ✨ Key Features

#### 🔐 **Secure Authentication**
- **Personal Access Token (PAT)** authentication for self-hosted Jira instances
- Secure environment variable configuration
- No hardcoded credentials

#### 🛠️ **Complete Issue Management**
- **Create Issues**: Create new Jira issues with full metadata support
- **Read Issues**: Retrieve detailed issue information by key
- **Update Issues**: Modify existing issues (summary, description, assignee, priority, labels, status)
- **Delete Issues**: Permanently remove issues with proper permissions
- **Search Issues**: Powerful JQL (Jira Query Language) search capabilities

#### 💬 **Comment System**
- **Add Comments**: Post comments to any issue
- **Retrieve Comments**: Get all comments from an issue with full metadata

#### 👥 **User & Project Management**
- **Project Discovery**: List all available Jira projects
- **Project Details**: Get detailed information about specific projects
- **Issue Type Management**: Retrieve available issue types per project
- **User Assignment**: Assign issues to team members
- **Current User Info**: Get authenticated user details

#### 🔍 **Advanced Search**
- **JQL Support**: Full Jira Query Language support for complex searches
- **Flexible Results**: Configurable maximum results (default: 50)
- **Rich Metadata**: Complete issue data in search results

### 🚀 **Installation & Usage**

#### Quick Start
```bash
# Install and run immediately
npx mcp-jira-server

# Or install globally
npm install -g mcp-jira-server
mcp-jira-server
```

#### Integration Options
- **Claude Desktop**: Complete MCP server integration
- **VS Code**: GitHub Copilot extension support
- **Any MCP Client**: Standard Model Context Protocol compatibility

### 🔧 **Configuration**

#### Environment Variables
```bash
JIRA_BASE_URL="https://your-jira-instance.com"
JIRA_PAT="your-personal-access-token"
```

#### Claude Desktop Setup
```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["mcp-jira-server"],
      "env": {
        "JIRA_BASE_URL": "https://your-jira-instance.com",
        "JIRA_PAT": "your-personal-access-token"
      }
    }
  }
}
```

### 🛡️ **Robust Error Handling**
- **Graceful Startup**: Server starts even without configuration
- **Clear Error Messages**: Detailed feedback for missing credentials
- **API Error Handling**: Comprehensive Jira API error reporting
- **Configuration Validation**: Runtime validation of environment variables

### 📋 **Available Tools**

| Tool | Description | Required Parameters |
|------|-------------|-------------------|
| `jira_get_issue` | Get issue details by key | `issueKey` |
| `jira_search_issues` | Search issues using JQL | `jql`, `maxResults` (optional) |
| `jira_create_issue` | Create a new issue | `projectKey`, `summary`, `issueType` |
| `jira_update_issue` | Update existing issue | `issueKey` + update fields |
| `jira_add_comment` | Add comment to issue | `issueKey`, `comment` |
| `jira_get_comments` | Get all issue comments | `issueKey` |
| `jira_get_projects` | List all projects | None |
| `jira_get_project` | Get project details | `projectKey` |
| `jira_get_issue_types` | Get project issue types | `projectKey` |
| `jira_assign_issue` | Assign issue to user | `issueKey`, `assignee` |
| `jira_delete_issue` | Delete an issue | `issueKey` |
| `jira_get_current_user` | Get current user info | None |

### 🎯 **Use Cases**

#### For Development Teams
- **Sprint Planning**: Query backlog items and plan sprints with AI assistance
- **Bug Triaging**: Automatically categorize and assign bugs based on descriptions
- **Status Updates**: Get comprehensive project status reports
- **Documentation**: Generate reports from issue data

#### For Project Managers
- **Progress Tracking**: Monitor team progress across multiple projects
- **Resource Planning**: Analyze workload distribution
- **Reporting**: Create custom reports using JQL queries
- **Automation**: Automate routine issue management tasks

#### For QA Teams
- **Test Case Management**: Create and track test-related issues
- **Bug Reporting**: Streamlined bug creation with detailed information
- **Release Planning**: Track release-critical issues

### 🔄 **Integration Examples**

#### Natural Language Queries
```
"Show me all high-priority bugs assigned to John in the MOBILE project"
"Create a new story for user authentication in the WEB project"
"What are the current blockers for the next release?"
"Add a comment to PROJ-123 about the latest test results"
```

#### Automated Workflows
- **Daily Standups**: Get team's current work items
- **Release Planning**: Identify incomplete features
- **Bug Triage**: Categorize and prioritize new issues
- **Progress Reports**: Generate status summaries

### 🚦 **System Requirements**
- **Node.js**: 18.0.0 or higher
- **Jira**: Self-hosted instance with API access
- **Authentication**: Valid Personal Access Token
- **Network**: HTTPS access to Jira instance

### 🔗 **Links & Resources**
- **npm Package**: https://www.npmjs.com/package/mcp-jira-server
- **GitHub Repository**: https://github.com/edrich13/mcp-jira-server
- **Documentation**: See README.md for detailed setup instructions
- **Issue Tracker**: Report bugs and feature requests on GitHub

### 🙏 **Acknowledgments**
Built with the Model Context Protocol (MCP) SDK and designed for seamless integration with modern AI development workflows.

### 📝 **License**
MIT License - See LICENSE file for details

---

**Happy coding! 🎉**

*For support, questions, or feature requests, please visit our GitHub repository or contact the maintainer.*