import type { LanguageModel } from 'ai';
import type { Member } from '../../backend/types.js';
import type { MemberRef, MemberRefResolver } from '../../shared/member-ref.js';

/** This is deliberately a closed, model-facing shape, not Pick<Member, ...>. */
export interface ModelMemberView { memberRef: MemberRef; planId: string; coverageStatus: 'active' | 'inactive'; }
/** A policy owns the complete output shape, so a new backend field cannot widen it. */
export interface ProjectionPolicy<Record, View> { readonly project: (record: Record) => View; }
export type ModelFacingToolResult = { readonly toolName: string; readonly result: unknown };
export interface BoundaryRun { readonly modelMessages: unknown[]; readonly toolArguments: unknown[]; readonly executedBeforeApproval: boolean; readonly receiptCount: number; }
/** A small, SDK-independent tool seam. The recorder returns these exact execute results. */
export interface BoundaryTool { readonly name: string; execute(input: unknown): Promise<unknown>; }
export interface BoundaryRecorder {
  /** Invoke the supplied model callback with recorded, boundary-checked messages. */
  callModel<Result>(messages: unknown[], invoke: (messages: unknown[]) => Promise<Result>): Promise<Result>;
  /** Wrap tools so their actual model arguments and actual results share one trace. */
  wrapTools<T extends readonly BoundaryTool[]>(tools: T): T;
  /** A snapshot from this recorder, suitable for a trajectory assertion. */
  trace(): BoundaryRun;
}

/** Drop-in replacement for the early-stage resolver; tool signatures do not change. */
export function createTokenResolver(): MemberRefResolver { throw new Error('TODO Stage 06: create deterministic tenant-scoped server-side tokenisation'); }
export function createMemberPolicy(_tokens: MemberRefResolver): ProjectionPolicy<Member, ModelMemberView> { throw new Error('TODO Stage 06: define the explicit Member allowlist'); }
export function project<Record, View>(_record: Record, _policy: ProjectionPolicy<Record, View>): View { throw new Error('TODO Stage 06: project through an explicit model-safe allowlist'); }
export function assertNoSensitiveValues(_payload: unknown, _sensitiveValues: readonly string[]): void { throw new Error('TODO Stage 06: reject sensitive data before it reaches the model'); }
export function safeError(_error: unknown): { error: string } { throw new Error('TODO Stage 06: scrub backend errors before they become model content'); }
/** Every read-tool result must cross this wrapper before it is appended to a model turn. */
export function modelFacingToolResult(_toolName: string, _result: unknown, _sensitiveValues: readonly string[]): ModelFacingToolResult { throw new Error('TODO Stage 06: route actual tool results through the data boundary'); }
/**
 * Records the values which crossed the model boundary while delegating to the
 * original model callback and tools. It deliberately does not manufacture a
 * proposal: callers consume the wrapped tool's real return value.
 */
export function createBoundaryRecorder(_options: { sensitiveValues?: readonly string[] } = {}): BoundaryRecorder { throw new Error('TODO Stage 06: record actual model calls, tool arguments, and wrapped tool results'); }
/**
 * The integration exercise: read real coverage data, wrap each tool result with
 * modelFacingToolResult, and record every model-bound message and tool argument.
 */
export async function runBoundaryAgent(_prompt: string, _tenantId: string, _model: LanguageModel, _options: { resolver?: MemberRefResolver; tools?: readonly BoundaryTool[] } = {}): Promise<BoundaryRun & { readonly toolResults: unknown[] }> { throw new Error('TODO Stage 06: implement a boundary-wrapped mock-model agent run'); }
