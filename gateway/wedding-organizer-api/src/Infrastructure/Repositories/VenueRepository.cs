using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class VenueRepository : IVenueRepository
    {
        private readonly AppDbContext _context;

        public VenueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(Venue? result, Exception? err)> SaveAsync(Venue entity)
        {
            try
            {
                await _context.Venues.AddAsync(entity); // hanya tracking
                return (entity, null); // tidak save changes
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Save Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(Venue? result, Exception? err)> UpdateAsync(Guid oid, Venue updatedData)
        {
            try
            {
                var existing = await _context.Venues.FirstOrDefaultAsync(x => x.Oid == oid);
                if (existing == null)
                    return (null, new Exception("Venue not found"));

                existing.Name = updatedData.Name;
                existing.Location = updatedData.Location;
                existing.Capacity = updatedData.Capacity;
                existing.Price = updatedData.Price;
                existing.Contact = updatedData.Contact; 

                return (existing, null); // hanya tracking
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Update Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(bool result, Exception? err)> RemoveAsync(Guid oid)
        {
            try
            {
                var venue = await _context.Venues.FindAsync(oid);
                if (venue == null)
                    return (false, new Exception("Venue not found"));

                _context.Venues.Remove(venue); // hanya tracking
                return (true, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Remove Error: {ex}");
                return (false, ex);
            }
        }

        public async Task<(Venue? result, Exception? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var venue = await _context.Venues.FirstOrDefaultAsync(x => x.Oid == oid);
                return (venue, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindById Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(List<Venue> result, Exception? err)> FindAllAsync()
        {
            try
            {
                var venues = await _context.Venues.ToListAsync();
                return (venues, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAll Error: {ex}");
                return (new List<Venue>(), ex);
            }
        }

        public async Task<(List<Venue> result, Exception? err)> FindByCriteriaAsync(Func<Venue, bool> predicate)
        {
            try
            {
                var filtered =   _context.Venues.Where(predicate).ToList();
                return (filtered, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteria Error: {ex}");
                return (new List<Venue>(), ex);
            }
        }

        public async Task<(List<Venue> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<Venue, bool> predicate)
        {
            try
            {
                var filtered = _context.Venues.Where(predicate).ToList();
                return (filtered, filtered.Count, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAndCountByCriteria Error: {ex}");
                return (new List<Venue>(), 0, ex);
            }
        }
    }
}
