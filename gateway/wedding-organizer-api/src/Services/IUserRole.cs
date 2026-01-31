
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IUserRoleService
    {
        Task<(MessageVM? userRole, ApiError? err)> CreateAsync(CreateUserRoleDto dto, Guid userOid);
        Task<(MessageVM? userRole, ApiError? err)> UpdateAsync(Guid oid, UpdateUserRoleDto dto, Guid userOid);
        Task<(MessageVM? userRole, ApiError? err)> DeleteAsync(Guid oid);
        Task<(UserRoleVM? userRole, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<UserRoleVM> userRoles, ApiError? err)> FindAllAsync();
        // Optional for future: Paging, filtering, etc.
        // Task<(List<UserRoleResponse> userRoles, PaginationMeta pagination, ApiError? err)> FindPageAsync(FilterUserRoleDto filterDto);
    }
}
