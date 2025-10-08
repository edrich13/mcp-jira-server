# Quick Start Guide - MCP Jira Server

## 🚀 Setup in 5 Minutes

### Step 1: Get Your Personal Access Token

1. Go to your Jira instance: **https://jira.domain.com**
2. Click your profile icon → **Profile** or **Account Settings**
3. Find **Personal Access Tokens** or **Security** section
4. Click **Create token**
5. Name it "MCP Server" and click **Create**
6. **Copy the token NOW** (you can't see it again!)

### Step 2: Configure Claude Desktop (Recommended)

1. **Find your config file:**
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Copy the example configuration:**
   ```bash
   # Open the example file
   cat /Users/username/mcp-jira-server/claude_desktop_config.example.json
   ```

3. **Edit your Claude config** and add the Jira server section
4. **Replace `your-personal-access-token-here`** with your actual token
5. **Update the path** if you installed the server elsewhere
6. **Restart Claude Desktop**

### Step 3: Test It!

Open Claude Desktop and try:

```
Show me all Jira projects
```

or

```
Get my current Jira user information
```

## 🔧 Alternative: VS Code Setup

1. Create `.vscode/mcp.json` in your project
2. Copy content from `vscode_mcp_config.example.json`
3. Replace the token and path
4. Restart VS Code

## ✅ Verify Installation

Once configured, you can:

1. **List projects:**
   ```
   List all my Jira projects
   ```

2. **Search issues:**
   ```
   Find all issues assigned to me that are open
   ```

3. **Create an issue:**
   ```
   Create a new task in project ABC with summary "Test MCP"
   ```

## 🐛 Troubleshooting

### "Server not found" or "Cannot connect"
- Verify the absolute path in your config is correct
- Make sure you ran `npm install` and `npm run build`
- Restart Claude Desktop or VS Code

### "Unauthorized" or "Authentication failed"
- Check your Personal Access Token is copied correctly
- Ensure the token hasn't expired
- Verify the JIRA_BASE_URL is correct (no trailing slash)

### "Cannot find module"
```bash
cd /Users/username/mcp-jira-server
npm install
npm run build
```

## 📚 Common JQL Queries

Once connected, you can search using JQL:

- `project = ABC AND status = Open`
- `assignee = currentUser() AND status != Done`
- `priority = High AND created >= -7d`
- `reporter = john.doe AND status IN (Open, "In Progress")`

## 🎯 Available Operations

- ✅ Get, create, update, delete issues
- ✅ Search with JQL
- ✅ Add comments
- ✅ Assign issues
- ✅ Transition statuses
- ✅ List projects and issue types
- ✅ View current user

## 💡 Example Prompts

Try these in Claude:

1. "Show me all high priority bugs in project XYZ"
2. "Create a new task in project ABC to update documentation"
3. "Add a comment to issue ABC-123 saying 'Fixed in latest release'"
4. "Update issue ABC-456 to set status to In Progress and assign to me"
5. "Search for all issues I reported in the last week"

## 🔐 Security Reminder

- Never commit your Personal Access Token to git
- Set token expiration dates
- Rotate tokens regularly
- Use minimal required permissions

---

**Need help?** Check the full README.md for detailed documentation.
