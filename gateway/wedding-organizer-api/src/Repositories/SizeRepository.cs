using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class SizeRepository : ISizeRepository
    {
        private readonly AppDbContext _context;

        public SizeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(Size? result, Exception? err)> SaveAsync(Size entity)
        {
            try
            {
                await _context.Sizes.AddAsync(entity); // hanya tracking
                return (entity, null); // tidak save changes
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Save Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(Size? result, Exception? err)> UpdateAsync(Guid oid, Size updatedData)
        {
            try
            {
                var existing = await _context.Sizes.FirstOrDefaultAsync(x => x.Oid == oid);
                if (existing == null)
                    return (null, new Exception("Size not found"));

                existing.SizeName = updatedData.SizeName;                

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
                var size = await _context.Sizes.FindAsync(oid);
                if (size == null)
                    return (false, new Exception("Size not found"));

                _context.Sizes.Remove(size); // hanya tracking
                return (true, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Remove Error: {ex}");
                return (false, ex);
            }
        }

        public async Task<(Size? result, Exception? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var size = await _context.Sizes.FirstOrDefaultAsync(x => x.Oid == oid);
                return (size, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindById Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(List<Size> result, Exception? err)> FindAllAsync()
        {
            try
            {
                var sizes = await _context.Sizes.ToListAsync();
                return (sizes, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAll Error: {ex}");
                return (new List<Size>(), ex);
            }
        }

        public async Task<(List<Size> result, Exception? err)> FindByCriteriaAsync(Func<Size, bool> predicate)
        {
            try
            {
                var filtered = _context.Sizes.Where(predicate).ToList();
                return (filtered, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteria Error: {ex}");
                return (new List<Size>(), ex);
            }
        }

        public async Task<(List<Size> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<Size, bool> predicate)
        {
            try
            {
                var filtered = _context.Sizes.Where(predicate).ToList();
                return (filtered, filtered.Count, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAndCountByCriteria Error: {ex}");
                return (new List<Size>(), 0, ex);
            }
        }

        public async Task<(List<Size> result, int count, Exception? err)> FindByCriteriaPageAsync(int page, int pageSize, SizeFilterDto condition)
        {

            try
            {
                // Bangun predicate filter
                var query = _context.Sizes.AsQueryable();

                if (!string.IsNullOrWhiteSpace(condition.Name))
                {
                    query = query.Where(v => v.Name.Contains(condition.Name));
                }



                // Hitung total data sebelum pagination
                var totalCount = await query.CountAsync();

                // Terapkan pagination
                var filtered = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (filtered, totalCount, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteriaPageAsync Error: {ex}");
                return (new List<Size>(), 0, ex);
            }
        }
    }
 

} 
