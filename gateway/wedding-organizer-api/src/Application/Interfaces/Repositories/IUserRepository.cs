using System.Linq.Expressions;
using WeddingOrganizerAPI.Models;
namespace WeddingOrganizerAPI.Repositories
{
    public interface IUserRepository
    {
        Task<(User? result, Exception? err)> SaveAsync(User entity);
        Task<(User? result, Exception? err)> UpdateAsync(Guid oid, User updatedData);
        Task<(bool result, Exception? err)> RemoveAsync(Guid oid);
        Task<(User? result, Exception? err)> FindByIdAsync(Guid oid);
        Task<(List<User> result, Exception? err)> FindAllAsync();


        // public async Task<(List<User> result, Exception? err)> FindByCriteriaAsync(Expression<Func<User, bool>> predicate)
        Task<(List<User> result, Exception? err)> FindByCriteriaAsync(Expression<Func<User, bool>> predicate);
        Task<(List<User> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<User, bool> predicate);
    }
}