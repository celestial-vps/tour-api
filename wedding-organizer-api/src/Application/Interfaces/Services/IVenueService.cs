
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IVenueService
    {
        Task<(MessageVM? venue, ApiError? err)> CreateAsync(CreateVenueDto dto, Guid userOid);
        Task<(MessageVM? venue, ApiError? err)> UpdateAsync(Guid oid, UpdateVenueDto dto, Guid userOid);
        Task<(MessageVM? venue, ApiError? err)> DeleteAsync(Guid oid);
        Task<(VenueVM? venue, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<VenueVM> venues, ApiError? err)> FindAllAsync();
        // Optional for future: Paging, filtering, etc.
        // Task<(List<VenueResponse> venues, PaginationMeta pagination, ApiError? err)> FindPageAsync(FilterVenueDto filterDto);
    }
}
