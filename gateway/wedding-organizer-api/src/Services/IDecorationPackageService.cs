
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IDecorationPackageService
    {
        Task<(MessageVM? decorationPackage, ApiError? err)> CreateAsync(CreateDecorationPackageDto dto, Guid userOid);
        Task<(MessageVM? decorationPackage, ApiError? err)> UpdateAsync(Guid oid, UpdateDecorationPackageDto dto, Guid userOid);
        Task<(MessageVM? decorationPackage, ApiError? err)> DeleteAsync(Guid oid);
        Task<(DecorationPackageVM? decorationPackage, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<DecorationPackageVM> decorationPackages, ApiError? err)> FindAllAsync();
        Task<(List<DecorationPackageVM> decorationPackages, ApiError? err)> FindPageAsync(DecorationPackageFilterDto dto, int page, int pageSize );        
    }
}
