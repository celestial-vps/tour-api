
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface ISouvenirService
    {
        Task<(MessageVM? souvenir, ApiError? err)> CreateAsync(CreateSouvenirDto dto, Guid userOid);
        Task<(MessageVM? souvenir, ApiError? err)> UpdateAsync(Guid oid, UpdateSouvenirDto dto, Guid userOid);
        Task<(MessageVM? souvenir, ApiError? err)> DeleteAsync(Guid oid);
        Task<(SouvenirVM? souvenir, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<SouvenirVM> souvenirs, ApiError? err)> FindAllAsync();
        Task<(List<SouvenirVM> souvenirs, ApiError? err)> FindPageAsync(SouvenirFilterDto dto, int page, int pageSize );        
    }
}
