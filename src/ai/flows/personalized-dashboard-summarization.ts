'use server';

/**
 * @fileOverview A personalized dashboard summarization AI agent.
 *
 * - summarizeDashboard - A function that summarizes dashboard information based on user role and activity.
 * - DashboardSummaryInput - The input type for the summarizeDashboard function.
 * - DashboardSummaryOutput - The return type for the summarizeDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DashboardSummaryInputSchema = z.object({
  userRole: z
    .string()
    .describe("The user's role (e.g., Organizer, Approver, Participant, Vendor, Sponsor)."),
  currentActivities: z.string().describe('Description of the user\'s current activities.'),
  events: z.array(z.string()).describe('List of relevant events.'),
  tasks: z.array(z.string()).describe('List of relevant tasks.'),
  updates: z.array(z.string()).describe('List of recent updates.'),
});
export type DashboardSummaryInput = z.infer<typeof DashboardSummaryInputSchema>;

const DashboardSummaryOutputSchema = z.object({
  summary: z.string().describe('A personalized summary of key information and prioritized items.'),
});
export type DashboardSummaryOutput = z.infer<typeof DashboardSummaryOutputSchema>;

export async function summarizeDashboard(input: DashboardSummaryInput): Promise<DashboardSummaryOutput> {
  return summarizeDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDashboardPrompt',
  input: {schema: DashboardSummaryInputSchema},
  output: {schema: DashboardSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in creating personalized dashboard summaries.

  Based on the user's role, current activities, events, tasks and updates, create a concise and informative summary that helps the user quickly understand what requires their attention.

  User Role: {{{userRole}}}
  Current Activities: {{{currentActivities}}}
  Events: {{#each events}}{{{this}}}\n{{/each}}
  Tasks: {{#each tasks}}{{{this}}}\n{{/each}}
  Updates: {{#each updates}}{{{this}}}\n{{/each}}

  Summary:`,
});

const summarizeDashboardFlow = ai.defineFlow(
  {
    name: 'summarizeDashboardFlow',
    inputSchema: DashboardSummaryInputSchema,
    outputSchema: DashboardSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
