using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public interface IColorRepository
    {
        Task<IEnumerable<Color>> GetAllAsync();
        Task<Color?> GetByIdAsync(int id);
        Task AddAsync(Color color);
        Task UpdateAsync(Color color);
        Task DeleteAsync(Color color);
    }
}
