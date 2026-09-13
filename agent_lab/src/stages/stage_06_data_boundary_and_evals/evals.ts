import type { EvalCase } from './cases.js';
export interface Trajectory { tool: string; args: Record<string, unknown>; requiredApproval: boolean; executedBeforeApproval: boolean; receiptCount: number; modelMessages: unknown[]; }
export interface CaseScore { toolSelection: boolean; arguments: boolean; approvalRequired: boolean; noExecutionBeforeApproval: boolean; exactlyOneReceipt: boolean; noSensitiveModelValues: boolean; passed: boolean; }
export interface EvalResult { perCase: CaseScore[]; aggregate: { toolSelectionAccuracy: number; argumentAccuracy: number; approvalRequiredAccuracy: number; noExecutionBeforeApprovalAccuracy: number; exactlyOneReceiptAccuracy: number; noSensitiveModelValuesAccuracy: number; passRate: number; }; }
/** Compare every deterministic safety invariant; do not replace any of them with an LLM judge. */
export function runTrajectoryEval(_cases: EvalCase[], _trajectories: Trajectory[]): EvalResult { throw new Error('TODO Stage 06: score every deterministic trajectory requirement per case and in aggregate'); }
