import axios from 'axios';
import { JiraClient, JiraIssue } from './jira-client.js';

const baseUrl = process.env.JIRA_BASE_URL;
const personalAccessToken = process.env.JIRA_PAT;
const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK;
const projectKey = process.env.JIRA_PROJECT_KEY ?? 'SAYDI';

const missingSecrets = [
  ['JIRA_BASE_URL', baseUrl],
  ['JIRA_PAT', personalAccessToken],
  ['GOOGLE_CHAT_WEBHOOK', webhookUrl],
].filter(([, value]) => !value).map(([name]) => name);

if (missingSecrets.length > 0) {
  throw new Error(`Missing GitHub Actions secret(s): ${missingSecrets.join(', ')}. Add them as repository secrets, or configure the workflow environment that contains them.`);
}

const configuredBaseUrl = baseUrl!;
const configuredPersonalAccessToken = personalAccessToken!;
const configuredWebhookUrl = webhookUrl!;

const jira = new JiraClient({
  baseUrl: configuredBaseUrl,
  personalAccessToken: configuredPersonalAccessToken,
  userAgent: process.env.JIRA_USER_AGENT,
});

function assigneeName(issue: JiraIssue): string {
  return issue.fields.assignee?.displayName ?? 'Unassigned';
}

function increment(counts: Map<string, number>, name: string): void {
  counts.set(name, (counts.get(name) ?? 0) + 1);
}

function rankedLines(counts: Map<string, number>): string {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([name, count]) => `• ${name}: ${count}`)
    .join('\n') || '• None';
}

function statusLines(issues: JiraIssue[]): string {
  const counts = new Map<string, number>();
  for (const issue of issues) {
    increment(counts, issue.fields.status.name);
  }
  return rankedLines(counts);
}

function issueLines(issues: JiraIssue[]): string {
  return issues
    .map(issue => `• ${issue.key} — ${issue.fields.summary} (${assigneeName(issue)})`)
    .join('\n') || '• None';
}

async function main(): Promise<void> {
  const jql = `project = ${projectKey} AND sprint in openSprints() ORDER BY key ASC`;
  const issues = await jira.searchAllIssues(jql);
  const bugs = issues.filter(issue => issue.fields.issuetype.name.toLowerCase() === 'bug');
  const completed = issues.filter(issue => issue.fields.status.name.toLowerCase().startsWith('done'));
  const deployedToProduction = issues.filter(
    issue => issue.fields.status.name.toLowerCase() === 'done on production',
  );

  const bugsByAssignee = new Map<string, number>();
  const completedByAssignee = new Map<string, number>();
  for (const issue of bugs) {
    increment(bugsByAssignee, assigneeName(issue));
  }
  for (const issue of completed) {
    increment(completedByAssignee, assigneeName(issue));
  }

  const report = [
    `Jira sprint report: ${projectKey}`,
    `Scope: ${issues.length} issues in open sprints`,
    '',
    `Bugs: ${bugs.length}`,
    `Completed: ${completed.length}`,
    `Deployed to production: ${deployedToProduction.length}`,
    '',
    'Bugs by assignee:',
    rankedLines(bugsByAssignee),
    '',
    'Completed tickets by assignee:',
    rankedLines(completedByAssignee),
    '',
    'Tickets deployed to production:',
    issueLines(deployedToProduction),
    '',
    'Status breakdown:',
    statusLines(issues),
  ].join('\n');

  const response = await fetch(configuredWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: report }),
  });

  if (!response.ok) {
    throw new Error(`Google Chat webhook failed: ${response.status} ${await response.text()}`);
  }

  console.log(report);
}

main().catch(error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseBody = typeof error.response?.data === 'string'
      ? error.response.data
      : JSON.stringify(error.response?.data ?? 'No response body');
    console.error(`Jira request failed${status ? ` (${status})` : ''}: ${responseBody}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
});
