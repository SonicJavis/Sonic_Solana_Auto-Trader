import { buildExecutionBoundaryState } from './execution-boundary-states.js';
export function buildTransactionConstructionIntent(input:{constructionIntentId:string;intentKind:string;intentStatus:'ready'|'blocked'|'rejected'}){
  const state=buildExecutionBoundaryState({boundaryStateId:input.constructionIntentId,boundaryStateKind:input.intentStatus==='rejected'?'unsafe_rejected':input.intentStatus==='blocked'?'blocked':'design_only',stateStatus:input.intentStatus==='rejected'?'rejected':input.intentStatus==='blocked'?'blocked':'design_ready'});
  return { constructionIntentId: input.constructionIntentId, intentKind: input.intentKind, mockOnly: true, orderCreationAllowed: false, realTransactionObjectAllowed: false, dispatchAllowed: false, intentStatus: input.intentStatus, state } as const;
}
