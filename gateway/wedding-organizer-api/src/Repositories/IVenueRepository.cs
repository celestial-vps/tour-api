using WeddingOrganizerAPI.DTOs;
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
        // FindByCriteriaPage(ctx context.Context, tx *sql.Tx,  ) ([]models.TarifDomain, error)
        Task<(List<Venue> result, int count, Exception? err)> FindByCriteriaPageAsync(int page, int pageSize, VenueFilterDto condition);
        Task<(List<Venue> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<Venue, bool> predicate);
    }
}