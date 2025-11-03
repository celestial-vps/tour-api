
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface ISizeService
    {
        Task<(MessageVM? size, ApiError? err)> CreateAsync(CreateSizeDto dto, Guid userOid);
        Task<(MessageVM? size, ApiError? err)> UpdateAsync(Guid oid, UpdateSizeDto dto, Guid userOid);
        Task<(MessageVM? size, ApiError? err)> DeleteAsync(Guid oid);
        Task<(SizeVM? size, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<SizeVM> sizes, ApiError? err)> FindAllAsync();
        Task<(List<SizeVM> sizes, ApiError? err)> FindPageAsync(SizeFilterDto dto, int page, int pageSize );        
    }
}
