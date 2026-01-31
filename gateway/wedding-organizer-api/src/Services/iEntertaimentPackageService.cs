
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IEntertaimentPackageService
    {
        Task<(MessageVM? entertaimentPackage, ApiError? err)> CreateAsync(CreateEntertaimentPackageDto dto, Guid userOid);
        Task<(MessageVM? entertaimentPackage, ApiError? err)> UpdateAsync(Guid oid, UpdateEntertaimentPackageDto dto, Guid userOid);
        Task<(MessageVM? entertaimentPackage, ApiError? err)> DeleteAsync(Guid oid);
        Task<(EntertaimentPackageVM? entertaimentPackage, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<EntertaimentPackageVM> entertaimentPackages, ApiError? err)> FindAllAsync();
        Task<(List<EntertaimentPackageVM> entertaimentPackages, ApiError? err)> FindPageAsync(EntertaimentPackageFilterDto dto, int page, int pageSize );        
    }
}
