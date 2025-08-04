using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext _context;
        public ClientRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Client>> GetAllAsync()
            => await _context.Clients.ToListAsync();

        public async Task<Client?> GetByIdAsync(int id)
            => await _context.Clients.FindAsync(id);

        public async Task AddAsync(Client client)
        {
            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Client client)
        {
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
        }
    }
}
