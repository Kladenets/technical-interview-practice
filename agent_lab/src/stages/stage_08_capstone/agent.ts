import type { LanguageModel } from 'ai';
import { createProposeCoverageChange } from '../stage_03_propose_not_execute/agent.js';
import { InMemoryApprovalStore, decide, requestApproval } from '../stage_04_human_approval/agent.js';
import { executeApproved } from '../stage_05_execute_and_receipt/agent.js';
import { createBoundaryRecorder, createMemberPolicy, createTokenResolver, modelFacingToolResult, type BoundaryRecorder, type BoundaryRun } from '../stage_06_data_boundary_and_evals/agent.js';
import { computeBindingHash } from '../../shared/action-envelope.js';
import type { ApprovalStore, AuditEvent, PendingAction, Receipt } from '../../shared/approval-store.js';
import type { Actor } from '../../shared/authorization.js';
import type { MemberRefResolver } from '../../shared/member-ref.js';

/** Server-derived identity. Prompt text and model tool arguments never supply it. */
export interface SessionContext { actor: Actor; }
export interface GovernedActionWorkflow {
  /** Runs the model-facing, boundary-wrapped proposal turn and persists its envelope. */
  submitPrompt(prompt: string): Promise<PendingAction>;
  /** Records a reviewer decision outside the model turn. */
  decide(actionId: string, decision: 'approved' | 'rejected', reason?: string): Promise<PendingAction>;
  /** Revalidates and executes an approved action, returning its idempotent receipt. */
  execute(actionId: string): Promise<Receipt>;
  /** Reads workflow-produced audit history; it never accepts caller-provided events. */
  auditTrail(actionId: string): Promise<AuditEvent[]>;
  /** Exposes recorded model-bound data so the integration suite can enforce Stage 06. */
  modelTrace(): BoundaryRun;
  /** Inspection seams for the persisted action and idempotent receipt. */
  action(actionId: string): Promise<PendingAction | undefined>;
  receipt(idempotencyKey: string): Promise<Receipt | undefined>;
}
export interface GovernedActionDependencies {
  model: LanguageModel;
  session: SessionContext;
  store?: ApprovalStore;
  /** The Stage 06 tokenising resolver used by both the model view and Stage 03 proposal tool. */
  memberRefs?: MemberRefResolver;
  /** Injectable Stage 06 recorder; submitPrompt must execute the wrapped Stage 03 tool, not reconstruct a trace. */
  boundary?: BoundaryRecorder;
}

/**
 * Stage 08 composes the earlier stage contracts. Do not replace these calls with
 * capstone-local versions: the exercise is to make their contracts work together.
 */
export function createGovernedActionWorkflow(_deps: GovernedActionDependencies): GovernedActionWorkflow {
  void createProposeCoverageChange;
  void InMemoryApprovalStore;
  void requestApproval;
  void decide;
  void executeApproved;
  void createTokenResolver;
  void createMemberPolicy;
  void modelFacingToolResult;
  void createBoundaryRecorder;
  void computeBindingHash;
  throw new Error('TODO Stage 08: compose the proposal, approval, execution, receipt, audit, and data-boundary stages');
}
