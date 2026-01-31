using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(User? result, Exception? err)> SaveAsync(User entity)
        {
            try
            {
                await _context.Users.AddAsync(entity); // hanya tracking
                return (entity, null); // tidak save changes
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Save Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(User? result, Exception? err)> UpdateAsync(Guid oid, User updatedData)
        {
            try
            {
                var existing = await _context.Users.FirstOrDefaultAsync(x => x.Oid == oid);
                if (existing == null)
                    return (null, new Exception("User not found"));

                existing.Email = updatedData.Email;
                existing.Password = updatedData.Password;
                existing.AndroidToken = updatedData.AndroidToken;
                existing.ExpiredTime = updatedData.ExpiredTime;
                existing.IsActive = updatedData.IsActive;

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
                var user = await _context.Users.FindAsync(oid);
                if (user == null)
                    return (false, new Exception("User not found"));

                _context.Users.Remove(user); // hanya tracking
                return (true, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Remove Error: {ex}");
                return (false, ex);
            }
        }

        public async Task<(User? result, Exception? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Oid == oid);
                return (user, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindById Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(List<User> result, Exception? err)> FindAllAsync()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                return (users, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAll Error: {ex}");
                return (new List<User>(), ex);
            }
        }

        // public async Task<(List<User> result, Exception? err)> FindByCriteriaAsync(Func<User, bool> predicate)

        public async Task<(List<User> result, Exception? err)> FindByCriteriaAsync(Expression<Func<User, bool>> predicate)
        {
            try
            {
                // var filtered =   _context.Users.Where(predicate).ToList();
                var filtered = await _context.Users
                           .Include(u => u.UserRole)
                           .Where(predicate)
                           .ToListAsync();

                return (filtered, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteria Error: {ex}");
                return (new List<User>(), ex);
            }
        }

        public async Task<(List<User> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<User, bool> predicate)
        {
            try
            {
                var filtered = _context.Users.Where(predicate).ToList();
                return (filtered, filtered.Count, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAndCountByCriteria Error: {ex}");
                return (new List<User>(), 0, ex);
            }
        }
    }
}
