import { buildExecutionApprovalBoundary } from './approval-boundaries.js';
export function buildMockInstructionPlan(input:{instructionPlanId:string;planKind:string;instructionCount:number;planStatus:'ready'|'blocked'|'rejected'}){
  return { instructionPlanId: input.instructionPlanId, planKind: input.planKind, instructionCount: Math.max(0, Math.trunc(input.instructionCount)), encodedInstructionDataAllowed: false, programInvocationAllowed: false, accountMutationAllowed: false, planStatus: input.planStatus, approvalBoundary: buildExecutionApprovalBoundary({approvalBoundaryId:`${input.instructionPlanId}-approval`,approvalStatus:input.planStatus==='ready'?'required':input.planStatus==='blocked'?'pending':'rejected'}) } as const;
}
