using WeddingOrganizerAPI.DTOs;

namespace WeddingOrganizerAPI.Services
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetAllAsync();
        Task<ClientDto?> GetByIdAsync(int id);
        Task<ClientDto> CreateAsync(ClientDto dto);
        Task UpdateAsync(int id, ClientDto dto);
        Task DeleteAsync(int id);
    }
}
