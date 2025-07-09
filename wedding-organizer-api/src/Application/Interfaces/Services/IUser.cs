
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<(MessageVM? user, ApiError? err)> CreateAsync(CreateUserDto dto, Guid userOid);
        Task<(MessageVM? user, ApiError? err)> UpdateAsync(Guid oid, UpdateUserDto dto, Guid userOid);
        Task<(MessageVM? user, ApiError? err)> DeleteAsync(Guid oid);
        Task<(UserVM? user, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<UserVM> users, ApiError? err)> FindAllAsync();
        // Optional for future: Paging, filtering, etc.
        // Task<(List<UserResponse> users, PaginationMeta pagination, ApiError? err)> FindPageAsync(FilterUserDto filterDto);
    }
}
