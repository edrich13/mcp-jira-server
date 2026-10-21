# MCP Jira Server for Self-Hosted Jira

A Model Context Protocol (MCP) server for interacting with self-hosted Jira instances. It supports Basic authentication for Jira 7 and PAT authentication for Jira Server/Data Center 8.14 or later.

## Features

- ✅ Basic authentication for legacy Jira Server
- ✅ Personal Access Token authentication for Jira Server/Data Center 8.14 or later
- ✅ Create, read, update, and delete Jira issues
- ✅ Search issues using JQL (Jira Query Language)
- ✅ Add and view comments
- ✅ Manage issue assignments
- ✅ List projects and issue types
- ✅ Transition issues between statuses
- ✅ Get current user information

## Prerequisites

- Node.js 18 or higher
- A self-hosted Jira instance (e.g., https://jira.domain.com)
- For Jira 7: a Jira username and password (prefer a dedicated service account over a personal account)
- For Jira Server/Data Center 8.14 or later: a Personal Access Token (PAT)

## Authentication

The server supports both authentication methods and selects one through `JIRA_AUTH_TYPE`: use Basic authentication over HTTPS with a dedicated service account for Jira 7, and use a Personal Access Token (PAT) for Jira Server/Data Center 8.14 or later. Set `JIRA_AUTH_TYPE=basic` with `JIRA_USERNAME` and `JIRA_PASSWORD`, or `JIRA_AUTH_TYPE=pat` with `JIRA_PAT`.

Basic authentication can be blocked by SSO, CAPTCHA, or a reverse proxy policy; in that case configure an approved API access path with your Jira administrator.

### Creating a Personal Access Token (Jira 8.14+)

1. Log in to your Jira instance (e.g., https://jira.domain.com)
2. Click on your profile icon in the top right corner
3. Select **"Profile"** or **"Account Settings"**
4. Navigate to **"Personal Access Tokens"** or **"Security"**
5. Click **"Create token"**
6. Give your token a name (e.g., "MCP Server")
7. Set an expiration date (optional but recommended)
8. Click **"Create"**
9. **Copy the token immediately** - you won't be able to see it again!

## Installation

### Build this adapted copy

The Jira 7 changes in this copy have not been published to npm. Build this source folder before configuring the MCP client:

```bash
npm ci
npm run build
```

Use the absolute path to this copy's `build/index.js` in the client configuration below.

## Configuration

### For Claude Desktop

Add the following to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

For Jira 7, configure Basic authentication:

```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/mike/work/parabit/dev/mcp-jira-server/build/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://jira.domain.com",
        "JIRA_AUTH_TYPE": "basic",
        "JIRA_USERNAME": "jira-service-account",
        "JIRA_PASSWORD": "your-password"
      }
    }
  }
}
```

For Jira Server/Data Center 8.14 or later, replace the authentication variables with PAT:

```json
{
  "mcpServers": {
    "jira": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/mike/work/parabit/dev/mcp-jira-server/build/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://jira.domain.com",
        "JIRA_AUTH_TYPE": "pat",
        "JIRA_PAT": "your-personal-access-token"
      }
    }
  }
}
```

### For VS Code with MCP

Create or update `.vscode/mcp.json` in your workspace:

For Jira 7, configure Basic authentication:

```json
{
  "servers": {
    "jira": {
      "command": "node",
      "args": ["/Users/mike/work/parabit/dev/mcp-jira-server/build/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://jira.domain.com",
        "JIRA_AUTH_TYPE": "basic",
        "JIRA_USERNAME": "jira-service-account",
        "JIRA_PASSWORD": "your-password"
      }
    }
  }
}
```

For Jira Server/Data Center 8.14 or later, use PAT instead:

```json
{
  "servers": {
    "jira": {
      "command": "node",
      "args": ["/Users/mike/work/parabit/dev/mcp-jira-server/build/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://jira.domain.com",
        "JIRA_AUTH_TYPE": "pat",
        "JIRA_PAT": "your-personal-access-token"
      }
    }
  }
}
```

### Environment Variables

- `JIRA_BASE_URL`: The base URL of your self-hosted Jira instance (e.g., `https://jira.domain.com`)
- `JIRA_AUTH_TYPE`: `basic` for Jira 7 or `pat` for Jira Server/Data Center 8.14+. Set it explicitly when both credential sets are configured. If omitted, the server infers the method from available credentials, checking Basic credentials first.
- `JIRA_USERNAME` and `JIRA_PASSWORD`: Required for Basic authentication.
- `JIRA_PAT`: Required for PAT authentication (Jira Server/Data Center 8.14+).
- `JIRA_USER_AGENT` (optional): Custom User-Agent header for Jira instances behind reverse proxies that filter requests by User-Agent.

## Available Tools

### 1. `jira_get_issue`

Get details of a specific Jira issue by its key.

**Parameters:**

- `issueKey` (string, required): The Jira issue key (e.g., "PROJ-123")

**Example:**

```
Get details for issue PROJ-123
```

### 2. `jira_search_issues`

Search for Jira issues using JQL (Jira Query Language).

**Parameters:**

- `jql` (string, required): JQL query string
- `maxResults` (number, optional): Maximum number of results (default: 50)

**Example:**

```
Search for all open issues in project PROJ assigned to me
```

**Common JQL Examples:**

- `project = PROJ AND status = Open`
- `assignee = currentUser() AND status != Done`
- `priority = High AND created >= -7d`
- `reporter = john.doe AND status IN (Open, "In Progress")`

### 3. `jira_create_issue`

Create a new Jira issue.

**Parameters:**

- `projectKey` (string, required): Project key
- `summary` (string, required): Issue title/summary
- `issueType` (string, required): Issue type (e.g., "Bug", "Task", "Story")
- `description` (string, optional): Detailed description
- `priority` (string, optional): Priority level (e.g., "High", "Medium", "Low")
- `assignee` (string, optional): Username to assign to
- `labels` (array, optional): Array of labels
- `components` (array, optional): Array of component names
- Custom fields: Any additional parameters prefixed with `customfield_` (e.g., `customfield_10001`)

**Example:**

```
Create a new bug in project PROJ with summary "Login page not loading" and high priority
```

**Custom Fields Example:**

```
Create a story in PROJ with custom field customfield_10001 set to "Sprint 1"
```

### 4. `jira_update_issue`

Update an existing Jira issue.

**Parameters:**

- `issueKey` (string, required): Issue key to update
- `summary` (string, optional): New summary
- `description` (string, optional): New description
- `assignee` (string, optional): New assignee username
- `priority` (string, optional): New priority
- `labels` (array, optional): New labels array
- `status` (string, optional): New status (e.g., "In Progress", "Done")
- Custom fields: Any additional parameters prefixed with `customfield_` (e.g., `customfield_10002`)

**Example:**

```
Update issue PROJ-123 to set status to "In Progress" and assign to john.doe
```

### 5. `jira_add_comment`

Add a comment to a Jira issue.

**Parameters:**

- `issueKey` (string, required): Issue key
- `comment` (string, required): Comment text

**Example:**

```
Add a comment to PROJ-123 saying "Fixed in latest deployment"
```

### 6. `jira_get_comments`

Get all comments from a Jira issue.

**Parameters:**

- `issueKey` (string, required): Issue key

### 7. `jira_get_projects`

List all available Jira projects.

**Parameters:** None

**Example:**

```
List all Jira projects
```

### 8. `jira_get_project`

Get details of a specific project.

**Parameters:**

- `projectKey` (string, required): Project key

### 9. `jira_get_issue_types`

Get available issue types for a project.

**Parameters:**

- `projectKey` (string, required): Project key

### 10. `jira_assign_issue`

Assign a Jira issue to a user.

**Parameters:**

- `issueKey` (string, required): Issue key
- `assignee` (string, required): Username to assign to

### 11. `jira_delete_issue`

Delete a Jira issue permanently.

**Parameters:**

- `issueKey` (string, required): Issue key to delete

**⚠️ Warning:** This action is permanent and cannot be undone.

### 12. `jira_get_current_user`

Get information about the currently authenticated user.

**Parameters:** None

## Development

### Build the server

```bash
npm run build
```

### Watch mode for development

```bash
npm run watch
```

### Run in development mode

```bash
npm run dev
```

## Testing the Server

After configuring the server, restart Claude Desktop or VS Code to load the new MCP server.

### Quick Test Commands

1. **Test authentication:**

   ```
   Get my current Jira user information
   ```

2. **List projects:**

   ```
   Show me all Jira projects
   ```

3. **Search for issues:**

   ```
   Search for all issues assigned to me that are not done
   ```

4. **Create an issue:**
   ```
   Create a new task in project PROJ with summary "Test MCP integration"
   ```

## Troubleshooting

### Server not connecting

- Verify the absolute path in your configuration
- Ensure the server is built (`npm run build`)
- Check that environment variables are set correctly
- Restart Claude Desktop or VS Code after configuration changes

### Authentication errors

- For Basic authentication, verify `JIRA_USERNAME` and `JIRA_PASSWORD` and confirm the account can log in to Jira.
- For PAT authentication, verify `JIRA_PAT` is still valid, has not expired, and has the required permissions.
- Confirm `JIRA_AUTH_TYPE` matches the credentials you configured (`basic` or `pat`).
- Verify the JIRA_BASE_URL is correct (no trailing slash)

### API errors

- Check Jira server logs for detailed error messages
- Verify the Jira API is accessible from your machine
- Ensure your user account has necessary permissions
- Try accessing the REST API directly: `https://jira.domain.com/rest/api/2/myself`

### Common issues

- **"Cannot find module"**: Run `npm install` and `npm run build`
- **"Connection refused"**: Check if Jira server is accessible and URL is correct
- **"Unauthorized"**: Verify the configured authentication method and credentials. Jira 7 requires Basic authentication unless an external authentication plugin provides another method.
- **"Issue type not found"**: Use `jira_get_issue_types` to see valid types for the project
- **API requests redirect to SSO login**: Your Jira may be behind a reverse proxy (oauth2-proxy, nginx) that filters by User-Agent. Set `JIRA_USER_AGENT` environment variable to a whitelisted User-Agent string. Contact your system administrator to get the allowed User-Agent value.

## Security Best Practices

1. **Never commit passwords or Personal Access Tokens** to version control.
2. Store credentials securely and restrict access to configuration files.
3. Use a dedicated service account with minimal required permissions.
4. For Jira 7, use HTTPS for Basic authentication and follow your organization's password rotation policy.
5. For PAT-enabled Jira versions, set token expirations and rotate tokens regularly.
6. Monitor authentication activity in Jira and reverse-proxy audit logs.

## API Reference

This MCP server uses the Jira REST API v2. For more information about Jira's API:

- Jira REST API documentation: `https://your-jira-instance/rest/api/2/`
- JQL syntax guide: Check your Jira instance documentation

## License

MIT

## Support

For issues related to:

- **MCP Server**: Check the logs in Claude Desktop or VS Code
- **Jira API**: Refer to your self-hosted Jira documentation
- **Authentication**: Contact your Jira administrator

## Contributing

Contributions are welcome! Please ensure:

- Code follows TypeScript best practices
- All tools are properly documented
- Error handling is comprehensive
- Security best practices are followed
