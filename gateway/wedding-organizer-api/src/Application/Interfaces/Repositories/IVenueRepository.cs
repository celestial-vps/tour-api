using WeddingOrganizerAPI.Models;
namespace WeddingOrganizerAPI.Repositories
{
    public interface IVenueRepository
    {
        Task<(Venue? result, Exception? err)> SaveAsync(Venue entity);
        Task<(Venue? result, Exception? err)> UpdateAsync(Guid oid, Venue updatedData);
        Task<(bool result, Exception? err)> RemoveAsync(Guid oid);
        Task<(Venue? result, Exception? err)> FindByIdAsync(Guid oid);
        Task<(List<Venue> result, Exception? err)> FindAllAsync();
        Task<(List<Venue> result, Exception? err)> FindByCriteriaAsync(Func<Venue, bool> predicate);
        Task<(List<Venue> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<Venue, bool> predicate);
    }
}