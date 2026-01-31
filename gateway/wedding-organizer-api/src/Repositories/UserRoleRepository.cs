using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly AppDbContext _context;

        public UserRoleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(UserRole? result, Exception? err)> SaveAsync(UserRole entity)
        {
            try
            {
                await _context.UserRoles.AddAsync(entity); // hanya tracking
                return (entity, null); // tidak save changes
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Save Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(UserRole? result, Exception? err)> UpdateAsync(Guid oid, UserRole updatedData)
        {
            try
            {
                var existing = await _context.UserRoles.FirstOrDefaultAsync(x => x.Oid == oid);
                if (existing == null)
                    return (null, new Exception("UserRole not found"));

                existing.RoleName = updatedData.RoleName;
                existing.TargetType = updatedData.TargetType;
                existing.IsAdministrative = updatedData.IsAdministrative;
                existing.ReadState = updatedData.ReadState;
                existing.WriteState = updatedData.WriteState;
                existing.CreateState = updatedData.CreateState;
                existing.DeleteState = updatedData.DeleteState;
                existing.NavigateState = updatedData.NavigateState; 

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
                var userRole = await _context.UserRoles.FindAsync(oid);
                if (userRole == null)
                    return (false, new Exception("UserRole not found"));

                _context.UserRoles.Remove(userRole); // hanya tracking
                return (true, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Remove Error: {ex}");
                return (false, ex);
            }
        }

        public async Task<(UserRole? result, Exception? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var userRole = await _context.UserRoles.FirstOrDefaultAsync(x => x.Oid == oid);
                return (userRole, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindById Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(List<UserRole> result, Exception? err)> FindAllAsync()
        {
            try
            {
                var userRoles = await _context.UserRoles.ToListAsync();
                return (userRoles, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAll Error: {ex}");
                return (new List<UserRole>(), ex);
            }
        }

        public async Task<(List<UserRole> result, Exception? err)> FindByCriteriaAsync(Func<UserRole, bool> predicate)
        {
            try
            {
                var filtered =   _context.UserRoles.Where(predicate).ToList();
                return (filtered, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteria Error: {ex}");
                return (new List<UserRole>(), ex);
            }
        }

        public async Task<(List<UserRole> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<UserRole, bool> predicate)
        {
            try
            {
                var filtered = _context.UserRoles.Where(predicate).ToList();
                return (filtered, filtered.Count, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAndCountByCriteria Error: {ex}");
                return (new List<UserRole>(), 0, ex);
            }
        }
    }
}
