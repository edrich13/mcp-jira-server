# Changelog

All notable changes to the MCP Jira Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-10-08

### Added
- Initial public release to npm registry
- Complete Jira issue management through MCP
- Personal Access Token authentication for self-hosted Jira instances
- 12 comprehensive Jira tools for issue, project, and user management
- JQL (Jira Query Language) search capabilities
- Comment system for issue collaboration
- Graceful startup without requiring immediate configuration
- CLI binary support via `npx mcp-jira-server`
- Claude Desktop and VS Code integration support
- Comprehensive documentation and setup guides

### Features
- **Issue Management**: Create, read, update, delete, and search Jira issues
- **Project Management**: List projects, get project details, and issue types
- **Comment System**: Add and retrieve issue comments
- **User Management**: Assign issues and get current user information
- **Advanced Search**: Full JQL support with configurable result limits
- **Error Handling**: Robust error handling with clear error messages
- **Security**: Environment variable-based configuration

### Tools Available
- `jira_get_issue` - Retrieve issue details by key
- `jira_search_issues` - Search issues using JQL
- `jira_create_issue` - Create new issues
- `jira_update_issue` - Update existing issues  
- `jira_add_comment` - Add comments to issues
- `jira_get_comments` - Get all issue comments
- `jira_get_projects` - List all projects
- `jira_get_project` - Get project details
- `jira_get_issue_types` - Get available issue types
- `jira_assign_issue` - Assign issues to users
- `jira_delete_issue` - Delete issues
- `jira_get_current_user` - Get current user info

### Technical Details
- Built with TypeScript and Model Context Protocol SDK
- Package size: 11.4 kB compressed, 51.8 kB unpacked
- Node.js 18+ required
- MIT License

## [Unreleased]

### Planned Features
- Support for Jira Cloud instances
- Webhook integration
- Batch operations
- Custom field support
- Attachment management
- Advanced reporting features

---

## Release History

- **1.0.2** (2025-10-08) - Initial public release
- **1.0.1** (2025-10-08) - Pre-release version
- **1.0.0** (2025-10-08) - Development version