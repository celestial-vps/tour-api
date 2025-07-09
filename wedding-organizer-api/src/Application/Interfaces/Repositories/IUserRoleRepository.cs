using WeddingOrganizerAPI.Models;
namespace WeddingOrganizerAPI.Repositories
{
    public interface IUserRoleRepository
    {
        Task<(UserRole? result, Exception? err)> SaveAsync(UserRole entity);
        Task<(UserRole? result, Exception? err)> UpdateAsync(Guid oid, UserRole updatedData);
        Task<(bool result, Exception? err)> RemoveAsync(Guid oid);
        Task<(UserRole? result, Exception? err)> FindByIdAsync(Guid oid);
        Task<(List<UserRole> result, Exception? err)> FindAllAsync();
        Task<(List<UserRole> result, Exception? err)> FindByCriteriaAsync(Func<UserRole, bool> predicate);
        Task<(List<UserRole> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<UserRole, bool> predicate);
    }
}