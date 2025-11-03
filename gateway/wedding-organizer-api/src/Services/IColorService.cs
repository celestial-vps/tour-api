
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IColorService
    {
        Task<(MessageVM? color, ApiError? err)> CreateAsync(CreateColorDto dto, Guid userOid);
        Task<(MessageVM? color, ApiError? err)> UpdateAsync(Guid oid, UpdateColorDto dto, Guid userOid);
        Task<(MessageVM? color, ApiError? err)> DeleteAsync(Guid oid);
        Task<(ColorVM? color, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<ColorVM> colors, ApiError? err)> FindAllAsync();
        Task<(List<ColorVM> colors, ApiError? err)> FindPageAsync(ColorFilterDto dto, int page, int pageSize );        
    }
}
