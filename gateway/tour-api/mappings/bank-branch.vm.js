async function toBankBranchResponse(branch) {
  return {
    oid: branch.oid,
    bankOid: branch.bankOid,
    branchName: branch.branchName,
    bankAddress: branch.bankAddress,
    createdBy: branch.createdBy,
    createdAt: branch.createdAt,
    lastModifiedBy: branch.lastModifiedBy,
    updatedAt: branch.updatedAt,
    deletedBy: branch.deletedBy,
    deletedAt: branch.deletedAt,
  };
}

async function toBankBranchResponses(branches) {
  const responses = await Promise.all(branches.map(toBankBranchResponse));
  return responses;
}

module.exports = {
  toBankBranchResponse,
  toBankBranchResponses,
};
