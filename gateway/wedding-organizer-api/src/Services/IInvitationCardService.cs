
using Mappings;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;

namespace WeddingOrganizerAPI.Services.Interfaces
{
    public interface IInvitationCardService
    {
        Task<(MessageVM? invitaionCard, ApiError? err)> CreateAsync(CreateInvitationCardDto dto, Guid userOid);
        Task<(MessageVM? invitaionCard, ApiError? err)> UpdateAsync(Guid oid, UpdateInvitationCardDto dto, Guid userOid);
        Task<(MessageVM? invitaionCard, ApiError? err)> DeleteAsync(Guid oid);
        Task<(InvitationCardVM? invitaionCard, ApiError? err)> FindByIdAsync(Guid oid);
        Task<(List<InvitationCardVM> invitaionCards, ApiError? err)> FindAllAsync();
        Task<(List<InvitationCardVM> invitaionCards, ApiError? err)> FindPageAsync(InvitationCardFilterDto dto, int page, int pageSize );        
    }
}
